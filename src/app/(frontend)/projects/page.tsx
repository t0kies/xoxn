import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import React from 'react'

import { getPublicProjects } from '@/Projects/data'
import { ProjectCard } from '@/Projects/project-card'
import { PageHead } from '@/components/page-head'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import '@/Projects/projects.css'

// Railway's build can't reach Postgres, so render per request (data is cached by tag).
export const dynamic = 'force-dynamic'

export default async function Page() {
  const projects = await getPublicProjects()
  // No public work yet: no page, and the nav link and sitemap entry are hidden too.
  if (projects.length === 0) notFound()

  return (
    <main className="pt-[var(--header-height)] pb-[3lh]">
      <PageHead cmd="ls ~/projects" title="Projects">
        <p className="max-w-[60ch] text-body">
          Client work, products, demos and hardware. Each one links out to the real thing.
        </p>
      </PageHead>
      <ul className="container grid gap-x-[3ch] gap-y-[2lh] sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Projects',
    description: 'Client work, products, demos and hardware.',
    openGraph: mergeOpenGraph({ title: 'Projects', url: '/projects' }),
  }
}
