import type { DashboardConfig, WidgetInstance } from 'payload'

// The admin home: one getting-started widget; Payload's collection cards sit below it.
export const dashboard: DashboardConfig = {
  widgets: [
    {
      slug: 'start',
      label: 'Getting started',
      minWidth: 'full',
      Component: '@/components/Dashboard/start#Start',
    },
  ],
  defaultLayout: (): WidgetInstance[] => [{ widgetSlug: 'start', width: 'full' }],
}
