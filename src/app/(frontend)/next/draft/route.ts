import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'

import { isOwner } from '@/access/roles'

// drafts toggle: /next/draft?mode=on|off&path=/x; on needs the owner, relative paths only
export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') || '/'
  const target = path.startsWith('/') && !path.startsWith('//') ? path : '/'
  const draft = await draftMode()

  if (searchParams.get('mode') === 'on') {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })
    if (!isOwner(user)) return new Response('Not allowed', { status: 403 })
    draft.enable()
  } else {
    draft.disable()
  }

  redirect(target)
}
