import type { Resume } from '@/payload-types'

import React from 'react'

import { splitList } from '../data'

export const Section: React.FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title,
}) => (
  <section>
    <h2 className="resume-section-title">{title}</h2>
    {children}
  </section>
)

type Items<K extends 'education' | 'extras' | 'skills'> = NonNullable<Resume[K]>

// the sheet's narrow column: skill tags (emphasized ones lit), education and extras
export const SheetAside: React.FC<{
  education: Items<'education'>
  emphasis: Set<string>
  extras: Items<'extras'>
  skills: Items<'skills'>
}> = ({ education, emphasis, extras, skills }) => (
  <aside className="resume-col flex flex-col gap-7 min-w-0">
    {skills.length > 0 && (
      <Section title="Skills">
        <div className="flex flex-col gap-3">
          {skills.map((group, i) => (
            <div className="avoid-break" key={group.id || i}>
              <h3 className="text-xs font-bold mb-1">{group.group}</h3>
              <ul className="flex flex-wrap gap-1">
                {splitList(group.items).map((skill) => (
                  <li
                    className="resume-chip"
                    data-emphasis={emphasis.has(skill.toLowerCase()) ? 'true' : undefined}
                    key={skill}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    )}

    {education.length > 0 && (
      <Section title="Education">
        <ul className="flex flex-col gap-2 text-sm">
          {education.map((item, i) => (
            <li className="avoid-break" key={item.id || i}>
              <p className="font-bold leading-snug">{item.credential}</p>
              <p className="resume-muted leading-snug">
                {item.school}
                {item.year ? ` · ${item.year}` : ''}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    )}

    {extras.length > 0 && (
      <Section title="More">
        <dl className="flex flex-col gap-2 text-sm">
          {extras.map((item, i) => (
            <div className="avoid-break" key={item.id || i}>
              <dt className="font-bold">{item.label}</dt>
              <dd className="resume-muted leading-snug">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Section>
    )}
  </aside>
)
