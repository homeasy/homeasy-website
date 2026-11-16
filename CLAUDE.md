# CLAUDE.md — Homeasy website project

Context for Claude Code. Read this first, then `docs/prd.md` for detail.

## What Homeasy is
Homeasy Automation Pvt. Ltd. (incorporated 2025, Patna, Bihar, India) is a **retrofit-first smart-home company**. We make **traditional homes** smart by installing compact **Homeasy retrofit modules inside the existing electrical switchbox**, behind the switches people already have. No rewiring, no new switchboards. The service is end to end: free survey → fixed quote → professional installation → free Homeasy app → support.
- Market: **India only**. Survey service area = **all of Bihar** (founder, 16 Nov 2026); HQ and pilot in Patna.
- Channels: D2C homes + B2B (interior designers, builders, electricians) + B2G (government buildings).
- Service promises (decided): WhatsApp reply **within 30 min** (working hours 9 am–9 pm, every day), technician visit **within 24 h** in Patna, **3-year warranty** on Homeasy modules. Form success screens promise a callback **within 2 working hours**.

## Company facts (use `data/site.json`, never retype)
CIN U74909BR2025PTC073219 · Registered office: B Hub, Mauryalok Complex, A Block, Patna, Bihar 800001 · Phone and WhatsApp +91 91173 79099 · info@homeasy.io · Founder photo `public/images/founder-vishwjeet-narayanan.jpg`.

## Source of truth
| Topic | File / section |
|---|---|
| Full website spec | `docs/prd.md` (v3.9) |
| Business model | `docs/business-plan.md` |
| Sitemap and redirects | PRD §7 |
| Page specs and copy | PRD §8 (home) and §26 (all other pages) |
| Brand: logo, colours, type | PRD §6.1–6.3 and `brand/tokens.css` |
| USPs and guarantees | PRD §5.7, §8.20.1 |
| Forms, data model, lead flow | PRD §10, §27 |
| Functional requirements | PRD §11 |
| SEO, analytics | PRD §13, §14 |
| Visual effects (flat direction) | PRD §29 |
| 3D hero plan | PRD §30 |
| Wireframes | PRD §25 |

If something in the code conflicts with the PRD, follow the PRD and flag the conflict.

## Tech stack (PRD §16)
- **Next.js 16.4** (App Router, Cache Components on) + TypeScript + React 19. APIs differ from older Next: read `node_modules/next/dist/docs/` before using an unfamiliar API (see `AGENTS.md`).
- **Tailwind CSS v4**: `app/globals.css` imports `brand/tokens.css` and maps tokens in `@theme inline` (`bg-navy`, `text-body`, `border-line`, `rounded-card`, `text-h1`…). Shared classes: `container-page`, `btn btn-primary|btn-secondary|btn-outline`, `link`.
- Content in JSON under `/data` (`site.json`, `navigation.json`, `service-areas.json`; later products, packages, faq, roadmap, jobs). Flags in `lib/flags.ts` (env vars, see `.env.example`).
- Fonts: served unmodified from `/public/fonts`, copied from `brand/fonts/chillax` by `npm run fonts` (auto on dev/build). Do **not** use `next/font/local` (it renames files; licence forbids).
- Forms: server actions or API routes + Zod validation + honeypot + rate limiting.
- Storage: **Supabase** (decided Q12) + a login-protected **`/admin`** for leads, modelled on the Kynyx admin (`../Kynyx_OS/client/src/admin`: dashboard, inquiries list/detail, settings).
- Hosting: **Vercel free tier for now** (founder decision), moving to **AWS** once credits are granted. Note: Vercel Hobby terms are non-commercial; keep the AWS move on track.
- No dark mode (decided). Light-first only.

## Commands
`npm run dev` (localhost:3000) · `npm run build` · `npm run lint` · `npm run typecheck`

## Homepage hero (founder decision, 16 Nov 2026)
H1 "Same switch. Smarter home." (flip-the-switch), with the retrofit promise "Make your existing home smart — without changing your switches." directly below.
**Photoreal room on every device** (founder rejected low-poly WebGL and the 2D fallback): a living room rendered offline in **Blender Cycles** and relit live in the browser.
- Pipeline: `scripts/blender/build_scene.py` (builds the room from CC0 Poly Haven assets + own models) → `render_passes.py` (one render per light: ambient, tube, lamp, TV; crops for AC/switch LEDs; motion-blurred fan crops; depth map; switch close-ups) → `export_web.sh` → `public/hero/{desktop,mobile,switch}`. Source assets and renders live in git-ignored `assets-source/`. Needs Blender (`brew install --cask blender`).
- Viewer: `components/hero/photo-scene.ts` (plain WebGL, no three.js) adds the passes in linear light per device state; depth parallax gives the 3D feel (mouse on desktop, tilt on phones). Falls back to the still dusk photo without WebGL.
- Layout: desktop = full-bleed behind the text with a dark left scrim; phones = text on white, room card, app card. Devices: tube light, fan, lamp, TV, AC (IR). App bar labelled "Try it" (interactive demo of the app). "See inside the switch" crossfades two close-up renders, labelled "Illustrative render" until real module photos/CAD exist.

## Admin, products and the shop (founder decisions, 16 Nov 2026)
- **Admin at `/admin`** (`app/(admin)/admin`, own layout, noindex). One shared password in `ADMIN_PASSWORD` (off when unset); signed HttpOnly cookie (`lib/admin/session.ts`). Target: feature parity with the Kynyx admin (`../Kynyx_OS/client/src/admin`: leads dashboard with charts/filters/bulk actions/notes, content, SEO tools, settings) plus product management like Ecotwist (`../Ecotwist/src/admin`).
- **Built so far:** leads list/detail/status/notes/CSV export; orders list/detail/status/amount received; products list/add/edit/photo/on-off; store settings with connection status.
- **Draft then publish (must keep):** admin edits change the working tables only. The public site reads a published snapshot (`published_content` table, `lib/store/publish.ts`); the bar in the admin shows "N changes waiting to go live" and **Publish now** copies drafts live (`updateTag("products")`). Any new editable content (FAQ, packages, settings) must use the same snapshot pattern. Leads are live data and are not part of publishing.
- **Data layer:** `lib/db.ts` (Supabase REST with the service-role key, or `.data/*.json` in dev). SQL in `supabase/schema.sql` (leads) and `supabase/02-store.sql` (products, snapshots, `product-images` bucket).
- **Public products:** `/products` and `/products/[slug]` (Ecotwist-style detail page) read `getPublicProducts()`.
- **Buying is live in code** (overrides the PRD's "no checkout" non-goal): cart in localStorage (`components/shop/`), `/cart` checkout, `/order-placed`, server actions in `app/(site)/cart/actions.ts` (prices are recomputed on the server from published products), Razorpay (`lib/store/razorpay.ts`, webhook at `/api/razorpay/webhook`), orders in `/admin/orders`, store settings in `/admin/settings` (GST, delivery fee, booking amount; draft until Publish). A product is buyable only when it has a price and status "available". Without `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` the checkout saves the order and says payment is arranged by phone. Delivery is limited to Bihar pincodes. Razorpay payment itself is untested (no keys yet).
- **Policies:** `/privacy-policy` is the company's published policy carried over verbatim from the old site (do not reword without the founder). `/terms-of-service`, `/refund-policy`, `/delivery-policy`, `/cookie-policy` are drafts marked "under legal review"; the old site's "terms" page was a duplicate of the privacy policy.
- The public pages live in `app/(site)/` with the header/footer (`components/layout/SiteChrome.tsx`).

## Brand rules (must follow)
- **Logo:** use files in `brand/logo-kit/svg/`. Never retype "homeasy" in a font.
- **Font:** Chillax (Bold 700, Semibold 600, Regular 400) for everything. Hind for Hindi. Satoshi only if the long-form readability test fails (PRD §6.3).
- **Colours:** Deep Navy `#0B1220`, Homeasy Blue `#3A9ADB`, Switch Amber `#F9B445`, White, Cloud `#F5F8FC`, Border `#E5EAF0`, Slate `#667085`, Body `#344054`, Blue Tint `#DCEFFA`, Link `#286998`.
- **Contrast rules:** primary button = blue background with **navy text**. Never white text on blue or amber. Text links use `#286998`, not brand blue. Slate never on navy or blue tint.
- **Style:** light-first, flat, geometric. No glassmorphism, neon or decorative glows. The one exception is the hero "flip the switch" amber light.

## Font licence (ITF Free Font License v2.0, `brand/fonts/chillax/LICENSE-ITF-FFL.txt`)
- Self-host the official WOFF2 files **exactly as supplied**: no subsetting, conversion, renaming or modification.
- **Do not commit the font files to a public repository**, and do not send them to outside developers, agencies or printers; each must download their own copy from fontshare.com.
- Logos and wordmarks made with Chillax may be registered as trademarks.

## Honesty rules (PRD §5.5): never break these in copy or code
- Future items show **Planned** (see the launch-sequence note below for what is presented as live).
- **Launch sequence and "live" wording (founder, 16 Nov 2026):** the website goes live first on Vercel. When the AWS credits are granted, the website moves to AWS and the app goes live there at the same time. The founder has decided the site presents the core offering as **live**: the app (`APP_LIVE` defaults to true) and the four core modules (Smart Relay, Fan Controller, Power Module, IR Remote) carry no "Coming soon" labels. Future items (voice, energy insights, Hindi mode, other brands, parents' alerts, inverter-aware automation, No-Neutral Module, Smart Plug, Care plan) stay **Planned**. Guarantee promises stay behind `USP_*` flags. Store download buttons need the store links.
- No certification claims (BIS, WPC, "Works with Alexa/Google") until certificates exist.
- No prices until final (`SHOW_PRICES=false` → "Price after free survey").
- No fake testimonials, ratings or install counts. Never claim it fits "every" switchbox.
- No energy-saving % without our own measurements. No GeM, empanelment or tender claims until real.
- Founding year is always **2025**. Founder experience is personal (13+ years), not company age.
- Guarantees (30 min, 24 h, "Same look") link to written terms on `/guarantee` and go live only behind `USP_*` flags once the pilot proves them.

## Feature flags (PRD §16.3)
`SHOW_PRICES`, `SHOW_INSTALLS`, `APP_LIVE`, `SHOW_ANNOUNCEMENT`, `SHOW_INVESTORS_PAGE` (true), `SHOW_BLOG`, `SHOW_CERTIFICATIONS`, `SHOW_DEMO`, `USP_U1`…`USP_U12`.

## Placeholders still needed from the founder
GST (optional), package prices, warranty workmanship period, real install photos (after pilot), Homeasy module photos/CAD, firmware decision, MVP module line-up. Use clearly marked `[insert …]` placeholders; never invent values. (Bihar pincode prefixes in `data/service-areas.json` must be verified against India Post before launch.)

## Suggested build order (PRD §19)
1. **Phase 0 on the current live site:** fix the default meta description, remove placeholder testimonials and unverified security claims, update © to 2026, show "Incorporated 2025".
2. ✅ Scaffold Next.js + Tailwind + tokens + fonts + logo + favicons.
3. ✅ Global layout: header, mobile drawer, sticky mobile action bar (WhatsApp, Call, Book survey), footer, 404, redirects.
4. ✅ Homepage: photoreal hero + all sections (`components/home/`, copy in `data/home.json`). ✅ Survey booking form on `/book-survey` (`components/forms/SurveyForm.tsx`, server action `app/book-survey/actions.ts`, schema/storage in `lib/leads/`, table in `supabase/schema.sql`). Leads go to Supabase when `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set; in dev without keys they go to git-ignored `.data/leads.json`; in production without keys the form shows the WhatsApp fallback. Lead alert emails go through Resend (`lib/leads/notify.ts`; env `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM`). **Next:** booking modal from every CTA, B2B/government/contact forms, then `/admin` leads dashboard.
5. ✅ Pilot pages (first drafts): How it works, About, Contact, FAQ (`data/faq.json`), legal pages (drafts, marked "under legal review").
6. ✅ First drafts: Products, Installation, Pricing, App, Solutions ×4, Guarantee, Warranty, Roadmap, Investors, Careers. **Not built yet:** enquiry/contact forms (pages use WhatsApp + email for now), Estimator, Readiness Report sample, Demo, product detail pages. Page helpers: `components/ui` (shared), `components/service`, `components/catalog`, `components/company`.
7. SEO, analytics (consent-gated), QA checklist (PRD §18).

## Working conventions
- Mobile-first. Test at 360 px and on a low-end Android over 4G. Lighthouse mobile ≥ 90.
- Accessibility: WCAG 2.1 AA, real buttons and links, labelled inputs, visible focus, `prefers-reduced-motion`.
- Keep copy in data files where practical so non-developers can edit it.
- Don't add paid services without asking the founder.
