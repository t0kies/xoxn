import type { Metadata } from 'next'

import { ResumePage, resumeMetadata } from '@/Resume/resume-page'

// Rendered per request (the data itself is cached under the global_resume
// tag): Railway's build can't reach Postgres, so this must not prerender.
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ target: string }>
}

export default async function Page({ params }: Args) {
  const { target } = await params
  return <ResumePage targetSlug={decodeURIComponent(target)} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { target } = await params
  return resumeMetadata({ targetSlug: decodeURIComponent(target) })
}
