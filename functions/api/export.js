function tokenFrom(request) {
  const auth = request.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

function csvCell(value) {
  const text = value == null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function safeParse(text, fallback = {}) {
  try { return JSON.parse(text); } catch { return fallback; }
}

function flattenRow(row) {
  const answers = safeParse(row.answers_json);
  const diagnostic = safeParse(row.diagnostic_json);
  const flat = {
    submission_id: row.submission_id,
    participant_id: row.participant_id,
    audit_version: row.audit_version,
    started_at: row.started_at,
    completed_at: row.completed_at,
    duration_seconds: row.duration_seconds,
    primary_pattern: diagnostic.primary_pattern || '',
    secondary_pattern: diagnostic.secondary_pattern || '',
    decision_signal: diagnostic.signals?.decision?.level || '',
    intervention_signal: diagnostic.signals?.intervention?.level || '',
    coordination_signal: diagnostic.signals?.coordination?.level || '',
    availability_signal: diagnostic.signals?.availability?.level || '',
    executive_attention_cost: diagnostic.executive_attention_cost || '',
    evidence_level: diagnostic.evidence?.level || '',
    analysis_status: row.analysis_status || '',
    created_at: row.created_at || '',
    updated_at: row.updated_at || ''
  };

  const ids = ['C1','C2','C3','C4','M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12','H1','H2','H3','H4','H5','H6','H7','H8','H9'];
  for (const id of ids) {
    const a = answers[id];
    flat[`q_${id}`] = a ? (Array.isArray(a.labels) ? a.labels.join(' | ') : (a.label ?? '')) : '';
    flat[`score_${id}`] = a && !a.missing && a.value != null && !Array.isArray(a.value) ? a.value : '';
  }
  return flat;
}

export async function onRequestGet(context) {
  if (!context.env.DB) return new Response('D1 binding DB is missing.', { status: 500 });
  if (!context.env.EXPORT_TOKEN) return new Response('Export endpoint is not configured.', { status: 503 });
  if (tokenFrom(context.request) !== context.env.EXPORT_TOKEN) return new Response('Unauthorized', { status: 401 });

  const url = new URL(context.request.url);
  const format = (url.searchParams.get('format') || 'csv').toLowerCase();
  const limit = Math.min(5000, Math.max(1, Number(url.searchParams.get('limit') || 1000)));

  const { results = [] } = await context.env.DB.prepare(`
    SELECT submission_id, participant_id, audit_version, started_at, completed_at,
           duration_seconds, answers_json, timings_json, diagnostic_json,
           analysis_status, analysis_json, analysis_updated_at, created_at, updated_at
    FROM audit_submissions
    ORDER BY completed_at DESC
    LIMIT ?
  `).bind(limit).all();

  if (format === 'json') {
    return new Response(JSON.stringify(results.map(row => ({
      ...row,
      answers: safeParse(row.answers_json),
      timings: safeParse(row.timings_json),
      diagnostic: safeParse(row.diagnostic_json),
      analysis: row.analysis_json ? safeParse(row.analysis_json, null) : null,
      answers_json: undefined,
      timings_json: undefined,
      diagnostic_json: undefined,
      analysis_json: undefined
    })), null, 2), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'content-disposition': 'attachment; filename="leverage-audit-export.json"',
        'cache-control': 'no-store'
      }
    });
  }

  const flattened = results.map(flattenRow);
  const headers = flattened.length ? Object.keys(flattened[0]) : ['submission_id','participant_id','audit_version','completed_at'];
  const lines = [headers.map(csvCell).join(',')];
  for (const row of flattened) lines.push(headers.map(h => csvCell(row[h])).join(','));

  return new Response('\uFEFF' + lines.join('\r\n'), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="leverage-audit-export.csv"',
      'cache-control': 'no-store'
    }
  });
}

export function onRequest() {
  return new Response('Method not allowed', { status: 405 });
}
