const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function tokenFrom(request) {
  const auth = request.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

export async function onRequestPost(context) {
  if (!context.env.DB) return json({ ok: false, error: 'D1 binding DB is missing.' }, 500);
  if (!context.env.ANALYSIS_CALLBACK_TOKEN) return json({ ok: false, error: 'Callback endpoint is not configured.' }, 503);
  if (tokenFrom(context.request) !== context.env.ANALYSIS_CALLBACK_TOKEN) return json({ ok: false, error: 'Unauthorized.' }, 401);

  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON.' }, 400);
  }

  if (typeof body?.submission_id !== 'string' || !body.submission_id) return json({ ok: false, error: 'Missing submission_id.' }, 400);
  if (body.analysis == null) return json({ ok: false, error: 'Missing analysis.' }, 400);

  const result = await context.env.DB.prepare(`
    UPDATE audit_submissions
    SET analysis_status = 'complete', analysis_json = ?, analysis_updated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE submission_id = ?
  `).bind(JSON.stringify(body.analysis), body.submission_id).run();

  if (!result.meta?.changes) return json({ ok: false, error: 'Unknown submission_id.' }, 404);
  return json({ ok: true, submission_id: body.submission_id });
}

export function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405);
}
