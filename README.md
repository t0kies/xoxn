# xoxn

A CMS for makers and developers to show what they build: projects told in scenes (photos,
schematics, 3D models, code, video), a blog, pages with forms, a one-page resume with tailored
links, a waitlist and site status. One owner account, styled as a terminal. Built on Payload and
Next.js.

## Run it on your machine

You need Node 22, pnpm (`corepack enable`) and Docker.

```sh
docker compose up -d                 # starts Postgres on 127.0.0.1:5432
cp .env.example .env                 # then fill in the values below
pnpm install
pnpm build
pnpm start                           # http://localhost:3000, admin at /admin
```

In `.env`, set at least:

- `PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET`: each one `openssl rand -hex 32`
- `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD`: your sign-in (password 12+ characters)

The database tables and your account are made the first time the app starts. Sign in at
`/admin`. `pnpm start` warns that it doesn't work with standalone output; it does, the warning
is about the Docker image.

To stop Postgres: `docker compose down` (your data stays), or `docker compose down -v` to wipe
it.

## Deploy on Railway

1. Make a new project from this repo. Railway builds it with the `Dockerfile`.
2. Add a Postgres database to the project.
3. On the app service, set these variables:

| variable | value |
| --- | --- |
| `DATABASE_URI` | `${{Postgres.DATABASE_URL}}` |
| `PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET` | `openssl rand -hex 32` each |
| `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD` | your sign-in (password 12+ characters). Change them here and redeploy to change your sign-in |
| `ALLOW_SEED` | optional: `true` shows the seed button on the admin home (see below) |
| `TRUSTED_PROXY_HOPS` | `1`, or `2` with Cloudflare in front |
| `NEXT_PUBLIC_SERVER_URL` | optional: your own domain, like `https://example.com`. Unset, the Railway domain is used |

4. Optional, so uploads survive redeploys: add a Railway Bucket and set `BUCKET`,
   `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `ENDPOINT` and `REGION` from it. Without one, uploads
   are lost on each deploy.
5. Deploy. The app waits for the database to be ready before it goes live; the health check is
   `/next/health`.

## Fill it in

- Name, logo and colors: **Admin → CMS settings** and **Admin → Appearance**.
- Demo content to look around: set `ALLOW_SEED=true`, restart, press **seed the database** on
  the admin home, then remove `ALLOW_SEED`. Seeding replaces all pages, posts, projects and
  media.
- The resume lives at `/resume` and isn't linked anywhere. Edit it in **Admin → Resume**; each
  tailored version gets its own link to send.

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

The demo photos are from Wikimedia Commons, CC0 or public domain, and each is credited in its
Media caption after seeding.

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
