import PageTemplate, { generateMetadata } from './[slug]/page'

// no param segment, so Next would prerender this at build without a database
export const dynamic = 'force-dynamic'

export default PageTemplate

export { generateMetadata }
