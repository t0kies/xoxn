import type { Resume } from '@/payload-types'

import React from 'react'

import { type ResumeTarget, splitList, tailorFor } from '../data'
import { SheetAside } from './aside'
import { SheetHeader } from './header'
import { Experience, SelectedProjects } from './work'

import '../css/resume.css'
import '../css/parts.css'
import '../css/print.css'

type Props = {
  resume: Resume
  target?: null | ResumeTarget
}

export const ResumeSheet: React.FC<Props> = ({ resume, target }) => {
  const tailor = tailorFor(target)
  const summary = tailor.section('summary') ? target?.summary || resume.summary : null
  const emphasis = new Set(splitList(target?.emphasize).map((item) => item.toLowerCase()))

  // a job keeps only the bullets this version shows, and drops out when none are left
  const experience = tailor.items('experience', resume.experience).flatMap((job) => {
    const bullets = job.bullets?.filter(tailor.shows)
    return job.bullets?.length && !bullets?.length ? [] : [{ ...job, bullets }]
  })
  const projects = tailor.items('projects', resume.projects)
  const skills = tailor.items('skills', resume.skills)
  const education = tailor.items('education', resume.education)
  const extras = tailor.items('extras', resume.extras)
  const highlights = tailor.items('highlights', resume.highlights)

  return (
    <article
      className="resume-sheet flex flex-col gap-[1.5lh] p-[2ch] sm:p-[4ch]"
      data-title="resume.txt"
    >
      {target && (
        <div className="resume-target px-[2ch] py-[0.5lh] text-sm">
          <p className="text-xs uppercase opacity-80">
            Prepared for {target.company}
            {target.role ? ` · ${target.role}` : ''}
          </p>
          {target.note && <p className="mt-1 leading-snug">{target.note}</p>}
        </div>
      )}

      <SheetHeader resume={resume} />

      {highlights.length > 0 && (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {highlights.map((stat, i) => (
            <div className="resume-stat" key={stat.id || i}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-2xl font-bold leading-tight">{stat.value}</dd>
              <dd aria-hidden className="text-xs resume-muted leading-snug">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {summary && <p className="text-base leading-relaxed max-w-[62ch]">{summary}</p>}

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_15rem] print:grid-cols-[minmax(0,1fr)_15rem] print:gap-6">
        <div className="resume-col flex flex-col gap-7 min-w-0">
          <Experience experience={experience} />
          {resume.projectsOnSheet !== false && <SelectedProjects projects={projects} />}
        </div>

        <SheetAside education={education} emphasis={emphasis} extras={extras} skills={skills} />
      </div>
    </article>
  )
}
