import React from 'react'

import { splitList } from '../data'
import type { ShowcaseProject } from '.'

export const Tags: React.FC<{ tags?: null | string }> = ({ tags }) =>
  tags ? (
    <p className="flex flex-wrap gap-x-[1ch]">
      {splitList(tags).map((tag) => (
        <span className="tui-tag" key={tag}>
          {tag}
        </span>
      ))}
    </p>
  ) : null

// projects without scenes, so none go missing
export const MoreWork: React.FC<{ projects: ShowcaseProject[] }> = ({ projects: rest }) => {
  if (rest.length === 0) return null
  return (
    <div className="flex flex-col gap-[1lh]">
      <h3 className="tui-rule text-sm text-dim">more work</h3>
      <ul className="flex flex-col gap-[1lh]">
        {rest.map((project, i) => (
          <li className="flex flex-col gap-[0.25lh]" key={project.id || i}>
            <h4 className="font-bold">
              {project.url ? (
                <a
                  className="hover:text-link"
                  href={project.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {project.name} ↗
                </a>
              ) : (
                project.name
              )}
            </h4>
            {project.description && <p className="text-sm text-body">{project.description}</p>}
            <Tags tags={project.tags} />
          </li>
        ))}
      </ul>
    </div>
  )
}
