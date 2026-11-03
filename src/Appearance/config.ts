import type { GlobalConfig } from 'payload'

import { palettes } from '@/fields/palettes'

import { colorField } from '@/fields/color'
import { revalidateGlobal } from '@/hooks/revalidate-global'
import { ownerOnly } from '@/access/roles'
import { auditGlobal } from '@/hooks/audit-log'

// The public site's look: a terminal UI on WebTUI, one typeface, square corners and these colors.
// The admin's branding lives in CMS settings.
export const Appearance: GlobalConfig = {
  slug: 'appearance',
  access: {
    read: ownerOnly,
    update: ownerOnly,
  },
  admin: {
    description:
      'Branding and the terminal theme for the public site: logo, favicon, colors and terminal effects. Only you (Owner) can change these.',
  },
  fields: [
    {
      name: 'branding',
      type: 'group',
      admin: {
        description:
          "Brand assets for the public site. The admin panel's own logo and icon live in CMS settings.",
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Shown in the site header. Single-color SVG recommended: it is tinted to fit light and dark mode. A raster image (PNG/JPG) displays as-is. Falls back to the built-in mark when empty.',
          },
        },
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Square browser-tab icon, SVG preferred or a PNG of at least 64x64. Falls back to the built-in pixel favicon when empty.',
          },
        },
      ],
    },
    palettes(
      'palettes',
      'Any theme from kitty-themes, one per mode: search, preview, pick an accent. Leave a mode empty to use the custom colors below.',
    ),
    {
      name: 'colors',
      type: 'group',
      admin: {
        description:
          'The terminal theme comes from three colors. Dark mode is ink on screen: ink is the background, paper the text. Light mode flips it. Accent drives links, buttons, selection and the status line.',
      },
      fields: [
        colorField('ink', '#14171a', 'Dark-mode screen and light-mode text. Keep it near black.'),
        colorField('paper', '#f4f1e8', 'Light-mode screen and dark-mode text. Keep it light.'),
        colorField('accent', '#0a7d5a', 'Links, buttons, selection and the status line.'),
      ],
    },
    {
      name: 'inks',
      type: 'group',
      label: 'ANSI colors',
      admin: {
        description:
          'The terminal’s supporting colors: category badges, syntax highlighting and log levels. Red, green and blue are built in.',
      },
      fields: [
        colorField('cyan', '#0e8fae'),
        colorField('magenta', '#b8327a'),
        colorField('yellow', '#c99400'),
      ],
    },
    {
      name: 'printEffects',
      type: 'checkbox',
      label: 'Terminal effects',
      defaultValue: true,
      admin: {
        description:
          'Terminal effects: hard drop shadows behind panes, dither textures and faint scanlines on the Super and High Impact heroes.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal(), auditGlobal],
  },
}
