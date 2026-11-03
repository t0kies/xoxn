import { aboutPage } from './about'
import { componentsPage } from './components'
import { contactPage } from './contact'
import { homePage } from './home'
import type { PageArgs, PageData } from './parts'

// Home, about, contact and a components page that shows every block and hero, in Lorem Ipsum.
export const seedPages = (args: PageArgs): PageData[] => [
  homePage(args),
  aboutPage(args),
  contactPage(args),
  componentsPage(args),
]
