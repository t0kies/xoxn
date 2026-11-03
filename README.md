status: in progress

# xoxn

A CMS for makers and developers to show what they build: projects told in scenes (photos,
schematics, 3D models, code, video), a blog, pages made from blocks and forms, a one-page resume
with tailored links, a waitlist and site status. One Payload admin, one owner account, styled as
a terminal: WebTUI, kitty-theme palettes and a command prompt over the menu. Built to deploy on
Railway.

## Why

One admin for the site, the projects and the resume, so none of it lives in three places, and
one deploy to get it online.

## Run

Node 22, pnpm (`corepack enable`) and Docker for Postgres.

```sh
docker compose up -d        # Postgres on 127.0.0.1:5432
cp .env.example .env        # fill in PAYLOAD_SECRET and SUPERADMIN_* (password 12+ characters)
pnpm install
pnpm payload migrate
pnpm dev
```

Demo content: `pnpm seed`, or with `ALLOW_SEED=true` sign in at `/admin` and press **seed the
database** on the dashboard. It wipes pages, posts, projects, forms, categories and media, then
seeds Lorem Ipsum pages, nav, projects and a demo resume, with CC0 photos.

| verb | does |
| --- | --- |
| `pnpm dev` | the site and admin with reload |
| `pnpm test` | integration (Vitest, needs Postgres) and end-to-end (Playwright) |
| `pnpm release "message"` | rebuilds `main` from `dev` with only what production runs |
| `pnpm lint` | ESLint |
| `pnpm build` | production build; needs no database |
| `pnpm payload migrate:create <name>` | after changing collections or globals |
| `pnpm generate:types`, `pnpm generate:importmap` | after schema or admin component changes |

## Deploy

Railway, from the Dockerfile (`railway.json`): healthcheck at `/next/health`, restart on failure.
Pending migrations run on boot and the healthcheck waits for them, so a broken migration never
goes live. Pages render on request, so the build step needs no database.

| variable | notes |
| --- | --- |
| `DATABASE_URI` | `${{Postgres.DATABASE_URL}}` |
| `PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET` | `openssl rand -hex 32` each |
| `NEXT_PUBLIC_SERVER_URL` | the canonical `https://` origin, no trailing slash; inlined at build, so redeploy to change it. Unset, Railway's own domain (`RAILWAY_PUBLIC_DOMAIN`) is used |
| `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD` | the owner, made on boot; a new email moves the account |
| `TRUSTED_PROXY_HOPS` | `1` behind Railway, `2` with Cloudflare in front; used by rate limits |
| `BUCKET`, `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `ENDPOINT`, `REGION` | optional S3 bucket (a Railway Bucket) for media and showcase files; unset, uploads go to the container's disk and are lost on redeploy |
| `ALLOW_SEED` | only while seeding a fresh environment |
| `DISABLE_JOB_AUTORUN` | `true` on extra replicas, so one runs the jobs |

A daily job deletes contact-form submissions older than 12 months. To run it from outside:
`GET /api/payload-jobs/run?queue=maintenance` with `Authorization: Bearer $CRON_SECRET`.

## Account

One owner, from `SUPERADMIN_EMAIL`: made on the first start, can't be deleted, and a second one
can't be created. Visitors read published, public content only. Every rule is enforced on the
server and covered in `tests/int/`. Each create, update, delete and sign-in goes to **Activity**,
kept 12 months.

## The resume

Edited in **Admin → Resume** (owner only). Unlisted: never in the menus or sitemap, `noindex`
(PDF included). Off means a 404 for visitors while the owner still sees it.

- **Tailored versions** live at `/resume/<slug>--<key>` with a random key made on first save; the
  slug alone opens nothing. Each adds a "Prepared for" banner, a note, an optional summary and
  highlighted skills.
- **Save as PDF** lays the sheet out on one Letter or A4 page; a **PDF override** serves an
  uploaded file instead.
- **Portfolio scenes** scroll past each project under the sheet (never printed):

| scene | upload | effect |
| --- | --- | --- |
| schematic | PNG or SVG in Media | drawn on with a scan line over a blueprint grid |
| 3D model | `.glb` in Showcase files (keep it under 5 MB, add a poster) | turns with scroll, drag to orbit |
| code | pasted code, optional video with cues | types in; cues light lines in sync with the video |
| video | `.mp4`/`.webm`, a direct URL or YouTube | muted loop on screen; YouTube waits for a click |
| photo | image in Media | CMY plates slide into register |

Only the owner can upload SVGs, and they're served with a sandboxing CSP.

## Layout

```
src/
  access/          roles and who can read what
  accounts/        the owner account made on boot
  app/             (frontend) the site and its tui/*.css, (payload) the admin
  Appearance/ CMSSettings/ SiteStatus/  the site-wide globals
  blocks/          page blocks and the portfolio scenes
  collections/     pages, posts, projects, media, accounts, waitlist, activity
  components/      shared UI, the admin getting-started panel and account menu
  config/ plugins/ hooks/ jobs/  the Payload setup around payload.config.ts
  endpoints/seed/  the demo content
  Header/ Footer/  the prompt, menu, key bar and status line
  Projects/ Resume/  the project page; the sheet, PDF and showcase
  themes/          palette CSS and kitty theme parsing
tests/           int (Vitest) and e2e (Playwright)
```

## Look

Its own `palette.css` and `tui/*.css` over WebTUI; palettes come from
[kitty-themes](https://github.com/dexpota/kitty-themes) by Fabrizio Destro (MIT) and are picked
per site in **Admin → Appearance**. Name, logo, favicon and social image are set in **CMS
settings** and **Appearance**; until then the built-in xoxn mark is used.

## Security

- One owner, from `SUPERADMIN_EMAIL`; it can't be deleted and there's never a second one.
- Passwords need 12+ characters. No lockout; sign-in is rate limited per IP instead.
- Anonymous REST reads are capped at 100 docs, GraphQL is off.
- Rate limits per IP: sign-in 10 / 15 min, password reset 5 / hour, contact form 10 / hour,
  waitlist 5 / hour. `TRUSTED_PROXY_HOPS` says which `X-Forwarded-For` entry is the visitor.
- Only the owner uploads SVGs, and they're served with a sandboxing CSP.
- Form submissions and activity older than 12 months are deleted daily.

Report issues privately to the owner, not in a public issue.

## Credits

| part | used for | license |
| --- | --- | --- |
| [Payload website template](https://github.com/payloadcms/payload/tree/main/templates/website) | the starting point | MIT |
| [kitty-themes](https://github.com/dexpota/kitty-themes) by Fabrizio Destro | the palettes in Admin → Appearance, read from GitHub at runtime | MIT, below |
| [WebTUI](https://github.com/webtui/webtui) | the terminal base styles | MIT |
| [Departure Mono](https://departuremono.com) by Helena Zhang | the font | SIL OFL 1.1, `public/fonts/DepartureMono-LICENSE.txt` |

Each kitty theme's own author is listed in the
[kitty-themes README](https://github.com/dexpota/kitty-themes#themes); the palette picker links
there too.

Demo photos (seed only, in `src/endpoints/seed/assets`), from Wikimedia Commons. No attribution is
required; each one is also credited in its Media caption. `demo-board.glb` is a KiCad export of the
author's own board.

| file | author | license | source |
| --- | --- | --- | --- |
| `tidal-flats-dusk.webp` | John Robert McPherson | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Tidal_flats_at_sunset_Sandgate_IMGP4314.jpg) |
| `tidal-flats-evening.webp` | John Robert McPherson | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Tidal_flats_at_sunset_Sandgate_IMGP4310.jpg) |
| `tide-recorder-1831.webp` | Henry Robinson Palmer (1831) | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Palmer_Tide_and_Wind_Recorder_1831_107930_01.jpg) |
| `dec-vt100.webp` | Wolfgang Stief | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:DEC_VT100_(15272092560).jpg) |
| `breadboard-prototype.webp` | Valerio Bozzolan | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Linux_Day_Ivrea_2021_-_talk_FabLab_Arduino_sensore_qualit%C3%A0_aria.jpg) |
| `soil-moisture-probe.webp` | Christianjhart1 | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:272_soilmoisture.JPG) |
| `spice-jars.webp` | Mx. Granger | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Spice_jars_at_My_Sister%27s_Closet.jpg) |
| `pcb-layout-and-board.webp` | Mike1024 | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:PCB_design_and_realisation_smt_and_through_hole.png) |

### kitty-themes license

```
MIT License

Copyright (c) 2019 Fabrizio Destro <fabrizio@destro.dev>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

TK · xoxn · 2026
