import type { Config } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from '@/collections/Users'
import { dashboard } from '@/components/Dashboard'

const dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const breakpoint = (name: string, width: number, height: number) => ({
  label: name[0].toUpperCase() + name.slice(1),
  name,
  width,
  height,
})

export const admin: Config['admin'] = {
  meta: { titleSuffix: '- xoxn' }, // the tab icon is set per request, see brand/admin-favicon.ts
  dashboard,
  components: {
    actions: ['@/components/admin/env-badge#EnvBadge', '@/components/AccountMenu#AccountMenu'],
    graphics: {
      Icon: '@/components/graphics/Icon',
      Logo: '@/components/graphics/Logo',
    },
    providers: ['@/components/AdminThemeProvider#AdminThemeProvider'], // accent, palettes and the brand font
  },
  importMap: { baseDir: dirname },
  user: Users.slug,
  livePreview: {
    breakpoints: [
      breakpoint('mobile', 375, 667),
      breakpoint('tablet', 768, 1024),
      breakpoint('desktop', 1440, 900),
    ],
  },
}
