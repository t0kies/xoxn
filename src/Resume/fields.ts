import type { Field } from 'payload'

// Fields shared by the resume's tabs (./tabs).

// which tailored versions an item shows on; /resume shows everything
export const tailorTags: Field = {
  name: 'tailorTags',
  type: 'text',
  hasMany: true,
  label: 'Tailored versions',
  admin: {
    description: 'Tick the versions this shows on. None ticked: only on /resume.',
    components: {
      Field: '@/Resume/tailor-tags-field#TailorTagsField',
    },
  },
}
