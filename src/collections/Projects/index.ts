import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { ownerOnly } from '@/access/roles'
import { seoTab } from '@/fields/seo-tab'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit-log'
import { capPublicReadLimit } from '@/hooks/cap-public-read-limit'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { revalidateCollection } from '@/hooks/revalidate-collection'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

import { readProjects } from './access'
import { projectSidebar } from './sidebar'
import { caseStudyTab } from './tabs/case-study'
import { overviewTab } from './tabs/overview'

const revalidate = revalidateCollection('projects', (doc) => [
  '/projects',
  ...(doc?.slug ? [`/projects/${doc.slug}`] : []),
])

// Client work, products, demos and hardware: one record feeds /projects and the resume.
export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  access: {
    create: ownerOnly,
    delete: ownerOnly,
    read: readProjects,
    readVersions: ownerOnly, // versions hold every draft
    update: ownerOnly,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    summary: true,
    kind: true,
    stage: true,
    heroImage: true,
    technologies: true,
  },
  admin: {
    defaultColumns: ['title', 'kind', 'stage', 'visibility', 'updatedAt'],
    description: 'Client work, products, demos and hardware. Public projects appear at /projects once published.',
    group: 'Work',
    listSearchableFields: ['title', 'summary'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({ slug: data?.slug, collection: 'projects', req }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({ slug: data?.slug as string, collection: 'projects', req }),
  },
  hooks: {
    beforeOperation: [capPublicReadLimit],
    beforeChange: [populatePublishedAt],
    afterChange: [revalidate.afterChange, auditAfterChange],
    afterDelete: [revalidate.afterDelete, auditAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'One or two sentences. Used on cards, the page intro and search results.',
      },
    },
    { type: 'tabs', tabs: [overviewTab, caseStudyTab, seoTab] },
    ...projectSidebar,
    slugField(),
  ],
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
