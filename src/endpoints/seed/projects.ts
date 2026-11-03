import type { Payload } from 'payload'

import type { Project } from '@/payload-types'

import { context } from './context'
import type { SeedMedia } from './media'
import { projectList } from './project-list'
import { seedStack } from './taxonomy'

// every kind, stage and visibility, all four scenes on the featured build
export const seedProjects = async ({
  payload,
  media,
  boardModel,
}: {
  payload: Payload
  media: SeedMedia
  boardModel: number
}): Promise<Project[]> => {
  const stack = await seedStack(payload)
  const ids = (...names: string[]) => names.map((name) => stack.get(name)!)

  const projects = projectList({ media, boardModel, ids })

  const created: Project[] = []
  for (const data of projects) {
    created.push(
      await payload.create({ collection: 'projects', data, context, overrideAccess: true }),
    )
  }
  return created
}
