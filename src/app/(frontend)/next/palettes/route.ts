import { NextRequest } from 'next/server'

import { getTheme, listThemes } from '@/themes/kitty'

// palette picker source: all theme names, or ?name=X for one; cached a day
export async function GET(req: NextRequest): Promise<Response> {
  const name = req.nextUrl.searchParams.get('name')
  try {
    if (!name) return Response.json(await listThemes())
    const colors = await getTheme(name)
    return colors ? Response.json(colors) : new Response('Unknown theme', { status: 404 })
  } catch {
    return new Response('The theme repository is unreachable right now.', { status: 502 })
  }
}
