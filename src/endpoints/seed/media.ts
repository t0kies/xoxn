import type { Media } from '@/payload-types'

import { doc, link, p } from './rich-text'

type Credit = { author: string; license: 'CC0' | 'Public domain'; source: string }

// CC0 or public domain photos from Wikimedia Commons, credited in each caption
export const SEED_MEDIA = {
  'tidal-flats-dusk': {
    alt: 'Tidal flats at dusk, the sky fading from orange to deep blue over wet sand',
    credit: {
      author: 'John Robert McPherson',
      license: 'CC0',
      source: 'https://commons.wikimedia.org/wiki/File:Tidal_flats_at_sunset_Sandgate_IMGP4314.jpg',
    },
  },
  'tidal-flats-evening': {
    alt: 'Low tide in the evening: channels of water winding across the sand to the horizon',
    credit: {
      author: 'John Robert McPherson',
      license: 'CC0',
      source: 'https://commons.wikimedia.org/wiki/File:Tidal_flats_at_sunset_Sandgate_IMGP4310.jpg',
    },
  },
  'tide-recorder-1831': {
    alt: "Engraving of Henry Palmer's 1831 tide recorder: a clockwork drum driven by a float in a well",
    credit: {
      author: 'Henry Robinson Palmer',
      license: 'Public domain',
      source:
        'https://commons.wikimedia.org/wiki/File:Palmer_Tide_and_Wind_Recorder_1831_107930_01.jpg',
    },
  },
  'dec-vt100': {
    alt: 'A DEC VT100 terminal with green text on its screen, beside its keyboard',
    credit: {
      author: 'Wolfgang Stief',
      license: 'CC0',
      source: 'https://commons.wikimedia.org/wiki/File:DEC_VT100_(15272092560).jpg',
    },
  },
  'breadboard-prototype': {
    alt: 'A sensor prototype in a cardboard box: a microcontroller board wired to two breadboards',
    credit: {
      author: 'Valerio Bozzolan',
      license: 'CC0',
      source:
        'https://commons.wikimedia.org/wiki/File:Linux_Day_Ivrea_2021_-_talk_FabLab_Arduino_sensore_qualit%C3%A0_aria.jpg',
    },
  },
  'soil-moisture-probe': {
    alt: 'A white soil moisture probe pushed into a lawn, its cable running off through the grass',
    credit: {
      author: 'Christianjhart1',
      license: 'CC0',
      source: 'https://commons.wikimedia.org/wiki/File:272_soilmoisture.JPG',
    },
  },
  'spice-jars': {
    alt: 'Two shelves of labelled glass spice jars: oregano, black pepper, marjoram, paprika, sage',
    credit: {
      author: 'Mx. Granger',
      license: 'CC0',
      source: 'https://commons.wikimedia.org/wiki/File:Spice_jars_at_My_Sister%27s_Closet.jpg',
    },
  },
  'pcb-layout-and-board': {
    alt: 'A two-layer controller board: the layout in red and blue beside the assembled green board',
    credit: {
      author: 'Mike1024',
      license: 'Public domain',
      source:
        'https://commons.wikimedia.org/wiki/File:PCB_design_and_realisation_smt_and_through_hole.png',
    },
  },
} satisfies Record<string, { alt: string; credit: Credit }>

export type SeedMediaKey = keyof typeof SEED_MEDIA
export type SeedMedia = Record<SeedMediaKey, Media>

// "Photo: Author (CC0), via Wikimedia Commons" as the media caption.
export const creditCaption = ({ author, license, source }: Credit): Media['caption'] =>
  doc(p('Photo: ', link(source, author), ` (${license}), via Wikimedia Commons`))
