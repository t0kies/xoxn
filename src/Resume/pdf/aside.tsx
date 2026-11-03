import type { Resume } from '@/payload-types'
import { Text, View } from '@react-pdf/renderer'
import React from 'react'

import { splitList } from '../data'
import { Section } from './parts'
import type { Colors, styles } from './styles'

type Items<K extends 'education' | 'extras' | 'skills'> = NonNullable<Resume[K]>

// the right-hand column: skill chips (emphasized ones filled), education and extras
export const Aside: React.FC<{
  colors: Colors
  education: Items<'education'>
  emphasis: Set<string>
  extras: Items<'extras'>
  s: ReturnType<typeof styles>
  skills: Items<'skills'>
}> = ({ colors, education, emphasis, extras, s, skills }) => {
  const section = (title: string, children: React.ReactNode) => (
    <Section accent={colors.accent} s={s} title={title}>
      {children}
    </Section>
  )
  return (
    <View style={s.aside}>
      {skills.length > 0 &&
        section(
          'Skills',
          skills.map((group, i) => (
            <View key={group.id || i} style={{ marginBottom: 6 }} wrap={false}>
              <Text style={{ fontSize: 7.5, marginBottom: 2 }}>{group.group}</Text>
              <View style={s.chips}>
                {splitList(group.items).map((skill) => (
                  <Text
                    key={skill}
                    style={emphasis.has(skill.toLowerCase()) ? s.chipStrong : s.chip}
                  >
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )),
        )}
      {education.length > 0 &&
        section(
          'Education',
          education.map((item, i) => (
            <View key={item.id || i} style={{ marginBottom: 5 }} wrap={false}>
              <Text>{item.credential}</Text>
              <Text style={s.muted}>
                {item.school}
                {item.year ? ` · ${item.year}` : ''}
              </Text>
            </View>
          )),
        )}
      {extras.length > 0 &&
        section(
          'More',
          extras.map((item, i) => (
            <View key={item.id || i} style={{ marginBottom: 5 }} wrap={false}>
              <Text>{item.label}</Text>
              <Text style={s.muted}>{item.value}</Text>
            </View>
          )),
        )}
    </View>
  )
}
