import type { Metadata } from 'next'

import { ResumePage, resumeMetadata } from '@/Resume/resume-page'

// Rendered per request (the data itself is cached under the global_resume
// tag): Railway's build can't reach Postgres, so this must not prerender.
export const dynamic = 'force-dynamic'

export default function Page() {
  return <ResumePage />
}

export function generateMetadata(): Promise<Metadata> {
  return resumeMetadata({})
}
