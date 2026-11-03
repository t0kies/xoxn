import React from 'react'

import type { Page } from '@/payload-types'

import { PageHead } from '@/components/page-head'
import RichText from '@/components/RichText'

// Text-only opener: the eyebrow is the command line, the rich text is the output.
export const LowImpactHero: React.FC<Page['hero']> = ({ eyebrow, richText }) => (
  <PageHead cmd={eyebrow}>
    {richText && <RichText className="hero-display" data={richText} enableGutter={false} />}
  </PageHead>
)
