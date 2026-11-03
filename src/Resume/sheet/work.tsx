import type { Resume } from '@/payload-types'
import React from 'react'

import { splitList } from '../data'
import { Section } from './aside'

type Job = NonNullable<Resume['experience']>[number]
type Project = NonNullable<Resume['projects']>[number]

export const Experience: React.FC<{ experience: Job[] }> = ({ experience }) => {
  if (experience.length === 0) return null
  return (
    <Section title="Experience">
      <ol className="resume-jobs flex flex-col gap-5">
        {experience.map((job, i) => (
          <li className="avoid-break" key={job.id || i}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-bold text-base">
                {job.role} <span className="resume-muted font-normal">· {job.company}</span>
              </h3>
              <p className="text-xs resume-muted whitespace-nowrap">
                {job.start} – {job.end || 'Present'}
                {job.location ? ` · ${job.location}` : ''}
              </p>
            </div>
            {job.bullets && job.bullets.length > 0 && (
              <ul className="mt-1.5 list-['-_'] pl-[2ch] text-sm leading-snug flex flex-col gap-1 marker:text-[var(--accent)]">
                {job.bullets.map((bullet, j) => (
                  <li key={bullet.id || j}>{bullet.text}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </Section>
  )
}

export const SelectedProjects: React.FC<{ projects: Project[] }> = ({ projects }) => {
  if (projects.length === 0) return null
  return (
    <Section title="Selected projects">
      <ul className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => (
          <li className="avoid-break border-t resume-rule pt-2" key={project.id || i}>
            <h3 className="font-bold text-sm">
              {project.url ? (
                <a href={project.url} rel="noopener noreferrer" target="_blank">
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </h3>
            {project.description && (
              <p className="mt-0.5 text-sm leading-snug">{project.description}</p>
            )}
            {project.tags && (
              <p className="mt-1 text-[0.7rem] resume-muted">
                {splitList(project.tags).join(' / ')}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}
