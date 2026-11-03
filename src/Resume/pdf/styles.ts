import { Font, StyleSheet } from '@react-pdf/renderer'
import path from 'path'

// the site's one typeface, from /public, which every build keeps (react-pdf reads WOFF, not WOFF2)
Font.register({
  family: 'Departure Mono',
  src: path.join(process.cwd(), 'public/fonts/DepartureMono-Regular.woff'),
})
Font.registerHyphenationCallback((word) => [word]) // no hyphens, it's a resume

export type Colors = { ink: string; accent: string }

export const styles = (c: Colors) =>
  StyleSheet.create({
    page: {
      padding: '28 32',
      fontFamily: 'Departure Mono',
      fontSize: 8.5,
      lineHeight: 1.35,
      color: c.ink,
    },
    muted: { color: `${c.ink}aa` },
    target: { backgroundColor: c.ink, color: '#ffffff', padding: '6 8', marginBottom: 12 },
    header: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 12 },
    name: { fontSize: 24, lineHeight: 1.05 },
    headline: { fontSize: 11, marginTop: 3 },
    contact: { flexDirection: 'row', flexWrap: 'wrap', gap: '2 10', marginTop: 5 },
    link: { color: c.ink, textDecoration: 'none' },
    avatar: { width: 60, height: 60, objectFit: 'cover', border: `1.5 solid ${c.ink}` },
    stats: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    stat: { flex: 1, borderLeft: `4 solid ${c.accent}`, paddingLeft: 5 },
    statValue: { fontSize: 14, lineHeight: 1, marginBottom: 3 },
    summary: { fontSize: 9.5, lineHeight: 1.45, marginBottom: 12, maxWidth: '85%' },
    columns: { flexDirection: 'row', gap: 18 },
    main: { flex: 1, gap: 12 },
    aside: { width: 150, gap: 12 },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 6,
      fontSize: 7.5,
      textTransform: 'uppercase',
      color: `${c.ink}aa`,
    },
    rule: { flex: 1, borderTop: `1 solid ${c.ink}33` },
    job: { marginBottom: 8 },
    jobHead: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    jobRole: { flex: 1 },
    jobWhen: { flexShrink: 0, maxWidth: '45%', textAlign: 'right', fontSize: 7.5 },
    bullet: { flexDirection: 'row', gap: 4, marginTop: 2 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
    chip: { backgroundColor: `${c.ink}14`, padding: '1 4', fontSize: 7.5 },
    chipStrong: { backgroundColor: c.accent, color: '#ffffff', padding: '1 4', fontSize: 7.5 },
  })
