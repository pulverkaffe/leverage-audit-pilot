export async function onRequestGet(context) {
  const checks = { function: true, d1: false };
  if (context.env.DB) {
    try {
      await context.env.DB.prepare('SELECT 1 AS ok').first();
      checks.d1 = true;
    } catch (error) {
      console.error('D1 health check failed', error);
    }
  }
  return Response.json({ ok: checks.function && checks.d1, checks }, { status: checks.d1 ? 200 : 500 });
}
