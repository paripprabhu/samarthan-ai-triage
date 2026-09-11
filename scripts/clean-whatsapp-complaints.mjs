import { neon } from '@neondatabase/serverless'
import fs from 'node:fs'
import path from 'node:path'

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
    }
  }
}

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  console.error('DATABASE_URL not found!')
  process.exit(1)
}

const sql = neon(dbUrl)

async function main() {
  console.log('--- Inspecting complaints in Neon DB ---')
  const allRows = await sql`
    SELECT incident_id, citizen_phone, fraud_type, amount, fraudster_identifier, bank_name, saved_at
    FROM complaints
    ORDER BY saved_at DESC
  `
  console.log(`Total complaints in DB: ${allRows.length}`)

  // Identify WhatsApp complaints
  const waRows = await sql`
    SELECT incident_id, citizen_phone, fraud_type, amount, fraudster_identifier, bank_name, saved_at
    FROM complaints
    WHERE citizen_phone IS NOT NULL
       OR incident_id = '28683882633151'
       OR updates::text ILIKE '%WhatsApp%'
       OR status_history::text ILIKE '%WhatsApp%'
    ORDER BY saved_at DESC
  `
  console.log(`\nFound ${waRows.length} WhatsApp-related complaint(s):`)
  for (const r of waRows) {
    console.log(` - ID: ${r.incident_id} | Phone: ${r.citizen_phone} | Type: ${r.fraud_type} | Amount: ₹${r.amount} | Date: ${r.saved_at}`)
  }

  if (waRows.length > 0) {
    await sql`
      DELETE FROM complaints
      WHERE citizen_phone IS NOT NULL
         OR incident_id = '28683882633151'
         OR updates::text ILIKE '%WhatsApp%'
         OR status_history::text ILIKE '%WhatsApp%'
    `
    console.log(`\n✅ Deleted ${waRows.length} WhatsApp complaint(s) from Neon DB.`)
  } else {
    console.log('\nNo WhatsApp complaints found to delete.')
  }

  const remaining = await sql`SELECT count(*) as count FROM complaints`
  console.log(`Remaining complaints in DB: ${remaining[0].count}`)

  // Also clean local whatsapp session files
  const sessionFiles = [
    path.resolve(process.cwd(), '.whatsapp_sessions.json'),
    path.resolve(process.cwd(), '.whatsapp_sessions.newmode.json')
  ]

  for (const file of sessionFiles) {
    if (fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify({}, null, 2), 'utf-8')
      console.log(`Reset ${path.basename(file)} to empty object.`)
    }
  }

  console.log('\n✅ All WhatsApp complaints and session caches cleared!')
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
