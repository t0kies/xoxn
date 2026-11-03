import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import React from 'react'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { canViewResume, findTarget, getResume, tailorFor } from './data'
import { Showcase } from './showcase'
import { ResumeSheet } from './sheet'
import { ResumeToolbar } from './toolbar'

// Renders /resume (no target) or a tailored /resume/<slug>--<key>.
export async function ResumePage({ targetSlug }: { targetSlug?: string }) {
  const resume = await getResume()
  if (!resume?.name || !(await canViewResume(resume))) notFound()

  const target = targetSlug ? findTarget(resume, targetSlug) : null
  if (targetSlug && !target) notFound()

  return (
    <main className="resume-page container flex flex-col gap-[1lh] pt-[calc(var(--header-height)+2lh)] pb-[3lh]">
      <div className="mx-auto flex w-full max-w-[60rem] flex-col gap-4">
        {!resume.enabled && (
          <p className="resume-toolbar border-2 border-dashed border-line px-[2ch] py-[0.5lh] text-sm text-body before:text-link before:content-['!_']">
            Only admins can see this: the resume isn&apos;t published yet (Resume → &quot;Publish
            /resume&quot;).
          </p>
        )}
        <ResumeToolbar
          pdfHref={target ? `/resume.pdf?for=${encodeURIComponent(targetSlug!)}` : '/resume.pdf'}
        />
        <ResumeSheet resume={resume} target={target} />
      </div>
      <Showcase
        includeRest={resume.projectsOnSheet === false}
        projects={tailorFor(target).items('projects', resume.projects)}
      />
    </main>
  )
}

export async function resumeMetadata({ targetSlug }: { targetSlug?: string }): Promise<Metadata> {
  const resume = await getResume()
  if (!resume?.name) return {}

  const target = targetSlug ? findTarget(resume, targetSlug) : null
  const title = target
    ? `${resume.name} · for ${target.company}`
    : `${resume.name} · ${resume.headline}`
  const description = (target?.summary || resume.summary || resume.headline || '').slice(0, 160)

  return {
    title,
    description,
    alternates: { canonical: '/resume' },
    // Unlisted: sent directly, never in search results (next.config.ts also
    // sends X-Robots-Tag for /resume and the PDF).
    robots: { index: false, follow: false },
    openGraph: mergeOpenGraph({
      type: 'profile',
      title,
      description,
      url: target ? `/resume/${targetSlug}` : '/resume',
    }),
  }
}
