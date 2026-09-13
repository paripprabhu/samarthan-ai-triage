import { neon } from '@neondatabase/serverless'

// Daily per-IP cap on the hosted demo, since triage calls hit a paid OpenAI key.
// Bring your own OPENAI_API_KEY (see .env.example) and this limit no longer applies to you locally —
// it only guards the shared hosted deployment.
const MAX_PER_DAY = 1

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

export async function checkDailyLimit(req: Request): Promise<{ allowed: boolean; ip: string }> {
  const dbUrl = process.env.DATABASE_URL
  // No DB configured (e.g. a local BYO-key setup) — nothing to gate against, allow.
  if (!dbUrl) return { allowed: true, ip: 'local' }

  const ip = getClientIp(req)
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD (UTC)
  const sql = neon(dbUrl)

  const rows = await sql`
    insert into daily_rate_limits (ip, day, count)
    values (${ip}, ${today}, 1)
    on conflict (ip, day) do update
      set count = daily_rate_limits.count + 1
      where daily_rate_limits.count < ${MAX_PER_DAY}
    returning count
  `

  // If the WHERE clause blocked the update (limit already hit), no row comes back.
  const allowed = rows.length > 0
  return { allowed, ip }
}
