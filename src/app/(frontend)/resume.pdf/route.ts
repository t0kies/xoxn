import { NextRequest } from 'next/server'

import { canViewResume, findTarget, getResume } from '@/Resume/data'
import { renderResumePdf } from '@/Resume/pdf'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaFileUrl } from '@/utilities/media-file-url'

// Built per request from the cached resume data.
export const dynamic = 'force-dynamic'

// rendered PDFs keyed by updatedAt, so edits miss the cache; only real targets get here
const rendered = new Map<string, Uint8Array>()
const MAX_RENDERED = 20

// Six-digit hex, so the PDF styles can append an alpha channel.
const hex6 = (value: null | string | undefined, fallback: string) => {
  const match = value?.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!match) return fallback
  const digits = match[1]
  return `#${digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits}`
}

// /resume.pdf[?for=<slug>--<key>], same access as the page; an uploaded PDF wins for the main one
export async function GET(req: NextRequest): Promise<Response> {
  const resume = await getResume()
  if (!resume?.name || !(await canViewResume(resume)))
    return new Response('Not found', { status: 404 })

  const slug = req.nextUrl.searchParams.get('for')
  const target = slug ? findTarget(resume, slug) : null
  if (slug && !target) return new Response('Not found', { status: 404 })

  const uploaded = !target && getMediaFileUrl(resume.pdf)
  if (uploaded) return Response.redirect(new URL(uploaded, req.url), 302)

  const appearance = await getCachedGlobal('appearance', 0)()
  const colors = {
    ink: hex6(appearance?.colors?.ink, '#14171a'),
    accent: hex6(appearance?.colors?.accent, '#0a7d5a'),
  }
  const cacheKey = [resume.updatedAt, target?.id ?? '', colors.ink, colors.accent].join('|')
  let pdf = rendered.get(cacheKey)
  if (!pdf) {
    pdf = new Uint8Array(await renderResumePdf({ colors, resume, target }))
    if (rendered.size >= MAX_RENDERED) rendered.delete(rendered.keys().next().value!)
    rendered.set(cacheKey, pdf)
  }

  const name = `${resume.name}${target ? ` - ${target.company}` : ''} - Resume`.replace(
    /[^\w .-]+/g,
    '',
  )
  return new Response(pdf.slice(), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${name}.pdf"`,
      // Tailored versions name the company; keep them out of shared caches and search.
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
