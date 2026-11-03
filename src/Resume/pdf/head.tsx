import type { Resume } from '@/payload-types'
import { Image, Link, Text, View } from '@react-pdf/renderer'
import React from 'react'

import { type ResumeTarget, prettyUrl } from '../data'
import type { Colors, styles } from './styles'

type Props = {
  resume: Resume
  target?: null | ResumeTarget
  colors: Colors
  s: ReturnType<typeof styles>
  avatar: Awaited<ReturnType<typeof import('./parts').loadAvatar>>
  highlights: NonNullable<Resume['highlights']>
}

// the target banner, name, contact line, photo and the highlight stats
export const PdfHead: React.FC<Props> = ({ resume, target, colors, s, avatar, highlights }) => {
  const contact = [
    resume.location ? { label: resume.location } : null,
    resume.email ? { label: resume.email, href: `mailto:${resume.email}` } : null,
    resume.phone
      ? { label: resume.phone, href: `tel:${resume.phone.replace(/[^+\d]/g, '')}` }
      : null,
    ...(resume.links || []).map((link) => ({ label: prettyUrl(link.url), href: link.url })),
  ].filter(Boolean) as { href?: string; label: string }[]
  return (
    <>
      {target && (
        <View style={s.target}>
          <Text>
            Prepared for {target.company}
            {target.role ? ` · ${target.role}` : ''}
          </Text>
          {target.note && <Text style={{ marginTop: 2 }}>{target.note}</Text>}
        </View>
      )}

      <View style={s.header}>
        <View style={{ flex: 1 }}>
          {resume.availability && (
            <Text style={[s.muted, { marginBottom: 3 }]}>
              <Text style={{ color: colors.accent }}>&gt; </Text>
              {resume.availability.toLowerCase()}
            </Text>
          )}
          <Text style={s.name}>{resume.name}</Text>
          {resume.headline && <Text style={s.headline}>{resume.headline}</Text>}
          <View style={s.contact}>
            {contact.map((item) =>
              item.href ? (
                <Link key={item.label} src={item.href} style={s.link}>
                  {item.label}
                </Link>
              ) : (
                <Text key={item.label} style={s.muted}>
                  {item.label}
                </Text>
              ),
            )}
          </View>
        </View>
        {avatar && <Image src={avatar} style={s.avatar} />}
      </View>

      {highlights.length > 0 && (
        <View style={s.stats}>
          {highlights.map((stat, i) => (
            <View key={stat.id || i} style={s.stat}>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={[s.muted, { fontSize: 7 }]}>{stat.label}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  )
}
