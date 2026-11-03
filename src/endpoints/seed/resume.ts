import type { Resume } from '@/payload-types'

import { sentence } from './lorem'
import type { SeedMedia } from './media'
import { resumeExperience } from './resume-experience'
import { resumeProjects } from './resume-projects'
import { BOTH, HARDWARE, resumeTargets, WEB } from './resume-targets'

type ResumeData = Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>

// Anything not ticked for a version explicitly is ticked for both.
const tickBoth = <T extends { tailorTags?: null | string[] }>(items?: null | T[]): T[] =>
  (items || []).map((item) => ({ ...item, tailorTags: item.tailorTags ?? BOTH }))

// a made-up resume: every section filled, two tailored versions
export const resumeDemo = ({
  media,
  boardModel,
}: {
  media: SeedMedia
  boardModel: number
}): ResumeData => {
  const resume: ResumeData = {
    enabled: true,
    name: 'Alex Demo',
    headline: 'Designer & Engineer: lorem ipsum hardware and the software around it',
    location: 'Lorem City',
    availability: 'Open to dolor sit amet roles',
    email: 'alex@example.com',
    links: [
      { label: 'Website', url: 'https://example.com' },
      { label: 'GitHub', url: 'https://github.com/example' },
    ],
    summary: `${sentence(18, 70)} ${sentence(14, 71)}`,
    highlights: [
      { value: '12', label: 'lorem ipsum products shipped' },
      { value: '3k', label: 'monthly users on dolor sit' },
      { value: '4 wks', label: 'from sketch to pilot', tailorTags: [HARDWARE] },
      { value: '35%', label: 'fewer amet consectetur tickets', tailorTags: [WEB] },
    ],
    experience: resumeExperience(),
    projectsOnSheet: true,
    projects: resumeProjects(media, boardModel),
    skills: [
      { group: 'Languages', items: 'TypeScript, Rust, C++, SQL' },
      { group: 'Web', items: 'React, Next.js, Node.js, Headless CMS', tailorTags: [WEB] },
      { group: 'Hardware', items: 'ESP32, KiCad, Soldering, 3D printing', tailorTags: [HARDWARE] },
      { group: 'Tools', items: 'Git, Docker, Figma' },
    ],
    education: [
      {
        credential: 'B.Sc. Lorem Ipsum Engineering',
        school: 'Example University',
        year: '2011–2015',
      },
      { credential: 'Dolor Sit Certificate', school: 'Open Learning Institute', year: '2019' },
    ],
    extras: [
      { label: 'Languages', value: 'English, Lorem' },
      { label: 'Elsewhere', value: sentence(6, 81) },
    ],
    targets: resumeTargets(),
  }

  return {
    ...resume,
    highlights: tickBoth(resume.highlights),
    experience: tickBoth(resume.experience).map((job) => ({
      ...job,
      bullets: tickBoth(job.bullets),
    })),
    projects: tickBoth(resume.projects),
    skills: tickBoth(resume.skills),
    education: tickBoth(resume.education),
    extras: tickBoth(resume.extras),
  }
}
