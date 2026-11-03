import type { Resume } from '@/payload-types'

import React from 'react'

import { MoreWork, Tags } from './more-work'
import { renderScene } from './scene'

type ResumeProject = NonNullable<Resume['projects']>[number]
export type Scene = NonNullable<ResumeProject['scenes']>[number]

// a resume project, or a Projects doc mapped to this shape
export type ShowcaseProject = Pick<ResumeProject, 'description' | 'name' | 'tags' | 'url'> & {
  id?: null | string
  scenes?: Scene[] | null
}

// The portfolio under the one-pager: a chapter per project with scenes, its text pinned while they
// scroll. With `includeRest`, projects without scenes follow as a short list. Screen only.
export const Showcase: React.FC<{
  eyebrow?: string
  heading?: string
  includeRest?: boolean
  projects: ShowcaseProject[]
}> = ({
  eyebrow = 'ls ~/portfolio',
  heading = 'Selected work, up close',
  includeRest,
  projects,
}) => {
  const chapters = projects.filter((project) => project.scenes?.length)
  const rest = includeRest ? projects.filter((project) => !project.scenes?.length) : []
  if (chapters.length === 0 && rest.length === 0) return null

  return (
    <section
      aria-labelledby="work-title"
      className="mt-[3lh] flex flex-col gap-[3lh] print:hidden"
      id="work"
    >
      <header className="flex flex-col gap-[0.5lh]">
        <p className="tui-cmd">{eyebrow}</p>
        <h2 className="tui-rule text-3xl font-bold" id="work-title">
          {heading}
        </h2>
      </header>

      {chapters.map((project, i) => (
        <article
          className="grid gap-[2lh] lg:grid-cols-[30ch_minmax(0,1fr)] lg:gap-[4ch]"
          key={project.id || i}
        >
          <div className="flex flex-col gap-[0.5lh] lg:sticky lg:top-[calc(var(--header-height)+2lh)] lg:self-start">
            <p className="text-sm text-dim">[{String(i + 1).padStart(2, '0')}]</p>
            <h3 className="text-2xl font-bold">{project.name}</h3>
            {project.description && <p className="text-body">{project.description}</p>}
            <Tags tags={project.tags} />
            {project.url && (
              <a
                className="self-start"
                href={project.url}
                is-="button"
                rel="noopener noreferrer"
                target="_blank"
                variant-="accent"
              >
                view project ↗
              </a>
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-[2lh]">
            {(project.scenes || []).map((scene, j) => (
              <React.Fragment key={scene.id || j}>
                {renderScene(scene, project.name)}
              </React.Fragment>
            ))}
          </div>
        </article>
      ))}

      <MoreWork projects={rest} />
    </section>
  )
}
