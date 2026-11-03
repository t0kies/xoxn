import React from 'react'

import type { Page } from '@/payload-types'

import { FullBleedHero } from '@/heros/FullBleed'
import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'

export const RenderHero: React.FC<Page['hero']> = (props) => {
  switch (props?.type) {
    case 'superImpact':
      return <FullBleedHero {...props} />
    case 'highImpact':
      return <HighImpactHero {...props} />
    case 'mediumImpact':
      return <MediumImpactHero {...props} />
    case 'lowImpact':
      return <LowImpactHero {...props} />
    default:
      return null
  }
}
