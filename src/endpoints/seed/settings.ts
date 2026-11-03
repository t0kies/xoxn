import type { Payload } from 'payload'

import { context } from './context'
import { sentence } from './lorem'

// the site name and links, the custom terminal colors and the site status
export const seedSettings = async (payload: Payload) => {
  await Promise.all([
    payload.updateGlobal({
      slug: 'cms-settings',
      context,
      data: {
        siteName: 'xoxn',
        tagline: sentence(12, 90),
        adminAccentColor: '#0a7d5a',
        socialLinks: [
          { platform: 'github', url: 'https://github.com/example' },
          { platform: 'other', url: 'https://example.com' },
        ],
      },
      overrideAccess: true,
    }),
    payload.updateGlobal({
      slug: 'appearance',
      context,
      // The custom terminal colors; pick kitty-themes per mode in the admin.
      data: {
        colors: { ink: '#14171a', paper: '#f4f1e8', accent: '#0a7d5a' },
        inks: { cyan: '#0e8fae', magenta: '#b8327a', yellow: '#c99400' },
        palettes: { dark: null, light: null },
        printEffects: true,
      },
      overrideAccess: true,
    }),
    payload.updateGlobal({
      slug: 'site-status',
      context,
      data: { status: 'live' },
      overrideAccess: true,
    }),
  ])
}
