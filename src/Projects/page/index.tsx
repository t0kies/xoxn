import type { Project } from '@/payload-types'

import React from 'react'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Showcase } from '@/Resume/showcase'
import { ProjectHead } from './head'

// /projects/<slug>: the story, the stack and the scenes
export const ProjectPage: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <article className="project-page pt-[calc(var(--header-height)+2lh)] pb-[3lh]">
      <ProjectHead project={project} />

      {project.heroImage && typeof project.heroImage === 'object' && (
        <div className="container mt-[2lh]">
          <div className="tui-frame tui-shadow relative aspect-[16/9]">
            <Media
              fill
              imgClassName="object-cover"
              priority
              resource={project.heroImage}
              size="100vw"
            />
          </div>
        </div>
      )}

      {project.caseStudy && (
        <div className="container mt-[2lh]">
          <RichText className="max-w-[72ch]" data={project.caseStudy} enableGutter={false} />
        </div>
      )}

      {project.scenes && project.scenes.length > 0 && (
        <div className="container mt-[2lh]">
          <Showcase
            eyebrow="ls ./scenes"
            heading="How it's built"
            projects={[
              {
                id: String(project.id),
                name: project.title,
                description: null,
                tags: null,
                url: null,
                scenes: project.scenes,
              },
            ]}
          />
        </div>
      )}
    </article>
  )
}
