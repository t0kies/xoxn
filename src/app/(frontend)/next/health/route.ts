import config from '@payload-config'
import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

// Railway healthcheck; the first getPayload() runs pending migrations
export async function GET(): Promise<Response> {
  try {
    const payload = await getPayload({ config })
    await payload.db.drizzle.execute(sql`select 1`)

    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ ok: false }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
