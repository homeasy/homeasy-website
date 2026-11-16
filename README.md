# Homeasy website project

The new homeasy.io: Next.js 16 + Tailwind CSS v4, plus all specs and brand files.

| Folder | Contents |
|---|---|
| `CLAUDE.md` | Project context, decisions and rules (read first) |
| `docs/prd.md` | Website PRD v3.9: full spec, copy, design system, operations, marketing, 3D plan |
| `docs/business-plan.md` | Business plan v3.0 (retrofit-first model) |
| `docs/asset-download-list.md` | Free textures and 3D models for the later 3D hero |
| `app/` | Pages and root layout (App Router) |
| `components/` | `layout/` (header, drawer, action bar, footer), `icons/` |
| `data/` | Editable content: company facts, navigation, service areas |
| `lib/` | Feature flags, site helpers, pincode checker |
| `brand/logo-kit/` | Logo SVG/PNG, favicons, app icon, social images (RGB, web-ready) |
| `brand/tokens.css` | Colour, type and shape tokens (imported by `app/globals.css`) |
| `brand/fonts/chillax/` | Chillax WOFF2 + ITF licence (**not in git; internal use only**) |
| `prototype/` | Homepage and 3D-hero prototype sources (visual reference only) |

## Run locally
```bash
npm install
cp .env.example .env.local   # optional: flags default to "hidden"
npm run dev                  # http://localhost:3000
```
`npm run dev` and `npm run build` first copy the Chillax files from `brand/fonts/chillax` into `public/fonts` (unchanged). Without them the site falls back to system fonts.

Checks: `npm run lint` · `npm run typecheck` · `npm run build`

## Important
- `brand/fonts/` and `public/fonts/` are git-ignored: the font licence forbids redistribution. Before deploying from Git, use a **private** repo and remove those two lines from `.gitignore` so the fonts ship with the build.
- Outside developers must download Chillax themselves from fontshare.com.
- `assets-source/` (raw 3D textures/models) is git-ignored; it is only needed for the later 3D hero.
