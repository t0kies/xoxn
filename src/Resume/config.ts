import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate-global'
import { ownerOnly } from '@/access/roles'
import { auditGlobal } from '@/hooks/audit-log'

import { experienceTab } from './tabs/experience'
import { profileTab } from './tabs/profile'
import { skillsTab } from './tabs/skills'
import { targetsTab } from './tabs/targets'

// the /resume one-pager; targets are tailored copies at /resume/<slug>--<key>
// read is owner-only so target company names can't be listed over the API
export const Resume: GlobalConfig = {
  slug: 'resume',
  label: 'Resume',
  access: {
    read: ownerOnly,
    update: ownerOnly,
  },
  admin: {
    description:
      'A one-page resume at /resume that prints cleanly to PDF. Add tailored versions for specific job applications under "Tailored versions".',
    group: 'Resume',
    preview: () => '/resume',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Publish /resume',
      admin: {
        position: 'sidebar',
        description:
          'Off: /resume and its tailored versions return 404 for visitors. Logged-in admins can still see them.',
      },
    },
    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'media',
      label: 'PDF override',
      admin: {
        position: 'sidebar',
        description:
          'Optional. If set, "download pdf" on /resume serves this file; otherwise the PDF is generated from the resume (tailored versions are always generated).',
      },
    },
    {
      type: 'tabs',
      tabs: [profileTab, experienceTab, skillsTab, targetsTab],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal(), auditGlobal],
  },
}
