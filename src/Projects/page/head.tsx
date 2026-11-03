import type { Project } from '@/payload-types'
import React from 'react'

import { KIND_LABELS, STAGE_LABELS, stackNames, yearRange } from '../data'
import { ProjectLinks } from './links'

// the notice for drafts and non-public projects, the title, the facts and the links
export const ProjectHead: React.FC<{ project: Project }> = ({ project }) => {
  const stack = stackNames(project)
  const years = yearRange(project)
  const links = project.links || []
  const isDraft = project._status !== 'published'
  const notPublic = project.visibility !== 'public'
  return (
    <header className="container flex flex-col gap-[0.75lh]">
      {(isDraft || notPublic) && (
        <p className="border-2 border-dashed border-line px-[2ch] py-[0.5lh] text-sm text-body before:text-link before:content-['!_']">
          {notPublic
            ? 'Private: only you can see this page.'
            : 'This is a draft. Visitors see the last published version.'}
        </p>
      )}
      <p className="tui-cmd">cat ~/projects/{project.slug}/README.md</p>
      <h1 className="tui-rule text-3xl font-bold sm:text-4xl">{project.title}</h1>
      <p className="flex flex-wrap items-center gap-x-[1ch] text-sm text-dim">
        <span>{KIND_LABELS[project.kind]}</span>
        <span aria-hidden>│</span>
        <span>{STAGE_LABELS[project.stage]}</span>
        {years && (
          <>
            <span aria-hidden>│</span>
            <span>{years}</span>
          </>
        )}
      </p>
      {project.summary && <p className="max-w-[44rem] text-body">{project.summary}</p>}
      {(stack.length > 0 || links.length > 0) && (
        <div className="flex flex-wrap items-center gap-x-[1ch]">
          {stack.map((name) => (
            <span className="tui-tag" key={name}>
              {name}
            </span>
          ))}
        </div>
      )}
      <ProjectLinks links={project.links || []} />
    </header>
  )
}
