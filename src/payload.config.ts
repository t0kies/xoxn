import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { AuditLogs } from './collections/AuditLogs'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { ShowcaseFiles } from './collections/ShowcaseFiles'
import { Technologies } from './collections/Technologies'
import { Users } from './collections/Users'
import { Waitlist } from './collections/Waitlist'
import { Appearance } from './Appearance/config'
import { CMSSettings } from './CMSSettings/config'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Resume } from './Resume/config'
import { SiteStatus } from './SiteStatus/config'
import { admin } from './config/admin'
import { jobs } from './config/jobs'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { bootstrapAccounts } from './accounts/bootstrap'
import { migrations } from './migrations'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin,
  editor: defaultLexical,
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    push: false, // schema changes go through migrations; dev push prompts and hangs without a terminal
    prodMigrations: migrations, // pending migrations run when Payload starts
  }),
  collections: [
    Projects,
    Technologies,
    Pages,
    Posts,
    Categories,
    Media,
    ShowcaseFiles,
    Users,
    Waitlist,
    AuditLogs,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  csrf: [getServerSideURL()].filter(Boolean),
  graphQL: { disable: true }, // unused, one less open query surface
  telemetry: false,
  upload: { limits: { fileSize: 50_000_000 } }, // in bytes; showcase files cap themselves at 50 MB
  globals: [Header, Footer, CMSSettings, Appearance, SiteStatus, Resume],
  plugins,
  onInit: async (payload) => {
    try {
      await bootstrapAccounts(payload) // after prodMigrations, so the tables exist
    } catch (err) {
      payload.logger.error({ err, msg: 'Account bootstrap failed' }) // a bad env value mustn't take the app down
    }
  },
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  jobs,
})
