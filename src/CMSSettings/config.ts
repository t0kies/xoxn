import type { GlobalConfig } from 'payload'

import { hexColorValidate } from '@/fields/ColorPickerField/validate'
import { revalidateGlobal } from '@/hooks/revalidate-global'
import { ownerOnly } from '@/access/roles'
import { auditGlobal } from '@/hooks/audit-log'
import { palettes } from '@/fields/palettes'
import { socialLinks } from './social-links'

// The CMS's own identity: the admin's name, marks and accent, reused by the site's metadata.
// The site's styling lives in Appearance.
export const CMSSettings: GlobalConfig = {
  slug: 'cms-settings',
  label: 'CMS settings',
  access: {
    read: ownerOnly,
    update: ownerOnly,
  },
  admin: {
    description:
      'Rebrand the CMS: name, logo, icon, tab favicon and admin accent. Only you (Owner) can change these.',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'xoxn',
      admin: {
        description: 'Used as the wordmark, page titles, and the admin panel title.',
      },
    },
    {
      name: 'tagline',
      type: 'textarea',
      admin: {
        description:
          'Short description used as the default page description and social preview text.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          "Shown on the admin login screen. The public site's logo lives in Appearance. A single-color SVG is tinted to fit the admin's light and dark themes. Falls back to the built-in xoxn CMS logo.",
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Compact mark used in the admin nav. A single-color SVG is tinted automatically. Falls back to the built-in xoxn CMS icon.',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Browser tab icon for the admin panel. Square SVG, or PNG at least 64×64. Falls back to the Icon above, then the built-in favicon.',
      },
    },
    palettes(
      'adminPalettes',
      'Any theme from kitty-themes for the admin, one per mode. Leave a mode empty to keep Payload’s grays with the accent below.',
    ),
    {
      name: 'adminAccentColor',
      type: 'text',
      defaultValue: '#0a7d5a',
      validate: hexColorValidate,
      admin: {
        description: 'Accent color used for highlights inside the admin panel.',
        components: {
          Field: '@/fields/ColorPickerField#ColorPickerField',
        },
      },
    },
    socialLinks,
    {
      name: 'googleAnalyticsId',
      type: 'text',
      admin: {
        description: 'GA4 measurement ID, e.g. G-XXXXXXXXXX. Leave empty to disable analytics.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal(), auditGlobal],
  },
}
