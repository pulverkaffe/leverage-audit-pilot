const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function validString(value, max = 500) {
  return typeof value === 'string' && value.length > 0 && value.length <= max;
}

async function markForwarding(db, submissionId, status) {
  try {
    await db.prepare(`
      UPDATE audit_submissions
      SET analysis_status = ?, analysis_updated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE submission_id = ?
    `).bind(status, submissionId).run();
  } catch (error) {
    console.error('Could not update analysis forwarding status', error);
  }
}

async function forwardForAnalysis(env, payload) {
  if (!env.EXTERNAL_ANALYSIS_URL) return;

  await markForwarding(env.DB, payload.submission_id, 'forwarding');

  try {
    const headers = { 'content-type': 'application/json' };
    if (env.EXTERNAL_ANALYSIS_TOKEN) {
      headers.authorization = `Bearer ${env.EXTERNAL_ANALYSIS_TOKEN}`;
    }

    const response = await fetch(env.EXTERNAL_ANALYSIS_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contract_version: 'leverage-audit-analysis-v1',
        callback_path: '/api/analysis-result',
        submission_id: payload.submission_id,
        participant_id: payload.participant_id,
        audit_version: payload.version,
        diagnostic: payload.diagnostic,
        answers: payload.answers,
        timings: payload.timings
      })
    });

    await markForwarding(env.DB, payload.submission_id, response.ok ? 'forwarded' : `forward_failed_${response.status}`);
  } catch (error) {
    console.error('External analysis forwarding failed', error);
    await markForwarding(env.DB, payload.submission_id, 'forward_failed');
  }
}

export async function onRequestPost(context) {
  if (!context.env.DB) return json({ ok: false, error: 'D1 binding DB is missing.' }, 500);

  const contentLength = Number(context.request.headers.get('content-length') || 0);
  if (contentLength > 250_000) return json({ ok: false, error: 'Payload too large.' }, 413);

  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON.' }, 400);
  }

  if (!validString(payload?.submission_id, 100)) return json({ ok: false, error: 'Missing submission_id.' }, 400);
  if (!validString(payload?.participant_id, 100)) return json({ ok: false, error: 'Missing participant_id.' }, 400);
  if (!validString(payload?.version, 100)) return json({ ok: false, error: 'Missing version.' }, 400);
  if (!payload?.answers || typeof payload.answers !== 'object') return json({ ok: false, error: 'Missing answers.' }, 400);
  if (!payload?.diagnostic || typeof payload.diagnostic !== 'object') return json({ ok: false, error: 'Missing diagnostic.' }, 400);

  const completedAt = validString(payload.completed_at, 100) ? payload.completed_at : new Date().toISOString();
  const duration = Number.isFinite(payload.duration_seconds) ? Math.max(0, Math.round(payload.duration_seconds)) : null;
  const userAgent = (context.request.headers.get('user-agent') || '').slice(0, 500);
  const externalEnabled = Boolean(context.env.EXTERNAL_ANALYSIS_URL);

  try {
    await context.env.DB.prepare(`
      INSERT INTO audit_submissions (
        submission_id, participant_id, audit_version, started_at, completed_at,
        duration_seconds, answers_json, timings_json, diagnostic_json,
        analysis_status, user_agent, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(submission_id) DO UPDATE SET
        participant_id = excluded.participant_id,
        audit_version = excluded.audit_version,
        started_at = excluded.started_at,
        completed_at = excluded.completed_at,
        duration_seconds = excluded.duration_seconds,
        answers_json = excluded.answers_json,
        timings_json = excluded.timings_json,
        diagnostic_json = excluded.diagnostic_json,
        user_agent = excluded.user_agent,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      payload.submission_id,
      payload.participant_id,
      payload.version,
      payload.started_at || null,
      completedAt,
      duration,
      JSON.stringify(payload.answers),
      JSON.stringify(payload.timings || {}),
      JSON.stringify(payload.diagnostic),
      externalEnabled ? 'queued' : 'not_requested',
      userAgent
    ).run();
  } catch (error) {
    console.error('D1 insert failed', error);
    return json({ ok: false, error: 'Could not save audit.' }, 500);
  }

  if (externalEnabled) {
    context.waitUntil(forwardForAnalysis(context.env, payload));
  }

  return json({
    ok: true,
    submission_id: payload.submission_id,
    analysis_forwarding: externalEnabled ? 'queued' : 'disabled'
  });
}

export function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405);
}
