import React from 'react'

import type { Post } from '@/payload-types'

import { PostList } from '@/components/PostList'

export const RelatedPosts: React.FC<{ className?: string; docs?: Post[] }> = ({
  className,
  docs,
}) => {
  if (!docs?.length) return null
  return (
    <section aria-labelledby="related-posts" className={className}>
      <h2 className="tui-rule mb-[0.5lh] text-lg font-bold" id="related-posts">
        see also
      </h2>
      <PostList posts={docs} />
    </section>
  )
}
