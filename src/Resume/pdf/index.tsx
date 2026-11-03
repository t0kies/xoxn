import type { Resume } from '@/payload-types'

import { Document, Page, Text, View, renderToBuffer } from '@react-pdf/renderer'
import React from 'react'

import { type ResumeTarget, splitList, tailorFor } from '../data'
import { PdfHead } from './head'
import { Aside } from './aside'
import { loadAvatar, Section } from './parts'
import { type Colors, styles } from './styles'
import { PdfWork } from './work'

// The resume as a PDF, built on the server with react-pdf, from the same data and tailoring as the sheet.
export const renderResumePdf = async ({
  colors,
  resume,
  target,
}: {
  colors: Colors
  resume: Resume
  target?: null | ResumeTarget
}): Promise<Buffer> => {
  const s = styles(colors)
  const tailor = tailorFor(target)
  const summary = tailor.section('summary') ? target?.summary || resume.summary : null
  const emphasis = new Set(splitList(target?.emphasize).map((item) => item.toLowerCase()))
  const avatar = await loadAvatar(resume)

  const experience = tailor.items('experience', resume.experience).flatMap((job) => {
    const bullets = job.bullets?.filter(tailor.shows)
    return job.bullets?.length && !bullets?.length ? [] : [{ ...job, bullets }]
  })
  const projects = resume.projectsOnSheet === false ? [] : tailor.items('projects', resume.projects)
  const skills = tailor.items('skills', resume.skills)
  const education = tailor.items('education', resume.education)
  const extras = tailor.items('extras', resume.extras)
  const highlights = tailor.items('highlights', resume.highlights)
  const section = (title: string, children: React.ReactNode) => (
    <Section accent={colors.accent} s={s} title={title}>
      {children}
    </Section>
  )

  return renderToBuffer(
    <Document author={resume.name || undefined} title={`${resume.name} · Resume`}>
      <Page size="A4" style={s.page}>
        <PdfHead {...{ resume, target, colors, s, avatar, highlights }} />

        {summary && <Text style={s.summary}>{summary}</Text>}

        <View style={s.columns}>
          <View style={s.main}>
            <PdfWork {...{ colors, s, experience, projects, section }} />
          </View>

          <Aside
            colors={colors}
            education={education}
            emphasis={emphasis}
            extras={extras}
            s={s}
            skills={skills}
          />
        </View>
      </Page>
    </Document>,
  )
}
