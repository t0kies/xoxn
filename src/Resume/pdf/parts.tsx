import type { Resume } from '@/payload-types'

import { Text, View } from '@react-pdf/renderer'
import React from 'react'

import { getMediaAsset } from '@/utilities/media-file-url'
import { getServerSideURL } from '@/utilities/getURL'

import type { styles } from './styles'

export type { Colors } from './styles'

export const Section: React.FC<{
  s: ReturnType<typeof styles>
  accent: string
  title: string
  children: React.ReactNode
}> = ({ s, accent, title, children }) => (
  <View>
    <View style={s.sectionTitle}>
      <Text style={{ color: accent }}>##</Text>
      <Text>{title}</Text>
      <View style={s.rule} />
    </View>
    {children}
  </View>
)

// fetched first, so a missing or slow image can't break the PDF
export const loadAvatar = async (resume: Resume) => {
  const asset = getMediaAsset(resume.avatar)
  if (!asset?.url || asset.isSvg) return null
  try {
    const url = asset.url.startsWith('http') ? asset.url : `${getServerSideURL()}${asset.url}`
    const res = await fetch(url)
    if (!res.ok) return null
    const format = (res.headers.get('content-type') || '').includes('png') ? 'png' : 'jpg'
    return { data: Buffer.from(await res.arrayBuffer()), format } as const
  } catch {
    return null
  }
}
