import type { Resume } from '@/payload-types'
import { Link, Text, View } from '@react-pdf/renderer'
import React from 'react'

import { splitList } from '../data'
import type { Colors, styles } from './styles'

type Props = {
  colors: Colors
  s: ReturnType<typeof styles>
  experience: NonNullable<Resume['experience']>
  projects: NonNullable<Resume['projects']>
  section: (title: string, children: React.ReactNode) => React.ReactNode
}

// the main column: experience, then the selected projects
export const PdfWork: React.FC<Props> = ({ colors, s, experience, projects, section }) => (
  <>
    {experience.length > 0 &&
      section(
        'Experience',
        experience.map((job, i) => (
          <View key={job.id || i} style={s.job} wrap={false}>
            <View style={s.jobHead}>
              <Text style={s.jobRole}>
                {job.role}
                <Text style={s.muted}> · {job.company}</Text>
              </Text>
              <Text style={[s.muted, s.jobWhen]}>
                {job.start} – {job.end || 'Present'}
                {job.location ? ` · ${job.location}` : ''}
              </Text>
            </View>
            {(job.bullets || []).map((bullet, j) => (
              <View key={bullet.id || j} style={s.bullet}>
                <Text style={{ color: colors.accent }}>-</Text>
                <Text style={{ flex: 1 }}>{bullet.text}</Text>
              </View>
            ))}
          </View>
        )),
      )}
    {projects.length > 0 &&
      section(
        'Selected projects',
        projects.map((project, i) => (
          <View key={project.id || i} style={s.job} wrap={false}>
            {project.url ? (
              <Link src={project.url} style={s.link}>
                {project.name}
              </Link>
            ) : (
              <Text>{project.name}</Text>
            )}
            {project.description && <Text style={{ marginTop: 1 }}>{project.description}</Text>}
            {project.tags && (
              <Text style={[s.muted, { fontSize: 7, marginTop: 1 }]}>
                {splitList(project.tags).join(' / ')}
              </Text>
            )}
          </View>
        )),
      )}
  </>
)
