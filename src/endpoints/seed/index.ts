import type { Payload, PayloadRequest } from 'payload'

import { isSeedAllowed } from './allowed'
import { seedAccounts } from './accounts'
import { clearContent } from './clear'
import { contactForm as contactFormData } from './contact-form'
import { context } from './context'
import { seedFiles } from './files'
import { seedNav } from './nav'
import { seedPages } from './pages'
import { seedPosts } from './posts'
import { seedProjects } from './projects'
import { resumeDemo } from './resume'
import { seedSettings } from './settings'

// The demo: Lorem Ipsum and CC0 / public domain images that exercise everything the site
// offers, so a fresh install can be shown before real content goes in. Every run replaces it.
// Without a running server, `Error hitting revalidate route` messages are expected.
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  if (process.env.NODE_ENV === 'production' && !isSeedAllowed()) {
    throw new Error(
      'Seeding wipes existing content and is disabled in production. Set ALLOW_SEED=true to override deliberately.',
    )
  }
  const log = (step: string) => payload.logger.info(`- ${step}`)

  payload.logger.info('Seeding database...')
  log('Clearing collections and globals...')
  await clearContent(payload, req)

  if (process.env.NODE_ENV !== 'production') log('Owner account from env...')
  const { ownerId } = await seedAccounts(payload)

  log('Media (CC0 / public domain) and the 3D model...')
  const { media, boardModel } = await seedFiles(payload)

  log('Contact form...')
  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
    overrideAccess: true,
  })

  log('Posts and categories...')
  const { categories, posts } = await seedPosts({ payload, media, authorId: ownerId })

  log('Projects and stack...')
  await seedProjects({ payload, media, boardModel: boardModel.id })

  log('Pages...')
  const pages: Record<string, number> = {}
  for (const data of seedPages({ categories, contactForm, media, posts })) {
    pages[data.slug!] = (
      await payload.create({ collection: 'pages', depth: 0, context, data, overrideAccess: true })
    ).id
  }

  log('Globals...')
  await Promise.all([seedSettings(payload), seedNav(payload, pages)])

  log('Resume (with two tailored versions)...')
  await payload.updateGlobal({
    slug: 'resume',
    context,
    data: resumeDemo({ media, boardModel: boardModel.id }),
    overrideAccess: true,
  })

  payload.logger.info('Seeded database successfully!')
}
