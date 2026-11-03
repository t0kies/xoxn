import type { Project } from '@/payload-types'

import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'

import { KIND_LABELS, STAGE_LABELS, stackNames, yearRange } from './data'

// Card on /projects: image, kind and stage, title, one-line summary, stack.
export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const years = yearRange(project)
  const stack = stackNames(project)

  return (
    <article
      className="project-card tui-window tui-interactive group relative flex h-full flex-col"
      data-title={KIND_LABELS[project.kind]}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-line bg-surface">
        {project.heroImage && typeof project.heroImage === 'object' ? (
          <Media fill imgClassName="object-cover" resource={project.heroImage} size="33vw" />
        ) : (
          <div aria-hidden className="project-card__placeholder dither" />
        )}
        {project.featured && (
          <span className="absolute left-[1ch] top-[0.5lh]" is-="badge" variant-="accent">
            featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-[0.5lh] px-[2ch] py-[1lh]">
        <p className="flex flex-wrap items-center gap-x-[1ch] text-sm lowercase text-dim">
          <span>{STAGE_LABELS[project.stage]}</span>
          {years && (
            <>
              <span aria-hidden>│</span>
              <span>{years}</span>
            </>
          )}
        </p>
        <h2 className="text-lg font-bold leading-tight group-hover:text-link">
          <Link className="after:absolute after:inset-0" href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h2>
        {project.summary && <p className="text-sm text-body">{project.summary}</p>}
        {stack.length > 0 && (
          <p className="mt-auto flex flex-wrap gap-x-[1ch] pt-[0.5lh]">
            {stack.map((name) => (
              <span className="tui-tag" key={name}>
                {name}
              </span>
            ))}
          </p>
        )}
      </div>
    </article>
  )
}
