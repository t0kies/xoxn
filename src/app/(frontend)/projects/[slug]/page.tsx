import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import React from 'react'

import { getProjectForViewer } from '@/Projects/data'
import { ProjectPage } from '@/Projects/page'
import { generateMeta } from '@/utilities/generateMeta'

import '@/Projects/projects.css'

// Per request: the owner sees drafts and private projects, everyone else the published ones.
export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug?: string }> }

export default async function Page({ params }: Args) {
  const { slug = '' } = await params
  const { project } = await getProjectForViewer(decodeURIComponent(slug))
  if (!project) notFound()

  return <ProjectPage project={project} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = '' } = await params
  const { project } = await getProjectForViewer(decodeURIComponent(slug))
  if (!project) return {}
  const meta = await generateMeta({
    doc: {
      ...project,
      meta: {
        title: project.meta?.title || project.title,
        description: project.meta?.description || project.summary,
        image: project.meta?.image || project.heroImage,
      },
    },
  })
  // private projects stay out of search engines
  return project.visibility === 'public'
    ? meta
    : { ...meta, robots: { index: false, follow: false } }
}
