# PRD: homeasy.io Website Redesign

**Detailed Product Requirements Document — v3.0 (Retrofit-First)**

---

## 0. Document control

| Field | Detail |
|---|---|
| Product | homeasy.io — company, product and services website |
| Company | Homeasy Automation Private Limited, Patna, Bihar, India |
| Document owner | Vishwjeet Narayanan, Founder & CEO |
| Version | v3.9 — launch sequence and "live" wording decisions (22.2); earlier: 3D hero plan (Section 30) |
| Date | 15 November 2026 |
| Status | Draft for review |
| Companion document | `business-plan.md` v3.0 (Retrofit-First Model) |
| Depends on | Final logo and colour palette; module firmware decision; ODM line-up; package prices |

### 0.1 Revision history

| Version | Date | Changes |
|---|---|---|
| v1.0 | 15 Nov 2026 | High-level PRD: sitemap, homepage copy, requirements |
| v2.0 | 15 Nov 2026 | Detailed PRD: personas, design system, full page copy, forms, analytics, SEO, QA, risks |
| v2.1 | 15 Nov 2026 | Founder decisions: tagline, Wi-Fi at launch, 5-device free plan, public investor page, founder-only team, Hindi Phase 2, CIN and address shown |
| **v3.0** | 15 Nov 2026 | **Rewritten for the retrofit-first model**: target traditional homes; own retrofit modules installed inside existing switchboxes; paid installation from day one; B2B and B2G; India only; smaller MVP and earlier launch. Primary CTA changed from "Join the waitlist" to "Book a free home survey". |
| v3.1 | 15 Nov 2026 | Added USPs (Section 5.7) and competitor-borrowed features (5.8); new homepage USP sections; new pages /estimator, /demo, /guarantee and sample Readiness Report; WhatsApp photo check flow; switch-brand selector; new forms, requirements, analytics events, open questions; expanded Indian competitor table |
| v3.2 | 15 Nov 2026 | Founder decisions: service visit within 24 hours, WhatsApp reply within 30 minutes, 3-year warranty; "Same look" guarantee terms and exclusions drafted (8.20.1); warranty page spec expanded (8.15) |
| v3.3 | 15 Nov 2026 | Added Section 25 (wireframes), 26 (full page copy incl. Hindi key strings), 27 (operations: pipeline, SLAs, WhatsApp/email templates in English and Hindi, survey/installation/service SOPs, Readiness Report template), 28 (launch marketing plan and budget tiers), 29 (visual design, effects and resource register from Fontshare, fffuel, ambientCG, Poly Pizza, PrettySites) |
| v3.4 | 16 Nov 2026 | Final brand identity applied: H Switch Plate logo, Chillax wordmark; website typography (Chillax headings + Satoshi body + Hind) and palette (Homeasy Blue, Switch Amber, Charcoal, Mist) with tonal scales, measured contrast rules and dusk/day tokens (Sections 6.0, 6.2, 6.3); 29.4/29.5 now point to Section 6 |
| v3.5 | 16 Nov 2026 | Merged ChatGPT "Visual identity 2.0" with PRD: light-first flat direction; palette Deep Navy `#0B1220` + logo blue `#3A9ADB` + amber `#F9B445` + cool neutrals (electric `#33C4FF` rejected); Chillax for all UI with long-form readability safeguard; corrected letter spacing; design tokens; glows/glass/gradients removed from Section 29 |
| v3.9 | 16 Nov 2026 | Founder decisions recorded in 22.2: launch sequence (website first on Vercel, then AWS with the app), core offering presented as live (R1 amended, `APP_LIVE` default true), photoreal rendered hero on all devices, homepage trimmed, Supabase + admin, Bihar service area, company facts |
| v3.8 | 16 Nov 2026 | Added Section 30: 3D hero plan (storyboard, assets from ambientCG/Poly Pizza + custom models, tech, device rules, budgets, effort, alternative) |
| v3.7 | 16 Nov 2026 | Confirmed previous brand sheet (calm blue `#3A9ADB`) as final; the AI-generated cyan sheet is not used. Logo kit wordmark rebuilt from the official Chillax Bold font |
| v3.6 | 16 Nov 2026 | Chillax font files received; licence rules added (no subsetting/conversion; no sharing files with third parties; logo trademark use allowed). Merged ChatGPT design system 2.0 neutrals (Border `#E5EAF0`, Body Dark `#344054`, Blue Tint `#DCEFFA`); links fixed to `#286998` |

### 0.2 Decisions carried forward from v2.1

| Decision | Still valid? |
|---|---|
| Tagline "One App. Every Device. Easy." | Yes |
| Wi-Fi as first protocol | Yes — Homeasy modules are Wi-Fi based |
| Free plan up to 5 devices | **Not shown on site** — app is free for Homeasy customers; policy for non-customers is open (business plan D7) |
| Investor page public | Yes |
| Founder only on About page | Yes |
| Hindi in Phase 2 | Yes (reconsider earlier — see Q5) |
| CIN and registered address shown | Yes |
| Logo wall of third-party brands | **Removed** — no longer relevant to retrofit positioning |

### 0.3 Conventions

- **Must / Should / Could** = MoSCoW priority. **[TBC]** = founder decision or data needed.
- Status labels used on the site: **Available**, **Coming soon**, **Planned**.
- Copy in this PRD is draft; structure and honesty rules (Section 5.5) are mandatory.

### 0.4 Table of contents

1. Executive summary
2. Background and what changed
3. Goals, non-goals and success metrics
4. Audiences, personas and user journeys
5. Positioning, messaging and voice
6. Brand and design system
7. Information architecture
8. Page-by-page specifications (with full copy)
9. Global components
10. Forms, data model and lead flows
11. Functional requirements and acceptance criteria
12. Non-functional requirements
13. SEO and local SEO plan
14. Analytics and tracking plan
15. Privacy, legal and compliance
16. Technical architecture
17. Content and asset checklist
18. QA and testing plan
19. Release plan and timeline
20. Roles and responsibilities
21. Risks and mitigations
22. Open questions and decisions log
23. Competitor references
24. Appendix: glossary
25. Wireframes (mobile-first)
26. Full page copy
27. Operations: lead handling, templates and SOPs
28. Launch marketing plan and budget
29. Visual design, effects and resource register
30. 3D hero plan (desktop upgrade)

---

## 1. Executive summary

Homeasy is changing from an app-only, multi-brand platform to a **retrofit-first smart-home company**. Most Indian homes are traditional homes with ordinary modular switchboards. Homeasy converts them into smart homes by **installing compact Homeasy retrofit modules inside the existing electrical switchbox**, so families keep their switches, avoid rewiring, and gain control through the **Homeasy app**.

The website must now sell a **done-for-you service**: free home survey → Homeasy modules → professional installation → free app → after-sales support. Revenue starts from day one through hardware and installation, with B2B (interior designers, builders, electricians) and B2G (government buildings, quarters, hostels, offices) channels. Launch is **India only**, starting with a **Patna pilot**, sooner than previously planned, with a smaller MVP.

The redesigned homeasy.io will:

1. Make the promise — **"Make your existing home smart, without changing your switches or rewiring"** — clear within 5 seconds.
2. Convert visitors into **free home survey bookings** and WhatsApp conversations.
3. Generate **B2B and B2G leads** through dedicated solution pages.
4. Build **trust** with real installation photos, clear process, safety, warranty and accurate company facts.
5. Present credible company information for investors and programmes (incorporated 2025, Patna).
6. Stay honest: no unverified certifications, prices, specs or testimonials.

---

## 2. Background and what changed

### 2.1 Business context the website must represent

| Area | Current plan (v3) |
|---|---|
| Target | Traditional homes (D2C), plus interior designers, builders, electricians (B2B) and government (B2G) |
| Product | Homeasy retrofit modules (relay, fan, heavy-load, IR — line-up TBC) installed inside existing switchboxes |
| Service | Free survey, paid professional installation, onboarding, warranty and support |
| App | Homeasy app (Android + iOS), free for Homeasy customers; controls Homeasy modules; multi-brand control is a later feature |
| Protocol | Wi-Fi |
| Market | India only; Patna pilot first |
| Timeline | Launch sooner than the earlier ~4-month plan, with a smaller MVP |
| Open | Firmware platform (Tuya ODM vs own ESP32 firmware vs hybrid); module line-up; prices; warranty term; certifications |

### 2.2 Website audit (current site) — still valid

| # | Finding | Fix |
|---|---|---|
| P1 | Default meta description ("Generated by create next app") | Phase 0 |
| P2 | Placeholder testimonials | Phase 0 — remove |
| P3 | Generic feature list (security, climate) not tied to a real offer | v3 rewrite |
| P4 | No clear service, process, pricing or service area | v3 |
| P5 | Ambiguous company age (AWS Activate declined) | Phase 0 — show "Incorporated 2025" |
| P6 | Unverified claims ("end-to-end encryption", "24/7 security") | Phase 0 — remove |
| P7 | © 2025 footer | Phase 0 |
| P8 | Heavy MP4 videos | v3 |
| P9 | Inconsistent URLs (`/whyChoose`, `/career`) | v3 redirects |

Note: v2 called the "Book a free consultation" CTA a positioning error. Under the retrofit model, a consultation-style CTA is **correct again** — renamed to "Book a free home survey" and backed by a clear process.

### 2.3 Problem statement

> Owners of traditional homes don't know they can make their home smart without new switchboards or rewiring, don't trust DIY modules, and can't find a local, accountable provider. homeasy.io must explain the retrofit idea simply, prove it is safe and reliable, and make booking a survey effortless — while also serving designers, builders, government buyers and investors.

---

## 3. Goals, non-goals and success metrics

### 3.1 Goals

| ID | Goal | Measure |
|---|---|---|
| G1 | Explain retrofit instantly | ≥ 80% of 5-second-test participants say "smart home without changing switches/rewiring" |
| G2 | Generate survey bookings (primary conversion) | Survey bookings per week |
| G3 | Generate WhatsApp/phone enquiries | Click-to-WhatsApp and click-to-call events |
| G4 | Generate B2B leads | Designer, builder, electrician enquiries |
| G5 | Generate B2G leads | Government enquiries |
| G6 | Build trust | Real install photos/videos live; real testimonials after pilot |
| G7 | Support fundraising and programmes | Zero rejections caused by website facts |
| G8 | Fast, accessible, locally findable | Lighthouse ≥ 90 mobile; top-3 local results for "smart home Patna" within 90 days (target) |

### 3.2 Non-goals (v3 launch)

- Online checkout or e-commerce cart (sales happen after survey and quote).
- In-app or website subscription payments.
- Customer login / order tracking portal (Phase 2 — Could).
- Multi-brand compatibility list (later, when the app supports other brands).
- International pages (India only).
- Hindi version at launch (Phase 2).

### 3.3 KPIs (first 90 days after launch)

| KPI | Definition | Target |
|---|---|---|
| Survey booking conversion | Survey bookings ÷ unique visitors in service area | ≥ 3% [TBC after baseline] |
| WhatsApp/call clicks | Click events ÷ visitors | Track |
| Survey → order conversion | Offline, tracked in CRM sheet | Track (business KPI) |
| B2B enquiries | Designer + builder + electrician forms | Track |
| B2G enquiries | Government form | Track |
| Service-area mismatch | Bookings from outside service area | Track (expansion signal) |
| Mobile bounce rate | | < 55% |
| Lighthouse (mobile) | Perf / A11y / BP / SEO | ≥ 90 each |
| Core Web Vitals | LCP / INP / CLS | < 2.5 s / < 200 ms / < 0.1 |
| Google Business Profile actions | Calls, directions, website clicks | Track |

---

## 4. Audiences, personas and user journeys

### 4.1 Segments

| Segment | Priority | Main page |
|---|---|---|
| Owners of traditional homes (apartments and independent houses) | P1 | Home, How it works, Pricing, Book survey |
| Interior designers & architects | P1 | /solutions/designers |
| Electricians & installers | P1 | /solutions/electricians |
| Builders & developers | P2 | /solutions/builders |
| Government buyers (estate offices, PWD/engineering departments, hostels, quarters) | P2 | /solutions/government |
| Investors, programme reviewers | Strategic | /about, /investors |
| Small commercial (shops, clinics, PGs, offices) | P3 | /solutions/builders (commercial section) or contact |
| Job candidates | P3 | /careers |

### 4.2 Personas

#### Persona 1 — Suresh & Meena, traditional homeowners (primary)

| Attribute | Detail |
|---|---|
| Location / home | Patna, 3BHK independent house, 10+ years old, standard modular switchboards |
| Family | Couple in their 40s, two school-age children, elderly father |
| Pain points | Geyser left on, fans running in empty rooms, father struggles with switches at night, worry about rewiring cost and mess |
| Fears | "Will it damage my wiring?", "What if the app stops working?", "Who will fix it?" |
| Device | Android phones; WhatsApp is their main channel |
| Website questions | Do I need new switches? How much? How long? Is it safe? Do you come to my area? |
| Desired action | WhatsApp or book a free survey |
| Success | Understands the switches stay, feels safe, books a survey |

#### Persona 2 — Ankit, young apartment owner (primary)

| Attribute | Detail |
|---|---|
| Location / home | Patna (or another city later), 2BHK apartment |
| Motivation | Convenience, control from office, schedules for geyser and AC |
| Website questions | What can I control? Does it work with Alexa? Can I start with one room? |
| Desired action | Check packages, book survey for one room |

#### Persona 3 — Kavya, interior designer (B2B, P1)

| Attribute | Detail |
|---|---|
| Work | Renovation projects for homes and offices in Patna |
| Need | Add smart features without breaking walls or changing the switchboard design clients chose |
| Website questions | Trade pricing? Installation timeline during renovation? Can you work on my sites? |
| Desired action | Designer partner enquiry |

#### Persona 4 — Ramesh, electrician (B2B, P1)

| Attribute | Detail |
|---|---|
| Work | Independent electrician with a local customer base |
| Need | Extra income, new skills, reliable products |
| Desired action | Join Homeasy electrician network |

#### Persona 5 — Mr. Prasad, project head at a builder (B2B, P2)

| Attribute | Detail |
|---|---|
| Need | Smart-ready upgrade to sell flats faster; show-flat demo |
| Website questions | Bulk pricing? Timelines? Support for residents? |
| Desired action | Builder project enquiry |

#### Persona 6 — Executive engineer / estate officer (B2G, P2)

| Attribute | Detail |
|---|---|
| Need | Energy saving and control for quarters, hostels, offices; procurement-compliant vendor |
| Website questions | Company details, registrations, references, energy-saving case, contact |
| Desired action | Government enquiry; download capability statement |

#### Persona 7 — Arjun, investor / programme reviewer (strategic)

| Attribute | Detail |
|---|---|
| Looks for | Clear model, founding date, legal entity, roadmap, honest traction |
| Desired action | Read About/Investors, contact founder |

### 4.3 User journeys

#### Journey A — Homeowner books a survey (core funnel)

| Step | Touchpoint | Thought | Site provides |
|---|---|---|---|
| 1 | Instagram reel / Google "smart home Patna" | "Can my old house be smart?" | Hero: no switch change, no rewiring |
| 2 | Homepage: switchbox diagram | "Oh, it goes behind my switch." | Simple "behind your switch" illustration |
| 3 | What you can control | "Geyser and fans — useful." | Indian use cases |
| 4 | Process + safety + warranty | "Who installs? Is it safe?" | 4-step process, trained electricians, warranty |
| 5 | Packages | "Roughly how much?" | Packages; "exact quote after free survey" |
| 6 | Service area check | "Do they come to my area?" | Pincode checker |
| 7 | Book survey / WhatsApp | — | Short form or WhatsApp button |
| 8 | Confirmation | "When will they come?" | Confirmation screen + WhatsApp/SMS/email confirmation |

#### Journey B — Interior designer becomes a partner

| Step | Site provides |
|---|---|
| Lands on /solutions/designers from LinkedIn or referral | "Smart homes without changing your design" message |
| Reads benefits and process | Trade pricing (on request), project timelines, co-branded proposals |
| Submits enquiry | Designer form (firm, city, projects per year) |

#### Journey C — Government officer evaluates Homeasy

| Step | Site provides |
|---|---|
| Searches or receives proposal; visits /solutions/government | Use cases: quarters, hostels, offices; energy-saving and central control |
| Checks credibility | Company facts (CIN, incorporation 2025, address), registrations (only confirmed ones) |
| Downloads capability statement | PDF |
| Submits enquiry | Government form (department, location, building type, scale) |

#### Journey D — Electrician joins

| Step | Site provides |
|---|---|
| Sees WhatsApp/poster/QR → /solutions/electricians | Benefits, training, how it works |
| Submits form | Name, phone, area, experience |

#### Journey E — Investor reviews

| Step | Site provides |
|---|---|
| /about → /investors → /roadmap | Clear model, honest stage, facts box, contact |

---

## 5. Positioning, messaging and voice

### 5.1 Positioning statement

> **For** owners of traditional Indian homes who want comfort, safety and energy savings,
> **Homeasy** converts their existing home into a smart home **without changing switches or rewiring**,
> by installing compact retrofit modules inside the existing switchbox, with professional installation, a simple app and local support.
> **Unlike** DIY modules sold online (no installation, no accountability) or premium automation (new switchboards, high cost),
> **Homeasy** is done-for-you, affordable and built for Indian homes.

### 5.2 Messaging hierarchy

| Level | Message |
|---|---|
| Core promise | Make your existing home smart — without changing your switches or rewiring. |
| Tagline | One App. Every Device. Easy. |
| Proof points | Fits inside your existing switchbox · Your switches still work · Installed by trained electricians · Free survey with Readiness Report · "Same look" guarantee · Fixed price incl. installation · Local service promise (see 5.7) |
| Emotional benefit | Comfort and peace of mind for the whole family. |
| Reason to believe | Founder's 13+ years in interiors, automation and smart-home integration; transparent process; real installations (after pilot) |

### 5.3 Messaging pillars

| Pillar | Headline | Supporting lines |
|---|---|---|
| 1. Keep your switches | Your switches stay. Your home gets smarter. | Modules fit behind existing switches · Same look, same feel · Physical switches always work |
| 2. No rewiring, no mess | No broken walls. No new wiring. | Installed inside the existing switchbox · Most rooms done in [TBC] hours |
| 3. Done for you | We survey, install and set it up. | Free home survey · Trained electricians · App set up for your family |
| 4. Built for Indian homes | Made for how India lives. | Fans with speed control · Geysers and motors on schedule · Works with power cuts and voltage changes [verify] |
| 5. One app | Your whole home in one app. | Rooms, scenes, schedules · Family sharing · Voice later |

### 5.4 Tagline (decided)

**"One App. Every Device. Easy."** — shown above the hero headline, in the footer, OG images and email signatures. The hero headline carries the retrofit promise.

### 5.5 Honesty and claims rules (mandatory)

| Rule | Detail |
|---|---|
| R1 | Future products/features carry **Planned**. Amended 16 Nov 2026 (founder): the app and the four core modules are presented as live on the website; see decisions log 22.2. |
| R2 | No certification claims (BIS, WPC/ETA, ISI, Works with Alexa/Google) until certificates are issued. |
| R3 | No prices on site until final; until then "Exact price after free survey" (feature flag `SHOW_PRICES`). |
| R4 | No product specs (dimensions, load ratings) until confirmed by ODM datasheets and testing. |
| R5 | Never claim it fits "every" switchbox — say "Our free survey checks your switchboxes and wiring first." |
| R6 | "Works without internet" only for what is actually true for the chosen firmware (physical switches: yes; app local control: verify). |
| R7 | No fake testimonials, ratings or install counts. Real pilot testimonials only with written consent; real install photos only. |
| R8 | No GeM listing, empanelment, tender wins or government references until real. |
| R9 | Founding date always **2025**; founder experience written as personal experience. |
| R10 | No funding, revenue or valuation figures unless approved. |
| R11 | No energy-saving percentages unless measured in Homeasy installations. |
| R12 | Programmes/awards only if confirmed. |
| R13 | Every guarantee or time promise (U2, U3, U5) links to written terms on /guarantee and uses pilot-proven values. |
| R14 | Switch-brand names appear as text only (no logos), with "brand names belong to their owners" note; never imply partnership. |

### 5.6 Voice and tone

| We are | We are not |
|---|---|
| Clear, simple, reassuring | Technical or jargon-heavy |
| Warm, family-focused | Cold, corporate |
| Confident about the service | Exaggerated about results |
| Honest about suitability and limits | Over-promising |
| Local (Patna, Bihar, India) | Generic Western |

Writing rules: sentence-case headings; "you/your home"; ≤ 20 words per sentence; explain "neutral wire", "switchbox", "module" in plain words; Indian English spelling; numerals for numbers. Keep Hindi-friendly simplicity (Hindi version in Phase 2).


### 5.7 Unique selling propositions (USPs)

None of the Indian retrofit competitors reviewed (Tata Power EZ Home, Wozart, Smarteefi, AZIOT, SmartNode, Switchy, Sochiot, Hogar, Oakter, Iotics) was found to offer the items below on their websites. They mostly sell a **product** and leave suitability, installation and after-sales to the customer or a dealer. Homeasy's USPs come from **owning the complete experience**.

> **USP rule:** a USP goes live on the website only when operations can deliver it every time. Guarantee terms, time limits and prices are set from pilot data, published in writing, and reviewed by a lawyer. A missed promise hurts more than no promise.

#### 5.7.1 Lead USPs (homepage, launch)

| # | USP | Customer-facing promise (draft) | What must exist to go live |
|---|---|---|---|
| U1 | **Smart Home Readiness Report** | "After your free survey, get a written report: photos of each switchbox, wiring condition, what's possible, and a fixed quote — yours to keep, even if you don't buy." | Survey checklist, report template, technician app/form, WhatsApp/PDF delivery |
| U2 | **WhatsApp photo check** | "Send a photo of your switchboard on WhatsApp. We'll reply within 30 minutes during working hours* if it can be made smart." | WhatsApp Business number, response rota, reply templates |
| U3 | **"Same look" installation guarantee** | "Your switchboard looks exactly the same after installation, and we leave your home clean — or we redo it free." | Written guarantee terms, installer SOP, before/after photos per job |
| U4 | **Fixed price, no surprises** | "One price for modules, installation, app setup and GST. What we quote is what you pay." | Package pricing, GST treatment, quote template, estimator data |
| U5 | **Local service promise** | "Problem? A Homeasy technician visits within 24 hours** in Patna. We replace first, repair later." | Service rota, spare stock, SLA tracking |

**Service-level definitions (decided values; conditions recommended — confirm before publishing):**

| Promise | Decided | Recommended conditions to publish with it |
|---|---|---|
| \* WhatsApp reply (U2) | **Within 30 minutes** | During published working hours (e.g. 9 am–9 pm, all days [TBC]); outside hours an auto-reply gives the next reply time; "reply" = a human response with an answer or next step, not only an acknowledgement |
| \*\* Service visit (U5) | **Within 24 hours** | Counted from complaint registration (WhatsApp/phone ticket); applies within the published Patna service area to Homeasy-installed systems; covers faults where a module or switch has stopped working; if a visit can't be made in time, the customer gets a stated remedy [e.g. free AMC month — TBC] |
| Warranty | **3 years** | Replacement of Homeasy modules for manufacturing defects; confirm ODM supplier warranty covers at least 3 years before publishing; workmanship warranty period [TBC] |

> **Operations check:** a 24-hour visit promise needs a technician on call 7 days a week, spare modules in stock, and a ticket log. A 30-minute reply needs a WhatsApp rota covering all working hours. Track both from day one of the pilot; publish them on the website only once the pilot hits them consistently (target ≥ 95% of cases [TBC]).

**Marketing story (emotional lead): U6 Parents' home control** — see 5.7.2; used in ads and social content from launch, with app features labelled by status.

#### 5.7.2 Product USPs (marked "Coming soon" until built)

| # | USP | Promise (draft) | Dependency | Status |
|---|---|---|---|---|
| U6 | **Parents' home control** | "Living in Delhi, Bengaluru or abroad? Look after your parents' home in Patna from your phone — and get an alert if no switch is used by morning." | Multi-home access in app; inactivity alert logic; consent from parents | Remote control: at launch [TBC]; alerts: Coming soon |
| U7 | **Inverter-aware automation** | "During a power cut, Homeasy switches off heavy loads automatically so your inverter lasts longer." | Power-cut detection, firmware logic, engineering and safety validation | Coming soon (feasibility TBC) |
| U8 | **Hindi-first experience** | "Website, app and support in Hindi and Hinglish, with a simple large-button mode for elders." | Translations, app localisation, simple mode UI | Website: see Q5; app: Coming soon |
| U9 | **Ready-made Indian routines** | "One-tap routines made for Indian homes: Morning geyser, Puja lights, Study time, Night path for parents." | Scene templates in app | At launch [TBC] |

#### 5.7.3 Service USPs (Phase 2)

| # | USP | Promise (draft) | Status |
|---|---|---|---|
| U10 | **Moves with you** | "Shifting homes? We remove and reinstall your Homeasy setup for a fixed fee." | Planned |
| U11 | **Homeasy Care plan** | "Extended warranty, yearly check-up and priority service in one annual plan." | Planned |
| U12 | **Live demo home** | "See it working before you buy — visit our Patna demo home or book a video demo." | At launch if demo setup ready [TBC] |

#### 5.7.4 Updated messaging hierarchy with USPs

| Level | Message |
|---|---|
| Core promise | Smart home without changing a single switch — surveyed, installed and guaranteed by Homeasy. |
| Tagline | One App. Every Device. Easy. |
| Lead USPs | Free survey + Readiness Report · WhatsApp photo check · "Same look" guarantee · Fixed price incl. installation · Local service promise |
| Emotional story | Look after your parents' home from anywhere. |

### 5.8 Features borrowed from competitor websites

| From | What they do | How Homeasy uses it | Where on site |
|---|---|---|---|
| Tata Power EZ Home | Products organised by job (fan, AC/geyser, dimmer, curtain); "start with one switch, grow to the whole home" | "What do you want to make smart?" appliance grid; Smart Room entry package | Home S5, /products, /pricing |
| Wozart; Revolve (AIT) | Warranty as a headline (3-year; 5-year replacement) | Warranty in hero trust chips and product cards; target ≥ 3 years [TBC] | Hero, /products, /warranty |
| Smarteefi | Clear spec card (load, voltage, Wi-Fi, 2-way, dimensions, box fit, warranty) | Standard spec card on every product page once final | /products/[slug] |
| SmartNode | Names the switch brands its modules fit behind | "Which switches do you have?" selector (brand names as text: Anchor, Legrand, Schneider, Havells, Roma, GM, Goldmedal, Other) | Home, /how-it-works |
| AZIOT | Demo video per product; "ways to make a switchboard smart" guides | 30-second install + app video per product; educational blog (Phase 2) | /products, /blog |
| Sochiot | Addresses old switchboards, surge protection, works with/without internet | "Old house?" reassurance block — claims only what Homeasy modules actually do | /how-it-works, FAQ |
| Switchy | Made in India, assembled and tested in-house | "Every module tested in Patna before installation" [only if true] | /products, /about |
| Oakter | Build-your-own smart home | Room-by-room cost estimator ending in "Book a free survey" | /estimator |
| Hogar Controls | Premium photography, consultative retrofit | Designer/premium page visuals; consultation tone | /solutions/designers |
| Iotics | "What is a retrofit module?" explainer | First FAQ item and How-it-works intro | /faq, /how-it-works |


---

## 6. Brand and design system

> **Note:** Logo, typography and palette are final (Section 6.1); remaining items below follow them.

### 6.1 Brand identity (final — November 2026)

The logo, wordmark font and core colours are **final** (brand sheet: *homeasy_brand_sheet_Chillax_CMYK_print.pdf*). All website design must follow them.

| Element | Final decision |
|---|---|
| Logo icon | **H Switch Plate** — rounded-square blue plate with two rockers forming "H"; left rocker white (off), right rocker amber with a white indicator dot (on) |
| Wordmark | **homeasy** in lowercase **Chillax Bold**, with the first "o" in amber (the "light on") |
| Tagline | One App. Every Device. Easy. |
| Logo variations | Full colour on dark · full colour on light · one-colour black · one-colour white |
| Applications | App icon (1024 × 1024 px) · profile picture (1080 × 1080 px, circle-safe) · favicon |

**Logo usage rules for the website**

| Rule | Spec |
|---|---|
| Header logo | Icon + wordmark lockup; 32 px icon height on mobile, 36–40 px on desktop |
| Footer logo | Lockup, one size down from header; tagline below on desktop |
| Favicon | Icon only; use the simplified icon at 16 px and 32 px (brand sheet shows down to 8 px — test legibility; minimum recommended on screen: 16 px) |
| Clear space | At least the width of one rocker on all sides of the icon and lockup |
| Backgrounds | Full-colour logo on White, Cloud White or Deep Navy (`#0B1220`); one-colour versions on photos or busy backgrounds. Navy dark version included in `homeasy-logo-kit.zip` |
| Don'ts | Don't recolour the rockers, stretch, rotate, add effects, place on blue or amber backgrounds, or set the wordmark in another font |

> **Colour accuracy note:** the uploaded brand sheet is a **CMYK print file**. The screen colours below were sampled from it after CMYK→RGB conversion, so they are close but not guaranteed exact. Ask the logo designer for the **official RGB/HEX** (screen), **CMYK** (print) and, ideally, **Pantone** values, and replace the HEX codes in 6.2 if they differ. Never use CMYK files on the website — export RGB SVG/PNG.

### 6.1a Visual direction — light-first, flat and geometric

- **Light-first:** bright, spacious pages on white and Cloud White, with **navy sections** for app demonstrations, smart-home scenes and product storytelling.
- **Flat and geometric:** matches the flat logo. Subtle 1 px borders, generous radii, simple flat illustrations and line icons.
- **No** glassmorphism, neon or decorative glows, heavy gradients or decorative shadows.
- **One signature moment:** the hero "flip the switch" interaction (29.2), drawn flat, where a soft amber light is the only lighting effect on the site.
- **Imagery:** real Indian homes and families, real switchboards and installs (after pilot), real app screens in simple device frames, flat-icon diagrams.
- **Avoid:** foreign stock photos, cluttered icon grids, dark heavy video backgrounds.

### 6.2 Colour palette (final, website) — "Navy + Homeasy Blue + Amber"

**Decision (16 Nov 2026):** combine the **logo's own blue and amber** with a **deep navy** and cool light neutrals. This is the most professional and current option: deep navy reads premium and technical (the look of leading tech and fintech brands), the logo's mid-blue is calmer and more trustworthy than a neon cyan, and amber gives Homeasy a warm, ownable accent. The brighter electric blue (`#33C4FF`) was rejected: it looks "consumer gadget", differs visibly from the logo, and fails contrast with white (2.0:1) and as text on white (2.0:1).

#### 6.2.1 Brand colours

| Name | HEX | Role | Share of page (guide) |
|---|---|---|---|
| **Deep Navy** | `#0B1220` | Primary text, dark sections, footer, secondary buttons | ~25% |
| **Homeasy Blue** | `#3A9ADB` | Logo plate, primary buttons (with navy text), icons, illustrations, brand highlights | ~15% |
| **Switch Amber** | `#F9B445` | Active states, indicators, the amber "o", key highlights, the hero "light on" | ~5% |
| **Pure White** | `#FFFFFF` | Page background, cards, text on navy | ~55% (with Cloud) |

*Blue and amber are the logo colours as sampled from the CMYK brand sheet; replace with the designer's official RGB/HEX if they differ (6.1).*

#### 6.2.2 Supporting neutrals

| Name | HEX | Use |
|---|---|---|
| Cloud White | `#F5F8FC` | Alternate light sections, input backgrounds |
| Border Grey | `#E5EAF0` | Card and input borders, dividers |
| Body Dark | `#344054` | Long body paragraphs on white (10.5:1); secondary text on Blue Tint |
| Blue Tint | `#DCEFFA` | Soft highlight backgrounds (info boxes, selected cards); navy text 15.8:1 |
| Slate Grey | `#667085` | Secondary text and captions on white (not lighter than this) |
| Navy 800 | `#16213A` | Cards and panels inside dark sections |
| Navy 700 | `#1E2B47` | Raised elements / hover inside dark sections |
| Mist Slate | `#A3B1C6` | Secondary text on navy |

#### 6.2.3 Tonal scales

| Step | Blue | Amber |
|---|---|---|
| 50 | `#EFF7FC` | `#FEF8EC` |
| 100 | `#D8EBF8` | `#FEECD0` |
| 200 | `#B0D7F1` | `#FCDAA2` |
| 300 | `#7FBDE8` | `#FAC774` |
| 400 | `#58A9E0` | **`#F9B445`** (brand) |
| 500 | **`#3A9ADB`** (brand) | `#D39637` |
| 600 | `#3080B8` | `#B07B2B` |
| 700 | `#286998` | `#966621` |
| 800 | `#20547A` | `#7D5218` |

#### 6.2.4 Approved pairings (measured contrast)

| Use | Pairing | Contrast | Status |
|---|---|---|---|
| **Primary button** | Navy `#0B1220` text on Blue `#3A9ADB` | 6.1:1 | ✅ AA |
| Secondary button | White text on Navy `#0B1220` | 18.7:1 | ✅ AAA |
| Amber button / chip | Navy text on Amber `#F9B445` | 10.4:1 | ✅ AAA |
| Body text | Navy on White | 18.7:1 | ✅ AAA |
| Secondary text | Slate `#667085` on White / Cloud | 5.0 / 4.7:1 | ✅ AA (minimum — don't lighten) |
| Inline links | Blue-700 `#286998` on White, underlined on hover | 5.9:1 | ✅ AA |
| Navigation links | Navy, Blue-700 underline on hover/active | 18.7:1 | ✅ |
| Text on dark sections | White on Navy | 18.7:1 | ✅ AAA |
| Secondary text on dark | Mist Slate `#A3B1C6` on Navy | 8.6:1 | ✅ AAA |
| Accents on dark | Amber / Blue-300 `#7FBDE8` on Navy | 10.4 / 9.2:1 | ✅ AAA |
| Badges | "Coming soon": Amber-800 on Amber-100 (5.9:1) · "Planned": Blue-700 on Blue-50 (5.4:1) · "Available": `#2E7D32` on white (5.1:1) | — | ✅ AA |
| ❌ Never | White on Blue (3.1:1) · White on Amber (1.8:1) · Blue `#3A9ADB` as text or links on white/Cloud (3.1 / 2.9:1) · Slate on Navy (3.8:1) · Slate on Blue Tint (4.2:1 — use Body Dark) | — | — |

Errors: `#C2352F` on white (5.5:1). Focus ring: 2 px Blue-700 + 2 px white offset (on dark: 2 px Amber).

#### 6.2.5 Design tokens (CSS)

```css
:root {
  /* Brand */
  --brand-navy: #0B1220;
  --brand-blue: #3A9ADB;
  --brand-amber: #F9B445;
  --brand-white: #FFFFFF;

  /* Neutrals */
  --surface-primary: #FFFFFF;
  --surface-secondary: #F5F8FC;
  --surface-dark: #0B1220;
  --surface-dark-raised: #16213A;
  --border-default: #E5EAF0;
  --text-primary: #0B1220;
  --text-secondary: #667085;
  --text-body: #344054;
  --surface-blue: #DCEFFA;
  --text-on-dark: #FFFFFF;
  --text-on-dark-secondary: #A3B1C6;

  /* Interactive */
  --link: #286998;
  --button-primary-bg: #3A9ADB;
  --button-primary-text: #0B1220;
  --button-primary-hover: #58A9E0;
  --button-secondary-bg: #0B1220;
  --button-secondary-text: #FFFFFF;
  --indicator-active: #F9B445;
  --focus-ring: #286998;

  /* Status */
  --success: #2E7D32;
  --error: #C2352F;
  --badge-soon-bg: #FEECD0;  --badge-soon-text: #7D5218;
  --badge-planned-bg: #EFF7FC; --badge-planned-text: #286998;

  /* Shape */
  --radius-card: 16px;
  --radius-button: 10px;
  --radius-section: 24px;
  --radius-input: 10px;
}
```

#### 6.2.6 Component colour treatment

| Component | Treatment |
|---|---|
| Header | White background, navy text, Blue-700 active underline; primary CTA button |
| Primary CTA ("Book a free home survey") | Homeasy Blue with navy text; hover Blue-400 |
| Secondary CTA (WhatsApp, "See how it works") | Navy with white text, or navy outline on white |
| Cards | White, 1 px Border Grey, 16 px radius, no shadow (optional 0 1px 2px rgba(11,18,32,0.04)) |
| Dark sections (app demo, product storytelling, USP band) | Navy background, white headings, Mist Slate body, amber indicators |
| Active indicators (selected chip, step, toggle "on") | Amber |
| Form fields | White, 1 px Border Grey, 10 px radius; focus = Blue-700 ring |
| Footer | Navy, white text, Mist Slate links |
| Logo on dark sections | Full-colour logo on Navy (designer to supply the dark-background version on navy instead of charcoal) |

### 6.3 Typography (final, website) — Chillax

**Decision:** Chillax (the logo font) is the website's primary typeface for a consistent, energetic brand. Long-form reading pages get a readability safeguard.

| Website element | Typeface | Weight |
|---|---|---|
| Hero headline | Chillax | Bold 700 |
| Page headings (H1) | Chillax | Bold 700 |
| Section headings (H2–H4) | Chillax | Semibold 600 |
| Navigation | Chillax | Semibold 600 |
| Buttons | Chillax | Semibold 600 |
| Body paragraphs (marketing pages) | Chillax | Regular 400 |
| Captions, labels, form fields | Chillax | Regular 400 |
| **Long-form pages** (FAQ answers, Guarantee, Warranty, Privacy, Terms, blog) | Chillax Regular **by default**; switch to **Satoshi Regular** if the readability test fails (see below) | 400 |
| Hindi / Devanagari | **Hind** | 400, 500, 600 |

**Readability test (before launch):** show 5 people a real FAQ page and the Guarantee page in Chillax Regular at 17–18 px on a phone. If more than one finds it tiring or slow, switch long-form body text to Satoshi (also Fontshare); headings stay Chillax.

**Type scale**

| Element | Desktop | Mobile | Line height | Letter spacing |
|---|---|---|---|---|
| Hero headline | 64–72 px | 38–44 px | 1.05 | −0.03em |
| H1 | 52–60 px | 34–38 px | 1.1 | −0.03em |
| H2 | 40–44 px | 28–32 px | 1.15 | −0.015em |
| H3 | 28–32 px | 22–24 px | 1.25 | 0 |
| H4 | 22–24 px | 19–20 px | 1.3 | 0 |
| Body | 16–18 px | 16–17 px | 1.6 | 0 |
| Small text | 13–14 px | 13–14 px | 1.5 | +0.005em |
| Button | 16 px | 16 px | 1 | +0.01em |
| Hindi body (Hind) | 17–18 px | 17 px | 1.7 | 0 |

Use fluid sizing (`clamp()`) between mobile and desktop values.

```css
@font-face { font-family: "Chillax"; src: url("/fonts/Chillax-Regular.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Chillax"; src: url("/fonts/Chillax-Semibold.woff2") format("woff2"); font-weight: 600; font-display: swap; }
@font-face { font-family: "Chillax"; src: url("/fonts/Chillax-Bold.woff2") format("woff2"); font-weight: 700; font-display: swap; }

:root { --font-primary: "Chillax", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        --font-hindi: "Hind", "Noto Sans Devanagari", sans-serif; }
body { font-family: var(--font-primary); color: var(--text-primary); background: var(--surface-primary); font-size: 17px; line-height: 1.6; }
h1, .hero { font-weight: 700; letter-spacing: -0.03em; }
h2 { font-weight: 600; letter-spacing: -0.015em; }
h3, h4 { font-weight: 600; letter-spacing: 0; }
button, .btn, nav a { font-family: var(--font-primary); font-weight: 600; }
:lang(hi) { font-family: var(--font-hindi); }
```

**Font files and licence (ITF Free Font License v2.0, received 16 Nov 2026 with `Chillax_Complete.zip`):**
- Self-host the **official WOFF2 files exactly as supplied** (`Chillax-Regular/Semibold/Bold.woff2`, or `Chillax-Variable.woff2`). **Do not subset, convert, rename or modify the font files** — the licence forbids subsetting and format conversion without ITF's written consent (this replaces the earlier "subset to Latin" advice).
- Preload Chillax Regular and Bold; `font-display: swap`. Keep `License/FFL.txt` in the repo.
- **Logos and wordmarks made with Chillax may be registered as trademarks** (licence section 01).
- **Do not hand the font files to an external developer, agency, designer or printer** — each must download their own copy from fontshare.com. Sending finished artwork (SVG/PDF/PNG of the logo) is allowed.
- PDFs may embed the font as long as it can't be extracted.

### 6.4 Spacing, grid and radius

| Token | Value |
|---|---|
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px |
| Section padding | 64 px mobile / 112 px desktop (vertical) |
| Container max width | 1200 px; text blocks max 720 px |
| Grid | 4 columns mobile, 8 tablet, 12 desktop; 16/24/32 px gutters |
| Radius | 8 px inputs, 12 px buttons, 16–24 px cards, full for pills/badges |
| Shadows | Soft only: `0 4px 24px rgba(15,23,42,0.06)` |

### 6.5 Breakpoints

| Name | Min width |
|---|---|
| Mobile | 0 (design at 360 and 390 px) |
| Tablet | 768 px |
| Desktop | 1024 px |
| Wide | 1440 px |

### 6.6 Iconography and illustration

- Line icons, 1.5–2 px stroke, rounded caps (e.g. Lucide).
- Flat-icon flow diagrams for "how it works" and architecture (founder preference).
- Device illustrations in brand colours with soft gradients.

### 6.7 Motion

| Element | Behaviour | Constraint |
|---|---|---|
| Hero animation | Switchboard cut-away reveals module, then room lights/fan respond to phone (Lottie or SVG) | < 150 KB; plays once; static fallback |
| Section reveal | Fade + 16 px rise on scroll | 300 ms ease-out |
| Buttons | Slight lift and colour shift on hover | 150 ms |
| Reduced motion | All animations disabled when `prefers-reduced-motion` is set | Must |

### 6.8 Component library (UI kit)

| Component | Variants | Notes |
|---|---|---|
| Button | Primary (gradient/solid), Secondary (outline), Tertiary (text link), sizes S/M/L | Min 44 × 44 px tap target |
| Badge | Available (green), Coming soon (amber), Planned (indigo) | Used everywhere for honesty rule R1 |
| Card | Feature card, persona/use-case card, team card, roadmap card | |
| Phone mockup | Single, tilted, triple-stack | Real screenshots only |
| Switchbox diagram | Cut-away illustration/animation | Hero-critical visual |
| Before/after slider | Install photos | Enabled with real content |
| Step list | Numbered 1–2–3 with icons and connector line | |
| Accordion | FAQ | Keyboard accessible |
| Tabs | Pricing (monthly/annual later), compatibility categories | |
| Timeline | Vertical (mobile), horizontal (desktop) | Status per item |
| Form fields | Text, email, phone (+91 default), select, multi-select chips, checkbox, textarea | Inline validation |
| Toast / alert | Success, error, info | |
| Modal | Survey booking modal | Focus trap, ESC to close |
| Navbar | Desktop, mobile drawer | Sticky, blur background |
| Footer | 4-column desktop, stacked mobile | |
| Cookie banner | Accept / Reject / Preferences | |
| Announcement bar | Optional top bar (e.g. "Now booking free home surveys in Patna") | Dismissible |

---

---

## 7. Information architecture

### 7.1 Sitemap

```
homeasy.io
├── /                          Home
├── /how-it-works              How it works (retrofit explained, survey → install → app)
├── /products                  Homeasy retrofit modules (line-up, status)
│   └── /products/[slug]       Product detail (when specs are final)
├── /installation              Installation & survey process, safety, warranty, service area
├── /pricing                   Packages (prices hidden until final)
├── /app                       Homeasy app (features, screenshots, store links when live)
├── /solutions                 Solutions hub
│   ├── /solutions/designers   Interior designers & architects
│   ├── /solutions/builders    Builders, developers & commercial spaces
│   ├── /solutions/electricians Electrician partner network
│   └── /solutions/government  Government & institutions (B2G)
├── /about                     Story, founder, company facts
├── /roadmap                   Roadmap (India only)
├── /investors                 For investors (public)
├── /careers                   Careers
├── /faq                       FAQ
├── /contact                   Contact
├── /book-survey               Survey booking (also a global modal)
├── /estimator                 Room-by-room cost estimator (borrowed: Oakter)
├── /demo                      Book demo home visit / video demo (U12)
├── /guarantee                 Homeasy promises: "Same look", fixed price, service promise — full terms
├── /readiness-report          Sample Smart Home Readiness Report (U1)
├── /service-area              Service area + pincode checker (Should; can be section of /installation)
├── /blog                      Phase 2
├── /privacy-policy            Rewrite
├── /terms-of-service          Rewrite (services + hardware + warranty)
├── /warranty                  Warranty policy (new, Must before first sale)
├── /cookie-policy             New
└── /404
```

### 7.2 Navigation

**Desktop header (sticky):**
`[Logo]` · How it works · Products · Pricing · Solutions ▾ · App · About · `[WhatsApp icon]` · `[Book a free survey]` (primary)

Solutions dropdown: Interior designers · Builders & commercial · Electricians · Government & institutions

**Mobile header:** `[Logo]` · `[Book survey]` · `[☰]` → drawer with all items + Installation, FAQ, Contact, Roadmap, Investors.

**Sticky mobile action bar (Must):** bottom bar with `[WhatsApp]` `[Call]` `[Book survey]`.

**Footer:**

| Homes | Business | Company | Help & legal |
|---|---|---|---|
| How it works | Interior designers | About | FAQ |
| Products | Builders & commercial | Roadmap | Contact |
| Installation | Electricians | Investors | Warranty |
| Pricing | Government | Careers | Privacy policy |
| Homeasy app | | | Terms of service |
| Book a free survey | | | Cookie policy |

Footer bottom: logo · tagline · social icons · "© 2026 Homeasy Automation Private Limited · CIN [insert CIN] · Incorporated 2025 · Registered office: [insert full registered address], Patna, Bihar, India" · phone [insert] · info@homeasy.io · WhatsApp [insert].

### 7.3 Redirects (301)

| Old URL | New URL |
|---|---|
| `/whyChoose` | `/how-it-works` |
| `/journey` | `/roadmap` |
| `/career` | `/careers` |
| `/compatibility` (if published from v2) | `/products` |
| `/features` (if published from v2) | `/app` |
| `/waitlist` (if published from v2) | `/book-survey` |
| `/partners` (if published from v2) | `/solutions` |

### 7.4 Conversion paths

| CTA | Priority | Where |
|---|---|---|
| Book a free survey | Primary | Header, hero, after process, pricing, products, installation, FAQ end, final CTA, sticky mobile bar |
| WhatsApp us | Primary (mobile) | Header icon, sticky bar, floating button (desktop), contact |
| Call us | Secondary | Sticky bar, contact, footer |
| Check service area | Secondary | Hero microcopy, installation, booking form |
| Partner enquiry (designer/builder/electrician) | B2B | Solutions pages |
| Government enquiry / capability PDF | B2G | /solutions/government |
| Get the app | Tertiary | /app (when live; existing customers) |
| Contact founder | Investors | /investors |

---

## 8. Page-by-page specifications

---

### 8.1 Home (`/`)

**Purpose:** explain retrofit in 5 seconds, build trust, convert to survey booking or WhatsApp.

#### Section 1 — Announcement bar (optional)
> 📍 Now booking free home surveys in Patna. **Book yours →**
*(Only enable when surveys are actually being accepted.)*

#### Section 2 — Hero
**Layout:** text left, visual right (desktop); text first (mobile). Visual: a normal Indian switchboard with a cut-away showing the Homeasy module behind it, and a phone controlling a fan and light.

| Element | Copy |
|---|---|
| Tagline | One App. Every Device. Easy. |
| H1 | Make your existing home smart — without changing your switches. |
| Subheadline | Homeasy fits small smart modules inside your existing switchbox — surveyed, installed and guaranteed by us. No rewiring, no broken walls. Control lights, fans, geyser and AC from your phone, and your switches still work. |
| Primary CTA | Book a free home survey |
| Secondary CTA | 📷 Send a switchboard photo on WhatsApp (U2) |
| Microcopy | Free survey · Installed by trained electricians · Now serving Patna [confirm] |
| Trust chips | ✓ "Same look" guarantee ✓ Fixed price incl. installation ✓ 3-year warranty ✓ Local service in Patna |

#### Section 3 — The problem
| Element | Copy |
|---|---|
| H2 | Smart homes shouldn't mean breaking walls. |
| Body | Most smart-home solutions need new switchboards or fresh wiring — expensive, messy and slow. DIY modules online leave you to figure out the wiring yourself. Homeasy takes a simpler path. |
| Comparison (3 columns) | **New smart switchboards** — costly, replaces your design · **DIY online modules** — no installation, no support · **Homeasy retrofit** — keeps your switches, installed and supported by us |

#### Section 4 — How Homeasy works (retrofit explained)
**Layout:** animated or step-illustrated switchbox diagram.

| Step | Title | Copy |
|---|---|---|
| 1 | We open your switchbox | Our electrician checks the wiring behind your existing switches. |
| 2 | We fit a Homeasy module | A compact smart module goes inside the box, connected to your switches. |
| 3 | We close it up | Your switchboard looks exactly the same. Switches work as before. |
| 4 | You control from the app | Lights, fans, geyser and AC — from your phone, on schedules, or with scenes. |

CTA: See the full process →

#### Section 5 — What you can make smart
**Layout:** icon tiles with short benefit.

| Appliance | Benefit | Status [TBC against MVP modules] |
|---|---|---|
| 💡 Lights | Switch off forgotten lights from anywhere | Available at launch |
| 🌀 Fans | On/off and speed control from the app | Available at launch [confirm fan module] |
| 🚿 Geyser | Hot water on schedule, never left running | Available at launch [confirm 16A module] |
| ❄️ AC & TV | Control via Homeasy IR remote | Coming soon [confirm] |
| 💧 Water motor | Schedule and auto-off | Coming soon [confirm] |
| 🌙 Outdoor & night lights | Sunset/sunrise schedules | Available at launch |

#### Section 6 — Our process (survey to support)
| Step | Title | Copy |
|---|---|---|
| 1 | Free home survey | We visit, check your switchboxes and wiring, and understand what you want to automate. |
| 2 | Clear quote | You get a simple quote — room by room or as a package. No surprises. |
| 3 | Professional installation | Trained Homeasy electricians install everything, usually in [TBC] hours. |
| 4 | App setup | We set up the app, rooms and family members, and show you how it works. |
| 5 | Support & warranty | 3-year warranty on Homeasy modules. Questions? WhatsApp reply within 30 minutes; technician visit within 24 hours in Patna. |

CTA: Book a free home survey

#### Section 7 — The Homeasy promise (lead USPs)
**Layout:** 5 large cards with icons; each links to details (/guarantee or relevant page).

| Card | Copy | Link |
|---|---|---|
| Free survey + Readiness Report (U1) | We check every switchbox and give you a written report with photos and a fixed quote — yours to keep. | Sample report → |
| WhatsApp photo check (U2) | Not sure? Send a photo of your switchboard and we'll reply within 30 minutes. | Open WhatsApp |
| "Same look" guarantee (U3) | Your switchboard looks exactly the same afterwards, and we leave your home clean — or we redo it free. | Guarantee terms → |
| Fixed price, no surprises (U4) | One price for modules, installation, app setup and GST. | See packages → |
| Local service promise (U5) | A Homeasy technician within 24 hours in Patna. Replace first, repair later. | Service details → |

Supporting line: Switches always work · Safe installation checklist · Built for Indian homes · One easy app.

#### Section 7A — Which switches do you have? (borrowed: SmartNode)
| Element | Copy |
|---|---|
| H3 | Works behind the switches you already have. |
| Selector | Anchor · Legrand · Schneider · Havells · Roma · GM · Goldmedal · Other / not sure (text chips, no logos) |
| Result | "Great — Homeasy modules are designed to fit behind standard Indian modular switchboards. Our survey confirms your boxes." → Book survey / Send photo |
| Note | Brand names belong to their owners. No partnership implied. |

#### Section 7B — Look after your parents' home (U6, emotional story)
| Element | Copy |
|---|---|
| H2 | Far from home? Look after your parents' home from anywhere. |
| Body | Working in Delhi, Bengaluru or abroad? Turn off a forgotten geyser, switch on the night light for your parents, and (coming soon) get an alert if no switch is used by morning. |
| Visual | Phone showing "Maa-Papa's home, Patna" dashboard |
| CTA | Book a survey for your parents' home |
| Badges | Remote control: At launch [TBC] · Inactivity alerts: Coming soon |

#### Section 7C — Made for Indian homes (product USPs)
| Tile | Copy | Status |
|---|---|---|
| Ready-made Indian routines (U9) | Morning geyser · Puja lights · Study time · Night path for parents | At launch [TBC] |
| Inverter-aware automation (U7) | Heavy loads switch off in a power cut so your inverter lasts longer | Coming soon |
| Hindi & simple mode (U8) | App in Hindi with large buttons for elders | Coming soon |

#### Section 7D — See it before you buy (U12)
Visit the Patna demo home or book a video demo. CTA: Book a demo → /demo *(enable when demo setup exists — flag `SHOW_DEMO`)*

#### Section 8 — Packages preview
| Package | Copy | Price |
|---|---|---|
| Smart Room | One room's lights and fan | From ₹[TBC] / "Price after survey" |
| Smart Essentials | Key rooms + geyser | From ₹[TBC] / "Price after survey" |
| Full Smart Home | Every room | Custom quote |
CTA: See packages →  · Microcopy: Exact price confirmed after your free survey.

#### Section 9 — The Homeasy app
| Element | Copy |
|---|---|
| H2 | Your whole home in one easy app. |
| Body | Control every room, create scenes like "Good night", schedule your geyser and share access with family. Free for every Homeasy customer. |
| Visual | Real app screenshots (dashboard, room, fan control, schedule) |
| Badges | Android & iOS — Coming soon (switch to store badges when live) |
| CTA | Explore the app → |

#### Section 10 — Real installations (enable after pilot)
Gallery of real before/after photos and short videos from pilot homes, with consented customer quotes. **Hidden until real content exists** (flag `SHOW_INSTALLS`).

#### Section 11 — For businesses and government
| Card | Copy | Link |
|---|---|---|
| Interior designers | Smart features without changing your design. | /solutions/designers |
| Builders & commercial | Smart-ready flats, offices and shops. | /solutions/builders |
| Electricians | Join the Homeasy electrician network. | /solutions/electricians |
| Government & institutions | Central control and energy savings for public buildings. | /solutions/government |

#### Section 12 — Service area
| Element | Copy |
|---|---|
| H2 | Now serving Patna. |
| Body | We're starting in Patna and expanding across Bihar and beyond. Check if we cover your area. |
| Component | Pincode checker → "Yes, we serve your area — book a survey" / "Not yet — leave your details and we'll tell you when we arrive" |

#### Section 13 — Founder note
> "For over 13 years I've worked in interior design, automation and smart-home integration. Most families want a smarter home — they just don't want broken walls or new switchboards. Homeasy makes that possible, with the switches you already have."
> — **Vishwjeet Narayanan**, Founder & CEO · Homeasy Automation Pvt. Ltd. · Incorporated 2025 · Patna

#### Section 14 — FAQ (6)
Do I need to change my switches? · Is rewiring needed? · Will my switches still work? · How long does installation take? · What if the internet is down? · Do you serve my area? (answers in 8.13)

#### Section 15 — Final CTA
| Element | Copy |
|---|---|
| H2 | Ready to make your home smart? |
| Body | Book a free home survey. We'll check your switchboxes and show you what's possible. |
| CTAs | Book a free home survey · WhatsApp us |

**SEO:** Title `Homeasy — Make Your Existing Home Smart Without Rewiring` · Meta `Homeasy fits smart modules inside your existing switchbox. Control lights, fans, geyser and AC from your phone. Free home survey in Patna.`

**Acceptance criteria**
- [ ] Hero H1, subheadline and primary CTA visible without scrolling at 360 × 740.
- [ ] Sticky mobile bar (WhatsApp, Call, Book survey) visible on all pages on mobile.
- [ ] No prices shown while `SHOW_PRICES=false`.
- [ ] No certification or "every switchbox" claims.
- [ ] Installations section hidden until real content exists.
- [ ] Pincode checker returns correct result for configured pincodes.
- [ ] LCP < 2.5 s on 4G.

---

### 8.2 How it works (`/how-it-works`)

| Section | Content |
|---|---|
| Hero | **H1:** How Homeasy makes your home smart · **Sub:** Small modules, inside your existing switchbox. Same switches, smarter home. |
| Retrofit explained | Large diagram: switchboard front → cut-away → module → Wi-Fi → app. Plain-language caption. |
| Before vs after | Same switchboard photo before/after (identical look) + phone showing control |
| What stays the same | Your switchboard design · Your switches · Your wiring |
| What changes | App control · Schedules · Scenes · Family sharing · (later) voice |
| The 5-step process | Survey → Quote → Install → App setup → Support |
| What we check in the survey | Switchbox depth · Neutral wire availability · Appliance loads (fan, geyser, AC) · Wi-Fi coverage · Wiring condition |
| Honest suitability note | "Most homes are suitable, but some old switchboxes or wiring need small fixes. Our survey tells you exactly what's possible before you pay anything." |
| Internet & power cuts | Switches always work; app needs Wi-Fi; [local control behaviour per firmware TBC] |
| FAQ (4) | Neutral wire? · Will it damage my wiring? · Rented home? · Can I add more rooms later? |
| CTA | Book a free home survey |

**SEO:** `How Homeasy Works — Smart Home Retrofit Without Rewiring` · `See how Homeasy fits smart modules behind your existing switches. Free survey, professional installation, easy app.`

---

### 8.3 Products (`/products`)

**Purpose:** show the Homeasy module line-up honestly.

| Section | Content |
|---|---|
| Hero | **H1:** Homeasy smart modules · **Sub:** Designed to fit inside Indian switchboxes and make everyday appliances smart. |
| Product grid | Cards (see table) with image/render, name, what it controls, status badge, "Learn more" |
| How products are sold | "All Homeasy modules are installed by our trained electricians after a free survey." |
| Specs note | "Detailed specifications will be published once certification and testing are complete." |
| CTA | Book a free home survey |

| Product (working names) | Controls | Status |
|---|---|---|
| Homeasy Smart Relay (2/4-channel) | Lights and small appliances | Coming soon [TBC] |
| Homeasy Fan Controller | Fan on/off and speed | Coming soon [TBC] |
| Homeasy Power Module (16A) | Geyser, AC, motor | Coming soon [TBC] |
| Homeasy IR Remote | AC, TV via infrared | Coming soon [TBC] |
| Homeasy No-Neutral Module | Homes without neutral wire | Planned |
| Homeasy Smart Plug | Plug-in appliances | Planned |

**Product detail page (`/products/[slug]`)** — enabled per product when final: hero render, what it does, where it's used, compatible appliances, specs table (from ODM datasheet), certifications (only once issued), in-the-box, warranty, FAQs, CTA.

**SEO:** `Homeasy Smart Modules — Retrofit Smart Switch Modules for Indian Homes` · `Explore Homeasy smart relay, fan controller, power module and IR remote — installed inside your existing switchbox.`

---

### 8.4 Installation (`/installation`)

| Section | Content |
|---|---|
| Hero | **H1:** Professional installation, done right. · **Sub:** From free survey to app setup — our trained electricians handle everything. |
| Process timeline | 5 steps with what happens, who comes, how long [TBC] |
| Survey checklist | What the technician checks (same as 8.2) |
| Safety promise | Power off before work · Load checks · Insulation and fit checks · Tested before handover · Photo record of each switchbox [confirm SOP] |
| What you need to do | Be available, Wi-Fi password ready, list of rooms/appliances |
| Warranty & support | 3-year module warranty; raise an issue on WhatsApp/phone; WhatsApp reply within 30 minutes (working hours); technician visit within 24 hours in Patna → link /warranty, /guarantee |
| Service area | Pincode checker + list of covered areas |
| CTA | Book a free home survey |

**SEO:** `Smart Home Installation in Patna — Homeasy` · `Free home survey and professional smart-module installation by trained Homeasy electricians in Patna.`

---

### 8.5 Pricing (`/pricing`)

| Section | Content |
|---|---|
| Hero | **H1:** Simple packages. Exact price after a free survey. |
| Package cards | Smart Room · Smart Essentials · Full Smart Home (see table) |
| Add-ons | Extra module · IR remote · Smart plug · Extended warranty/AMC (later) |
| What's included | Modules · Installation · App setup · Warranty [TBC] |
| Why a survey first | Every home's wiring is different — the survey ensures an accurate, fair quote |
| Payment terms | [TBC] e.g. advance at booking, balance after installation; accepted methods |
| App note | "The Homeasy app is free for every Homeasy customer." |
| FAQ | Is the survey free? · Any hidden charges? · GST included? · Can I start with one room? |
| CTA | Book a free home survey |

| Package | Includes | Price (`SHOW_PRICES`) |
|---|---|---|
| Smart Room | Modules for one room's lights and fan, installation, app setup | From ₹[TBC] |
| Smart Essentials | 2–3 rooms + geyser module, installation, app setup | From ₹[TBC] |
| Full Smart Home | All rooms, geyser, AC (IR), custom scenes | Custom quote |
| B2B / projects | Bulk and project pricing | On request → solutions pages |

**Acceptance:** with `SHOW_PRICES=false`, price cells show "Price after free survey"; no checkout buttons.

---

### 8.6 The Homeasy app (`/app`)

| Section | Content |
|---|---|
| Hero | **H1:** One easy app for your whole home. · **Sub:** Free for every Homeasy customer. Android and iOS. |
| Features (MVP, confirm) | Rooms & dashboard · Light and fan control (with speed) · Scenes · Schedules · Family sharing |
| Coming soon | Voice assistants · Energy insights · Other smart brands in the same app |
| Screens | Real screenshots in phone frames |
| Store badges | Hidden until `APP_LIVE=true`; before that "Coming soon with your installation" |
| Privacy note | Link to privacy policy |
| CTA | Book a free home survey |

---

### 8.7 Solutions hub (`/solutions`) and pages

**Hub:** four cards linking to each solution page + "Not sure? Contact us".

#### 8.7.1 Interior designers & architects (`/solutions/designers`)
| Section | Content |
|---|---|
| Hero | **H1:** Smart homes without changing your design. · **Sub:** Add smart control behind the switchboards your clients love. |
| Benefits | Keeps chosen switch designs · No wall chasing · Installs during or after renovation · Adds premium value to projects |
| How we work with you | Site visit with you → proposal you can share with clients → installation scheduled with your timeline → handover with app setup |
| Partner benefits | Trade pricing [TBC] · Priority scheduling · Co-branded proposals [TBC] · Demo access |
| Form | Designer enquiry (Section 10.3) |

#### 8.7.2 Builders & commercial (`/solutions/builders`)
| Section | Content |
|---|---|
| Hero | **H1:** Smart-ready homes and spaces, without redesign. |
| Use cases | Ready flats · Show flats · Under-construction projects · Offices · Shops · Clinics · PGs and hostels |
| Benefits | Differentiate projects · Faster sales story · Resident app onboarding by Homeasy · Support after handover |
| Process | Project survey → BOQ and proposal → pilot flat/show flat → rollout → resident support |
| Pricing | Project pricing on request |
| Form | Builder/commercial enquiry |

#### 8.7.3 Electricians (`/solutions/electricians`)
| Section | Content |
|---|---|
| Hero | **H1:** Grow your work with Homeasy. · **Sub:** Join our electrician network — earn more with smart-home installations. |
| Benefits | Training on Homeasy modules · Paid installation jobs [model TBC] · Referral rewards [TBC] · Support from Homeasy team |
| Requirements | Experience in house wiring; [licence requirements TBC]; smartphone |
| Form | Electrician enquiry (name, phone, area, years of experience) |

#### 8.7.4 Government & institutions (`/solutions/government`)
| Section | Content |
|---|---|
| Hero | **H1:** Smarter, energy-efficient public buildings — without rewiring. |
| Use cases | Government quarters · Hostels · Offices · Schools and colleges · Hospitals · Guest houses |
| Benefits | Central control and schedules · Reduce wasted electricity (no % claims until measured) · Retrofit without civil work · Local support |
| Company credentials | Legal name, CIN, incorporation 2025, registered address, GST [insert], registrations (only confirmed: DPIIT, GeM, etc.) |
| Capability statement | PDF download (Must before outreach) |
| Form | Government enquiry |
| Note | No claims of empanelment, tenders or references until real (R8) |

**SEO (solutions):**
| Page | Title | Meta |
|---|---|---|
| Designers | Smart Home Solutions for Interior Designers — Homeasy | Add smart control behind existing switchboards — no design change, no rewiring. |
| Builders | Smart-Ready Homes for Builders & Commercial — Homeasy | Retrofit smart control for flats, offices and shops with Homeasy. |
| Electricians | Join the Homeasy Electrician Network | Earn more with smart-home installations. Training and support by Homeasy. |
| Government | Smart Retrofit for Government Buildings — Homeasy | Central control and energy efficiency for public buildings without rewiring. |

---

### 8.8 About (`/about`)

| Section | Copy / content |
|---|---|
| Hero | **H1:** Making Indian homes smart — the easy way. · **Sub:** Homeasy is a Patna-based company converting traditional homes into smart homes, without changing switches or rewiring. |
| Story | "Most Indian families live in homes built long before smart homes existed. Replacing switchboards or rewiring is costly and disruptive. We started Homeasy in 2025 to make smart living possible for these homes — with small modules inside the switchboxes they already have, installed and supported by our own team." |
| Mission | Make every Indian home smart, safe and easy to live in — without rebuilding it. |
| Values | Simplicity · Honesty · Safety first · Built for India · Reliable support |
| Founder | Vishwjeet Narayanan, Founder & CEO — 13+ years of personal experience in interior design, automation and smart-home integration; B.Tech, MAIT Rohini (GGSIPU); Diploma in Mechanical Engineering, Government Polytechnic Purnea. LinkedIn. |
| Team | Founder only (decided). Line: "We're a small, focused team building Homeasy from Patna." |
| Company facts | Homeasy Automation Private Limited · CIN [insert] · Incorporated 2025 · Registered office [insert address], Patna, Bihar · GST [insert, optional] · info@homeasy.io |
| Recognition | Confirmed items only; hidden if none |
| CTA | Book a free survey · Partner with us |

**SEO:** `About Homeasy — Smart Home Retrofit Company from Patna` · `Homeasy Automation Pvt. Ltd. (founded 2025, Patna) converts traditional homes into smart homes without rewiring.`

---

### 8.9 Roadmap (`/roadmap`)

| Period | Milestone | Status |
|---|---|---|
| 2025 | Homeasy Automation Pvt. Ltd. incorporated in Patna | Done |
| 2025–2026 | Product research and app UX design | Done [confirm] |
| Nov 2026 | Retrofit-first strategy adopted | Done |
| Next | Homeasy modules (ODM partnership, testing, certification) | In progress / Planned |
| Next | Homeasy app MVP (Android & iOS) | In progress |
| Next | Pilot installations in Patna | Planned |
| Then | Patna launch: surveys and installations | Planned |
| Then | Designer, builder and electrician partner programmes | Planned |
| Then | Government and institutional projects | Planned |
| Later | More cities in Bihar and across India | Planned |
| Then | Indian routines, parents' home inactivity alerts, Hindi app with simple mode | Planned |
| Then | Inverter-aware automation (after feasibility and safety validation) | Planned |
| Later | Homeasy Care plan and "Moves with you" service | Planned |
| Later | Voice control, energy insights, other smart brands in the app | Planned |

Disclaimer: "Roadmap reflects current plans and may change." No specific dates unless approved.

---

### 8.10 Investors (`/investors`) — public

| Section | Content |
|---|---|
| Hero | **H1:** Bringing smart living to India's traditional homes. |
| Problem | Most homes can't go smart without rewiring; DIY modules lack installation and support |
| Solution | Retrofit modules + professional installation + free app |
| Model | Hardware + installation from day one; B2B and B2G projects; service plans later |
| Market | India; Patna pilot, then Bihar and other cities via installer partners |
| Stage | Pre-launch; pilot preparation; incorporated 2025 |
| Founder | Summary + link to About |
| Downloads | One-pager PDF (Could) |
| CTA | Contact the founder (topic pre-set "Investor") |
| Rule | No figures without approval (R10) |

---

### 8.11 Careers (`/careers`)

Mission; roles likely needed: embedded/firmware engineer, mobile app developer, backend developer, installation lead/electricians, sales (B2B/B2G). Open roles from `data/jobs.json`; empty state "Send your profile to info@homeasy.io".

---

### 8.12 Contact (`/contact`)

Form (topic: Home survey · Designer · Builder/commercial · Electrician · Government · Investor · Press · Careers · Support) · Phone [insert] · WhatsApp [insert] · Email · Registered address · Office hours [TBC] · Google Map link (static image) · "We usually reply within [TBC] working hours."

---

### 8.13 FAQ (`/faq`)

**Retrofit basics**
- **Do I need to change my switches?** No. Homeasy modules fit inside your existing switchbox, behind the switches you already have.
- **Is rewiring needed?** No rewiring in most homes. Our free survey checks your wiring first; if something needs a small fix, we'll tell you before you pay.
- **Will my switches still work?** Yes. Your switches work exactly as before, even if the internet is down.
- **Will my switchboard look different?** No. From the outside, it looks the same.
- **What is a neutral wire and do I need one?** It's one of the wires in your switchbox. Some modules need it; our survey checks this. [No-neutral option: planned]
- **Is it safe?** Installations are done by trained electricians following a safety checklist. [Add certification info only once issued]

**Installation & service**
- **How long does installation take?** Typically [TBC] hours per room/home.
- **Is the survey really free?** Yes, within our service area.
- **Which areas do you serve?** Patna to start. Check your pincode.
- **What warranty do I get?** 3 years on Homeasy modules against manufacturing defects — see our warranty policy.
- **How fast do you fix problems?** We reply on WhatsApp within 30 minutes during working hours, and a technician visits within 24 hours in Patna.
- **Who do I contact for support?** WhatsApp or call our support team.
- **Can I add more rooms later?** Yes, anytime.
- **Can I install it in a rented home?** Usually yes, as nothing visible changes — check with your landlord.

**App**
- **Is the app free?** Yes, free for every Homeasy customer.
- **Android or iOS?** Both.
- **What if the internet goes down?** Your switches always work. App control needs Wi-Fi/internet [local control: TBC].
- **Does it work with Alexa or Google?** Coming soon [TBC].
- **Can my family use it?** Yes, with family sharing.

**Pricing**
- **How much does it cost?** It depends on rooms and appliances. Packages start from ₹[TBC]; your exact price is confirmed after the free survey.
- **Is GST included?** [TBC]
- **How do I pay?** [TBC]

**Business & company**
- **Do you work with interior designers, builders or government?** Yes — see Solutions.
- **Who is behind Homeasy?** Homeasy Automation Private Limited, founded in 2025 in Patna, led by Founder & CEO Vishwjeet Narayanan.

---

### 8.14 Book a survey (`/book-survey` + global modal)

| Element | Copy |
|---|---|
| Title | Book your free home survey |
| Sub | Our technician will visit, check your switchboxes and wiring, and suggest the best setup. No obligation. |
| Form | Section 10.1 |
| Success | ✅ Survey request received! We'll call or WhatsApp you within [TBC] to confirm your visit. [WhatsApp us now] |
| Out of area | "We're not in your area yet. We've saved your details and will let you know when we arrive." |
| Error | "Something went wrong. Please WhatsApp us at [number] or call [number]." |

### 8.15 Warranty (`/warranty`) — Must before first sale
| Section | Content |
|---|---|
| Term | **3 years** from installation date on Homeasy modules |
| Coverage | Manufacturing defects in Homeasy modules; replacement (not repair) during the warranty period |
| Workmanship | Homeasy installation workmanship warranty — period [TBC] |
| How to claim | WhatsApp/phone → ticket number → reply within 30 minutes (working hours) → visit within 24 hours in Patna service area |
| Not covered (draft) | Damage from lightning, water, fire or physical impact; electrical faults in the home's wiring or supply outside the module; voltage surges beyond the module's rated protection [TBC once specs known]; modules opened, moved or reinstalled by anyone other than Homeasy; third-party devices and appliances; normal wear of switches and plates |
| Transfer | Stays with the home if sold/rented to new occupants [TBC] |
| Documents | Invoice / Readiness Report reference |
| Review | Lawyer review; must match ODM supplier warranty |

### 8.16 Legal pages
| Page | Requirement |
|---|---|
| Privacy policy | Survey/contact data, phone/WhatsApp use, app data, analytics, DPDP Act rights, grievance officer |
| Terms of service | Website use, survey, quotes, payments, installation, cancellations, liability, app terms |
| Cookie policy | Cookies, purpose, duration, opt-out |

### 8.18 Cost estimator (`/estimator`) — borrowed from Oakter

| Step | UI | Notes |
|---|---|---|
| 1 | Home type (apartment / independent house / office) | Chips |
| 2 | Add rooms (bedroom, living, kitchen, bathroom, balcony, other) with count | Steppers |
| 3 | Per room: lights (count), fans (count), geyser (yes/no), AC (count), TV, curtains | Defaults per room type |
| 4 | Result: suggested modules + estimated range "₹[min]–₹[max] incl. installation & GST" (U4) | Shown only when `SHOW_PRICES=true`; otherwise "We'll confirm your exact price after the free survey" |
| 5 | CTA: Book a free survey (pre-fills rooms/appliances) · Send on WhatsApp | |

Data: `data/estimator.json` (module mapping rules, price ranges). Acceptance: estimate updates instantly; survey form pre-filled; range disclaimer visible.

### 8.19 Demo (`/demo`) — U12

| Section | Content |
|---|---|
| Hero | **H1:** See Homeasy working before you decide. |
| Options | **Visit our Patna demo home** (address shown after booking) · **Video-call demo** (WhatsApp video, 15 minutes) |
| Form | Name*, mobile*, demo type*, preferred date/slot*, consent* |
| Flag | `SHOW_DEMO` — hidden until a demo setup exists |

### 8.20 Guarantee (`/guarantee`) — U3, U4, U5 terms

| Section | Content |
|---|---|
| Hero | **H1:** The Homeasy promise. In writing. |
| Promises | "Same look" installation guarantee · Fixed price, no surprises · Local service promise · Warranty summary (link /warranty) |
| For each | What we promise · What counts · What doesn't (e.g. pre-existing wiring faults, customer-requested changes) · How to claim |
| Rule | Decided values: 30-minute WhatsApp reply, 24-hour visit, 3-year warranty; conditions per 5.7.1; lawyer review before launch (R13) |

#### 8.20.1 "Same look" installation guarantee — draft terms

**The promise:** "After installation, your switchboard looks exactly the same, every switch works by hand as before, and we leave your home clean — or we redo it free."

| What's covered | Detail |
|---|---|
| Same appearance | Switch plate, switches and positions refitted exactly as before; module not visible |
| Manual switches | Every switch works by hand as before |
| No new damage | Any damage Homeasy causes to plates, switches, box or the wall around it is repaired or replaced free |
| Clean site | Dust and debris cleaned before leaving |
| Proof | Technician takes before/after photos of every switchbox (shared in the Readiness Report / handover) |

| Exclusions (draft) | Why |
|---|---|
| Pre-existing damage — cracked plates, loose or broken switches, damaged boxes, wall marks — recorded in survey photos | Not caused by Homeasy |
| Old or brittle plates/switches that break when opened because of age — **Homeasy warns at survey; customer chooses to proceed or replace at cost before work** | Age-related, disclosed in advance |
| Shallow boxes needing a spacer/extension frame or box change that alters the look — **only with written approval in the quote** | Agreed change, not a surprise |
| Wiring corrections needed for safety (e.g. adding a neutral, replacing burnt wires) that need visible work — **agreed in the quote** | Safety requirement |
| Customer-requested changes (new switches, moved points, new plates) | Customer's choice |
| Discontinued switch models where an identical replacement part isn't available — Homeasy offers the closest match | Parts availability |
| Paint finish — Homeasy repairs damage it causes; exact paint colour matching is limited to touch-up | Paint ageing varies |
| Changes or damage after handover by others, tampering, or later electrical events (surges, lightning) | Outside installation; handled under warranty terms |

| Claim process | Detail |
|---|---|
| Window | Report within 7 days of installation [TBC] |
| How | WhatsApp photo of the issue + ticket |
| Remedy | Revisit and redo free, within 24 hours of the claim in Patna service area |
| Evidence | Before/after photos decide disputes |

*Draft only — exclusions must be reviewed by a lawyer and shown to the customer at survey/quote stage.*

### 8.21 Sample Readiness Report (`/readiness-report`) — U1

| Element | Content |
|---|---|
| Purpose | Show what customers receive after the survey |
| Content | Sample (anonymised/demo) report: home summary, photo of each switchbox, neutral wire yes/no, box depth fit, load notes (geyser/AC), safety observations, recommended modules per room, fixed quote, validity period |
| Format | Web page preview + downloadable sample PDF |
| CTA | Get your free report — book a survey |

### 8.22 WhatsApp photo check flow — U2

| Step | Detail |
|---|---|
| Entry | Hero secondary CTA, sticky bar, product pages, FAQ |
| Link | `wa.me/[number]?text=` pre-filled: "Hi Homeasy, here's a photo of my switchboard. Can it be made smart? My area/pincode: ___" |
| Website fallback (Should) | Upload form: photo(s)*, mobile*, pincode*, consent* → stored, team replies on WhatsApp |
| Team process | Reply template: feasible / needs survey / not suitable + "Book free survey" link |
| SLA | Reply within **30 minutes** during working hours; auto-reply outside hours; reply time tracked per chat |

### 8.17 404
> **H1:** This page isn't wired up. · [Go home] [Book a free survey]

---

## 9. Global components

| Component | Behaviour |
|---|---|
| Header | Sticky, blur after scroll, Solutions dropdown (keyboard accessible), WhatsApp icon, primary CTA |
| Sticky mobile action bar | WhatsApp · Call · Book survey; hidden when keyboard is open or booking modal is visible |
| Floating WhatsApp button (desktop) | Bottom-right; pre-filled message "Hi Homeasy, I'd like to know about making my home smart." |
| Survey booking modal | Opens from any "Book a free survey" CTA; records `source_cta`; focus trap; ESC to close |
| Pincode checker | Input 6 digits → checks `data/service-areas.json` → yes/no state with CTA |
| Status badge | `available | coming-soon | planned` |
| Cookie banner | Analytics only after consent; Reject as prominent as Accept |
| Announcement bar | Optional, dismissible (30 days) |
| Switchbox diagram | Reusable SVG/Lottie illustration (home, how it works) |
| Before/after slider | For install photos (enabled with real content) |
| Theme | Light/dark per system |

---

## 10. Forms, data model and lead flows

### 10.1 Survey booking form (primary)

| Field | Type | Required | Validation / notes |
|---|---|---|---|
| Full name | Text | Yes | 2–60 chars |
| Mobile number | Tel (+91) | Yes | 10-digit Indian mobile |
| Same number on WhatsApp? | Toggle | No | Default yes; else WhatsApp number field |
| Email | Email | No | Optional |
| Pincode | Number | Yes | 6 digits; triggers service-area check |
| Area / locality | Text | Yes | 2–80 chars |
| Home type | Select | Yes | Apartment / Independent house / Office or shop / Other |
| Number of rooms to automate | Select | No | 1 / 2–3 / 4–5 / Whole home / Not sure |
| What do you want to control? | Multi-select chips | No | Lights, Fans, Geyser, AC, TV, Water motor, Outdoor lights, Other |
| Switch brand (if known) | Select | No | Anchor, Legrand, Schneider, Havells, Roma, GM, Goldmedal, Other, Not sure — pre-filled from selector |
| Preferred survey date | Date | No | Today + 1 to + 30 days |
| Preferred time slot | Select | No | Morning / Afternoon / Evening |
| How did you hear about us? | Select | No | Instagram, Facebook, YouTube, Google, WhatsApp, Friend/family, Electrician, Interior designer, Other |
| Consent | Checkbox | Yes | "I agree to be contacted by phone/WhatsApp about my survey and accept the Privacy Policy." |
| Hidden | — | — | source_cta, page, UTM params, in_service_area, timestamp |
| Honeypot | Hidden | — | Must be empty |

### 10.2 B2B forms

| Field | Designer | Builder/commercial | Electrician |
|---|---|---|---|
| Name | Req | Req | Req |
| Mobile | Req | Req | Req |
| Email | Req | Req | Opt |
| Firm / company | Req | Req | Opt |
| City | Req | Req | Req (area) |
| Projects per year / project size | Opt | Req (units/sq ft) | — |
| Project type | — | Req (residential/office/retail/hostel/other) | — |
| Years of experience | — | — | Req |
| Message | Opt | Opt | Opt |
| Consent | Req | Req | Req |

### 10.3 Government enquiry form

Name*, designation*, department/organisation*, official email*, phone*, city/district*, building type* (quarters/hostel/office/school/hospital/other), approximate scale (rooms/buildings), timeline, message, consent*.

### 10.4 Contact form
Name*, phone*, email, topic*, message* (20–2000 chars), consent*.

### 10.5 Data model

```
survey_requests
  id uuid pk, full_name, mobile, whatsapp, email null,
  pincode, locality, in_service_area boolean,
  home_type, rooms, appliances text[], preferred_date date null, time_slot,
  heard_from, consent, source_cta, utm_source, utm_medium, utm_campaign,
  status enum('new','contacted','survey_scheduled','surveyed','quoted','won','lost','out_of_area'),
  assigned_to null, notes null, created_at

b2b_leads
  id, type enum('designer','builder','electrician'), name, mobile, email,
  company, city, project_size, project_type, experience_years, message,
  consent, status, created_at

gov_leads
  id, name, designation, department, official_email, phone, district,
  building_type, scale, timeline, message, consent, status, created_at

contact_messages
  id, name, phone, email, topic, message, consent, status, created_at

photo_checks
  id, mobile, pincode, photo_urls text[], consent, result enum('feasible','needs_survey','not_suitable') null,
  replied_at null, created_at

estimates
  id, home_type, rooms jsonb, appliances jsonb, est_min null, est_max null,
  converted_to_survey boolean, created_at

demo_bookings
  id, name, mobile, demo_type enum('visit','video'), preferred_date, slot, consent, status, created_at

readiness_reports
  id, survey_request_id fk, report_url, quote_amount null, valid_until, sent_at

service_areas (JSON file in v1)
  pincode, locality, city, active boolean
```

**Storage (zero/low cost):** Supabase free tier or Google Sheets [TBC]. The `status` field doubles as a simple CRM pipeline; export to CSV.

### 10.6 Lead flows and notifications

| Trigger | To customer | To Homeasy |
|---|---|---|
| Survey request (in area) | Confirmation (email if given; WhatsApp/SMS template [TBC]) | Instant email + WhatsApp/Slack-style alert to founder/ops [TBC]; row in sheet/DB |
| Survey request (out of area) | "We'll notify you" message | Logged for expansion analysis |
| B2B / gov lead | Acknowledgement email | Email to founder with lead type in subject |
| Contact form | Auto-reply | Email routed by topic |

**SLA target:** call/WhatsApp every survey request within [TBC] working hours.

**Confirmation email draft**
> **Subject:** Your free Homeasy home survey request ✅
> Hi {first_name}, thanks for booking a free home survey with Homeasy. Our team will contact you within [TBC] to confirm a visit time. During the visit, we'll check your switchboxes and wiring and suggest the best setup for your home. Questions? WhatsApp us at {number}.
> — Team Homeasy · One App. Every Device. Easy.

Email via Zoho Mail (info@homeasy.io) with SPF/DKIM/DMARC. WhatsApp Business app for manual follow-up in v1; WhatsApp API automation later (cost).

---

## 11. Functional requirements and acceptance criteria

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| F1 | Survey booking modal + page | Must | Opens from all CTAs; validates; checks pincode; stores lead; shows correct success/out-of-area/error state; notifies Homeasy within 1 min |
| F2 | Pincode service-area checker | Must | Returns correct status from `service-areas.json`; editable without code changes |
| F3 | Click-to-WhatsApp and click-to-call | Must | Correct number; pre-filled message; tracked |
| F4 | Sticky mobile action bar | Must | Visible on all mobile pages; doesn't cover form fields |
| F5 | B2B forms (designer, builder, electrician) | Must | Stored with type; acknowledgement sent |
| F6 | Government form + capability PDF | Must | Stored; PDF downloads; tracked |
| F7 | Price visibility flag | Must | `SHOW_PRICES=false` shows "Price after free survey" everywhere |
| F8 | Product status from data file | Must | `products.json` drives grid and badges |
| F9 | Installations gallery flag | Should | Hidden until `SHOW_INSTALLS=true` |
| F10 | App store badges flag | Must at app launch | `APP_LIVE` swaps "Coming soon" for badges |
| F11 | Product detail pages | Could | Generated per product with `detailReady=true` |
| F12 | 301 redirects | Must | Section 7.3 |
| F13 | Cookie consent | Must | No analytics before consent |
| F14 | Lead export / status update | Should | Founder can view, filter by status and export CSV |
| F15 | Light/dark mode | Should | AA contrast both modes |
| F16 | Hindi version | Could (Phase 2) | `/hi/` routes, hreflang |
| F17 | Blog | Could (Phase 2) | MDX; hidden until ≥ 3 posts |
| F18 | Customer portal (orders, warranty, service requests) | Could (Phase 2) | — |
| F19 | 404 page | Must | Custom design with CTAs |
| F20 | WhatsApp photo check link (U2) | Must | Pre-filled message opens WhatsApp on Android/iOS/desktop; tracked |
| F21 | Photo upload fallback form | Should | Up to 3 images, ≤ 5 MB each, compressed client-side; stored privately; team notified |
| F22 | Switch-brand selector | Should | Text chips; result message; value passed to survey form |
| F23 | Cost estimator | Should | Instant calculation from `estimator.json`; respects `SHOW_PRICES`; pre-fills survey form |
| F24 | Guarantee page | Must (before claiming U3–U5) | All promises link here; terms versioned with date |
| F25 | Sample Readiness Report page + PDF | Must (U1) | Anonymised sample; downloadable; tracked |
| F26 | Demo booking | Could | Behind `SHOW_DEMO`; form stored and notified |
| F27 | USP status flags | Must | Each USP section/card can be toggled independently (`USP_U1`…`USP_U12`) so only deliverable promises show |
| F28 | Parents' home section | Should | Status badges per sub-feature; CTA pre-fills survey with "for parents' home" tag |


## 12. Non-functional requirements

### 12.1 Performance

| Metric | Target |
|---|---|
| Lighthouse mobile (Perf/A11y/BP/SEO) | ≥ 90 each |
| LCP | < 2.5 s on 4G |
| INP | < 200 ms |
| CLS | < 0.1 |
| Homepage total weight | < 1.5 MB initial load |
| JS bundle (initial) | < 200 KB gzipped |

Techniques: Next.js Image with AVIF/WebP, lazy loading below the fold, replace MP4 hero videos with Lottie/SVG or short compressed WebM loaded on interaction, static generation (SSG) for all pages, official font files served unmodified (no subsetting — licence).

### 12.2 Accessibility (WCAG 2.1 AA)

- [ ] Colour contrast AA in light and dark mode
- [ ] All images have meaningful `alt` (decorative = empty alt)
- [ ] Full keyboard navigation; visible focus ring
- [ ] Skip-to-content link
- [ ] Form labels, error messages linked with `aria-describedby`
- [ ] Modals/drawers trap focus and restore it on close
- [ ] Headings in logical order (one H1 per page)
- [ ] `prefers-reduced-motion` respected
- [ ] Tap targets ≥ 44 × 44 px
- [ ] Tested with screen reader (TalkBack on Android, VoiceOver on iOS)

### 12.3 Browser and device support

| Platform | Versions |
|---|---|
| Chrome (Android, desktop) | Last 2 |
| Safari (iOS, macOS) | Last 2 |
| Edge, Firefox | Last 2 |
| Samsung Internet | Last 2 |
| Low-end Android | Test on a ~₹10,000 device on 4G |

### 12.4 Security

- HTTPS everywhere with HSTS.
- Security headers: CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Server-side validation and rate limiting on all forms (e.g. 5 submissions/IP/10 min).
- Honeypot + optional invisible CAPTCHA (e.g. Cloudflare Turnstile — free).
- Secrets only in server environment variables.
- Dependency updates monthly.

### 12.5 Reliability and maintainability

- Uptime target 99.9% (hosting provider SLA).
- Content in JSON/MDX for easy edits.
- Component documentation in README.
- Git-based workflow on the Homeasy-Automations GitHub organisation; preview deployments for every pull request.

---

---

## 13. SEO and local SEO plan

### 13.1 Keyword clusters

| Cluster | Keywords |
|---|---|
| Brand | homeasy, homeasy patna, homeasy automation |
| Local (priority) | smart home patna, home automation patna, smart switch installation patna, home automation bihar |
| Retrofit | convert home to smart home without rewiring, retrofit smart switch module, smart module behind switch, smart home without changing switches |
| Appliance | smart geyser timer, smart fan control india, wifi switch for geyser |
| B2B | smart home for interior designers, smart flats builder patna |
| B2G | smart energy management government building |

### 13.2 Per-page metadata

| Page | Title (≤ 60) | Meta (≤ 160) |
|---|---|---|
| Home | Homeasy — Make Your Existing Home Smart Without Rewiring | Smart modules inside your existing switchbox. Control lights, fans, geyser and AC from your phone. Free home survey in Patna. |
| How it works | How Homeasy Works — Smart Retrofit Without Rewiring | See how Homeasy fits smart modules behind your existing switches. Free survey, professional installation, easy app. |
| Products | Homeasy Smart Modules for Indian Switchboxes | Smart relay, fan controller, power module and IR remote — installed inside your existing switchbox. |
| Installation | Smart Home Installation in Patna — Homeasy | Free home survey and professional installation by trained Homeasy electricians. |
| Pricing | Homeasy Packages — Smart Room to Full Smart Home | Simple smart-home packages. Exact price confirmed after a free home survey. |
| App | Homeasy App — Control Your Whole Home | Rooms, scenes, schedules and family sharing. Free for every Homeasy customer. |
| About | About Homeasy — Smart Home Retrofit Company, Patna | Homeasy Automation Pvt. Ltd. (founded 2025, Patna) makes traditional homes smart without rewiring. |
| Roadmap | Homeasy Roadmap | What we've built and what's next for Homeasy in India. |
| Investors | Homeasy for Investors | Bringing smart living to India's traditional homes. |
| FAQ | Homeasy FAQ — Smart Retrofit Questions Answered | Switches, wiring, installation, app, pricing and support. |
| Contact | Contact Homeasy — Patna | Call, WhatsApp or email Homeasy for a free home survey or partnership. |
| Careers | Careers at Homeasy | Join Homeasy and help make Indian homes smart. |

### 13.3 Local SEO (Must)

- **Google Business Profile** for Homeasy in Patna: category (e.g. home automation company), hours, phone, WhatsApp, photos of real installs, service area, posts.
- Consistent **NAP** (name, address, phone) across site, GBP, JustDial/IndiaMART/Sulekha-type listings [TBC], social profiles.
- Ask pilot customers for genuine Google reviews (no incentives that violate platform policies).
- Locality landing sections later (e.g. "Smart home in Boring Road / Kankarbagh") — Phase 2, only when actually serving those areas.

### 13.4 Technical SEO

Sitemap.xml, robots.txt, canonicals, OG/Twitter images, breadcrumbs, structured data: `Organization`, `LocalBusiness` (`HomeAndConstructionBusiness`), `Service` (installation), `FAQPage`, `Product` (only when specs/prices final), `SoftwareApplication` (when app live).

```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Homeasy Automation Private Limited",
  "alternateName": "Homeasy",
  "url": "https://homeasy.io",
  "logo": "https://homeasy.io/logo.png",
  "foundingDate": "2025",
  "identifier": { "@type": "PropertyValue", "propertyID": "CIN", "value": "[insert CIN]" },
  "telephone": "[insert phone]",
  "email": "info@homeasy.io",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[insert registered address]",
    "addressLocality": "Patna",
    "addressRegion": "Bihar",
    "postalCode": "[insert]",
    "addressCountry": "IN"
  },
  "areaServed": { "@type": "City", "name": "Patna" },
  "founder": { "@type": "Person", "name": "Vishwjeet Narayanan" },
  "sameAs": [
    "https://www.linkedin.com/company/homeasyautomationiot/",
    "https://www.facebook.com/homeasyautomation/",
    "https://instagram.com/homeasyautomation/",
    "https://youtube.com/@homeasyautomation"
  ]
}
```

---

## 14. Analytics and tracking plan

**Tools:** GA4 (consent-gated), Google Search Console, Google Business Profile insights; optional Microsoft Clarity (consent-gated).

### 14.1 Events

| Event | Trigger | Parameters |
|---|---|---|
| `cta_click` | Any CTA | `cta_id`, `page`, `section` |
| `survey_open` | Booking modal opened | `source_cta`, `page` |
| `survey_submit` (key event) | Successful booking | `source_cta`, `in_service_area`, `home_type`, `rooms`, `appliances_count` |
| `survey_out_of_area` | Booking outside area | `pincode` (first 3 digits only) |
| `survey_error` | Validation/server error | `error_type` |
| `pincode_check` | Checker used | `result` |
| `whatsapp_click` (key event) | WhatsApp link | `page`, `location` (header/sticky/float/contact) |
| `call_click` (key event) | tel: link | `page`, `location` |
| `b2b_submit` (key event) | B2B form | `type` |
| `gov_submit` (key event) | Gov form | `building_type` |
| `capability_download` | Gov PDF | — |
| `faq_expand` | FAQ item | `question_id` |
| `package_view` | Pricing card in view | `package` |
| `scroll_depth` | 25/50/75/100 | `percent`, `page` |
| `photo_check_click` (key event) | WhatsApp photo check CTA | `page`, `location` |
| `photo_upload_submit` (key event) | Photo fallback form sent | `photos_count` |
| `switch_brand_select` | Selector used | `brand` |
| `estimator_start` / `estimator_complete` | Estimator steps | `rooms_count`, `appliances_count` |
| `estimator_to_survey` (key event) | Estimator → survey booking | `est_band` |
| `report_sample_view` / `report_sample_download` | Sample report | — |
| `guarantee_view` | /guarantee opened | `source` |
| `demo_submit` (key event) | Demo booking | `demo_type` |
| `parents_cta_click` | Parents' home CTA | `page` |

### 14.2 Offline funnel (business tracking)

Website lead → contacted → survey done → quoted → won/lost, tracked via `status` in the leads table. Weekly review: lead source vs won orders, so marketing spend follows real sales.

### 14.3 UTM convention

`utm_source` (instagram, facebook, youtube, google, whatsapp, poster_qr, electrician, designer) · `utm_medium` (social, paid, referral, offline) · `utm_campaign` (patna_launch, pilot, designer_program, gov_outreach). Use QR codes with UTMs on posters, pamphlets and electrician referral cards.

---

## 15. Privacy, legal and compliance

| Area | Requirement |
|---|---|
| DPDP Act 2023 | Notice at collection, purpose limitation, consent, access/correction/erasure rights, grievance officer |
| Phone/WhatsApp contact | Explicit consent on forms; respect opt-outs |
| Consumer protection | Clear pricing (incl. GST statement), cancellation/refund terms, warranty policy before selling |
| Product compliance | BIS/WPC status confirmed with experts before any compliance claim (R2) |
| Electrical safety | Installer qualifications and SOP per local rules [verify] |
| Insurance | Product/public liability cover [TBC] |
| Trademarks | No third-party logos; "Homeasy" trademark status [confirm] |
| Legal review | Privacy, terms, warranty, cookie policy reviewed by a lawyer before go-live |

---

## 16. Technical architecture

### 16.1 Stack (low/zero cost)

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript, static generation |
| Styling | Tailwind CSS + CSS-variable design tokens |
| UI primitives | Headless accessible components (e.g. Radix) |
| Animation | Lottie/SVG for switchbox diagram; minimal Framer Motion |
| Content | JSON data files: `products.json`, `packages.json`, `service-areas.json`, `faq.json`, `roadmap.json`, `jobs.json` |
| Forms | Server actions / API routes, Zod validation, rate limiting, honeypot + Cloudflare Turnstile |
| Storage | Supabase free tier or Google Sheets [TBC] |
| Notifications | Zoho Mail SMTP; optional free webhook to founder's phone [TBC] |
| Hosting | Vercel free tier or Cloudflare Pages |
| Analytics | GA4 + Search Console (consent-gated) |
| Repo | GitHub — Homeasy-Automations organisation |

### 16.2 Project structure

```
/app
  page.tsx                      Home
  how-it-works/  products/  products/[slug]/  installation/  pricing/  app/
  solutions/  solutions/designers/  solutions/builders/
  solutions/electricians/  solutions/government/
  about/  roadmap/  investors/  careers/  faq/  contact/  book-survey/
  warranty/  privacy-policy/  terms-of-service/  cookie-policy/
  api/survey  api/b2b  api/gov  api/contact
/components  ui/  sections/  layout/  forms/
/data        products.json packages.json service-areas.json faq.json roadmap.json jobs.json
/lib         analytics.ts validation.ts db.ts notify.ts flags.ts
/public      images/ installs/ lottie/ og/ docs/capability-statement.pdf
```

### 16.3 Feature flags

| Flag | Default | Purpose |
|---|---|---|
| `SHOW_PRICES` | false | Show package prices once final |
| `SHOW_INSTALLS` | false | Real installation gallery and testimonials |
| `APP_LIVE` | **true** (founder decision 16 Nov 2026) | App presented as live; store badges appear once store links are added. Set false to restore "Coming soon" wording |
| `SHOW_ANNOUNCEMENT` | false | Enable when surveys are open |
| `SHOW_INVESTORS_PAGE` | true | Public investor page (decided) |
| `SHOW_BLOG` | false | Phase 2 |
| `SHOW_CERTIFICATIONS` | false | Only when certificates are issued |
| `SHOW_DEMO` | false | Demo page and home section |
| `USP_U1`…`USP_U12` | per USP | Show each USP only when deliverable (U1–U5 target true at commercial launch after pilot validation) |

---

## 17. Content and asset checklist

| Asset | Owner | Status |
|---|---|---|
| Final logo, palette, typography | Founder/designer | **Done.** Web logo kit (RGB SVG/PNG, favicons, app icon, social images, navy dark version) created from the brand sheet as `homeasy-logo-kit.zip`. Designer to verify against master artwork and confirm official RGB/CMYK/Pantone values |
| Switchbox cut-away illustration + animation | Designer | Needed (hero-critical) |
| Module product renders/photos | ODM/founder | Needed (after ODM selection) |
| Real installation photos/videos (before/after) | Founder (pilot) | After pilot |
| Real app screenshots | Product team | Needed |
| Package definitions and prices | Founder | Needed (after ODM quotes) |
| Service-area pincode list | Founder | Needed |
| Phone and WhatsApp Business number | Founder | Needed |
| Warranty policy | Founder + lawyer | Needed before first sale |
| Installation safety SOP summary | Founder/installation lead | Needed |
| Government capability statement PDF | Founder | Needed before B2G outreach |
| CIN, registered address, GST number | Founder | Needed |
| Founder professional photo | Founder | Needed |
| Privacy, terms, cookie policies | Founder + lawyer | Needed |
| OG images per key page | Designer | Needed |
| Posters/QR codes for offline marketing | Designer | Should |
| Readiness Report template + anonymised sample PDF | Founder/designer | Needed (U1) |
| WhatsApp reply templates (photo check, survey confirm) | Founder | Needed (U2) |
| Guarantee terms ("Same look", fixed price, service promise) | Founder + lawyer | Needed (U3–U5) |
| 30-second install + app video per product | Founder | Should |
| Estimator mapping rules and price ranges | Founder | Should (after ODM quotes) |
| Demo home setup + photos | Founder | Could |
| Parents' home visuals ("Maa-Papa's home" dashboard mock) | Designer | Should |

---

## 18. QA and testing plan

### 18.1 Test types

| Type | Scope | Tools |
|---|---|---|
| Functional | All forms, pincode checker, WhatsApp/call links, modals, flags, redirects | Manual + Playwright |
| Lead pipeline | Each form → storage → notification → confirmation | Manual end-to-end |
| Cross-device | Low-end Android on 4G, iPhone, desktop browsers | Real devices |
| Performance | Lighthouse, Core Web Vitals | Lighthouse CI, PageSpeed |
| Accessibility | WCAG 2.1 AA | axe, keyboard, TalkBack/VoiceOver |
| SEO | Metadata, schema, sitemap, GBP link | Rich Results Test, Search Console |
| Content & claims | Honesty rules R1–R12, dates, CIN/address accuracy | Founder checklist |
| Security | Headers, rate limits, spam | securityheaders.com, manual |

### 18.2 Pre-launch checklist

- [ ] No placeholder text, default metadata or fake testimonials
- [ ] No prices, specs or certifications shown unless final (flags off)
- [ ] "Incorporated 2025", CIN and address consistent everywhere
- [ ] Survey form tested with in-area and out-of-area pincodes
- [ ] WhatsApp and call links tested on Android and iPhone
- [ ] Notifications reach founder/ops instantly
- [ ] Warranty, privacy, terms pages live and reviewed
- [ ] Google Business Profile live and linked
- [ ] Lighthouse ≥ 90 mobile on Home, How it works, Pricing, Installation
- [ ] Redirects verified; 404 works
- [ ] Analytics fires only after consent

---

## 19. Release plan and timeline

Aligned with "launch sooner": the website goes live in two steps — a **quick credible version** for the pilot, then the **full site** for commercial launch.

| Phase | Scope | Duration (estimate) | Exit criteria |
|---|---|---|---|
| 0. Quick fixes (current site) | Meta description, remove testimonials and unverified claims, © 2026, "Incorporated 2025", CIN/address | 1–2 days | Live |
| 1. Brand | Final logo and palette | 1–2 weeks (parallel) | Sign-off |
| 2. Pilot site (MVP) | Home, How it works, Book survey, About, Contact, FAQ, legal; WhatsApp + sticky bar; pincode checker; **WhatsApp photo check (U2)**; switch-brand selector; Readiness Report given to pilot customers (U1, page optional) | 2–3 weeks | Accepting pilot survey requests |
| 3. Pilot period | Collect real photos, videos, testimonials, FAQs, install times | During pilot | Real content available |
| 4. Full site | Products, Installation, Pricing, App, Solutions (4 pages), Roadmap, Investors, Careers, Warranty; **/guarantee with pilot-proven U3–U5 terms**, sample Readiness Report page, estimator, parents' home section, demo page (if ready) | 2–3 weeks | QA passed; USP flags set only for proven promises |
| 5. Commercial launch | Flags on (prices, installs, announcement), GBP posts, local marketing | 1 day | Live |
| 6. AWS move + app go-live | When AWS credits are granted: move the website from Vercel to AWS, host the app backend there, add store badges/links | When credits arrive | App downloadable; site on AWS |
| 7. Phase 2 | Hindi, blog, customer portal, locality pages, more cities | Post-launch | — |


## 20. Roles and responsibilities (RACI)

| Activity | Founder (Vishwjeet) | Claude | Designer [TBC] | Developer [TBC] | Lawyer |
|---|---|---|---|---|---|
| Installation SOP & safety content | A/R | C | — | I | C |
| Positioning & copy approval | A/R | C (drafts) | I | I | — |
| Brand identity | A | C | R | I | — |
| Wireframes & UI design | A | C | R | C | — |
| Development | A | C (code support) | C | R | — |
| Brand/feature data | A/R | C | — | I | — |
| Legal pages | A | C (first draft) | — | I | R |
| QA | A | C (checklists) | C | R | — |
| Launch & promotion | A/R | C | C | C | — |

R = Responsible, A = Accountable, C = Consulted, I = Informed

---

---

## 21. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Website promises before modules are ready/certified | Medium | High | Honesty rules; "Coming soon" badges; flags for prices/specs/certifications |
| Survey demand exceeds installer capacity | Medium | Medium | Limit service area via pincode list; booking slots; waitlist for out-of-area |
| Leads not followed up quickly | Medium | High | Instant notifications; SLA; status pipeline reviewed daily |
| Unsuitable switchboxes (depth, no neutral) | High | Medium | Survey-first messaging (R5); honest suitability note |
| Low trust (new brand) | High | High | Real install content after pilot; founder visibility; local address and phone; warranty page |
| Firmware decision delays app/site content | Medium | Medium | Keep internet/local-control copy behind [TBC]; update after decision |
| Price uncertainty | High | Medium | `SHOW_PRICES=false` until ODM quotes and pilot costs are known |
| Government claims misread as credentials | Low | High | R8; only confirmed registrations |
| Zero budget limits tools | High | Low | Free tiers throughout |

---

## 22. Open questions and decisions log

### 22.1 Open questions

| # | Question | Owner | Blocks |
|---|---|---|---|
| Q1 | Firmware platform: Tuya ODM, own ESP32 firmware, or hybrid (business plan D1) | Founder | App/offline copy, products page |
| Q2 | MVP module line-up and names | Founder + ODM | Products, "what you can control" |
| Q3 | Package contents and prices; GST and payment terms | Founder | Pricing (`SHOW_PRICES`) |
| Q4 | Warranty term and coverage | Founder | **Resolved — 3 years**; workmanship period and exclusions to confirm |
| Q5 | Hindi earlier than Phase 2? (traditional-home audience may prefer Hindi) | Founder | Phase plan |
| Q6 | Service area pincodes for pilot | Founder | Pincode checker |
| Q7 | Phone and WhatsApp Business numbers | Founder | All CTAs |
| Q8 | Typical installation time per room | Pilot data | Copy |
| Q9 | Electrician partner model (employee vs contractor; payout) | Founder | Electricians page |
| Q10 | Designer trade pricing and commission | Founder | Designers page |
| Q11 | Confirmed registrations (GST, DPIIT, GeM, trademark) | Founder | Government page, About |
| Q12 | Lead storage: Supabase vs Google Sheets | Founder/dev | Build |
| Q13 | Free app policy for non-customers (keep 5-device free plan?) | Founder | App page |
| Q14 | Pilot dates and commercial launch target | Founder | Release plan |
| Q15 | Guarantee terms and exclusions for "Same look" (U3) | Founder + lawyer | **Drafted (8.20.1)** — lawyer review pending |
| Q16 | Service promise time limit and coverage area (U5) | Founder | **Resolved — 24 hours**; coverage area and missed-visit remedy to confirm |
| Q17 | WhatsApp reply time and working hours (U2) | Founder | **Resolved — 30 minutes**; working hours to confirm |
| Q18 | Warranty length | Founder + ODM | **Resolved — 3 years**; confirm ODM supplier warranty matches |
| Q19 | Feasibility of inverter-aware automation (U7) | Product/firmware | Roadmap, 7C |
| Q20 | Parents' home: multi-home access at launch? Inactivity alert timeline (U6) | Product | 7B |
| Q21 | Hindi website at launch (needed for U8 and traditional-home audience)? | Founder | Release plan |
| Q22 | Care plan and "Moves with you" pricing (U10, U11) | Founder | Phase 2 |
| Q23 | Demo home location and availability (U12) | Founder | /demo |

### 22.2 Decisions log

| Date | Decision |
|---|---|
| Oct 2026 | Redesign logo and palette before website |
| 15 Nov 2026 | Tagline "One App. Every Device. Easy." |
| 15 Nov 2026 | Investor page public; founder only on About; CIN and address shown; Hindi in Phase 2 |
| 15 Nov 2026 | **Retrofit-first model**: target traditional homes; Homeasy modules installed inside existing switchboxes |
| 15 Nov 2026 | Own Homeasy devices in Phase 1; smaller MVP; launch sooner |
| 15 Nov 2026 | India only; Patna pilot first |
| 15 Nov 2026 | Paid installation from day one; B2B (designers, builders, electricians) and B2G channels; hardware sold early |
| 15 Nov 2026 | Website primary CTA = "Book a free home survey"; WhatsApp as primary mobile channel |
| 15 Nov 2026 | Third-party brand logo wall and compatibility page removed; 5-device free plan not shown |
| 15 Nov 2026 | Lead USPs adopted for website: Readiness Report, WhatsApp photo check, "Same look" guarantee, fixed price incl. installation, local service promise; Parents' home control as emotional story |
| 15 Nov 2026 | Competitor-borrowed features adopted (Section 5.8) |
| 15 Nov 2026 | Service visit within 24 hours (Patna); WhatsApp reply within 30 minutes; 3-year warranty |
| 15 Nov 2026 | "Same look" guarantee exclusions drafted for lawyer review |
| 16 Nov 2026 | Logo finalised: H Switch Plate icon + "homeasy" in Chillax Bold with amber "o" |
| 16 Nov 2026 | ~~Chillax + Satoshi; Charcoal/Mist palette~~ superseded by v3.5 entries below |
| 16 Nov 2026 | ~~Amber CTA with charcoal text~~ superseded (v3.5) |
| 16 Nov 2026 | Final palette: Deep Navy `#0B1220`, Homeasy Blue `#3A9ADB`, Switch Amber `#F9B445`, White, Cloud `#F5F8FC`, Border `#E5EAF0`, Slate `#667085`; primary CTA = blue with navy text |
| 16 Nov 2026 | Visual direction: light-first, flat, geometric; only effect = hero flip-the-switch amber light |
| 16 Nov 2026 | Final logo version confirmed: previous sheet (blue `#3A9ADB`, slimmer rockers). Cyan `#01B6FD` alternative sheet rejected |
| 16 Nov 2026 | Typography: Chillax throughout; Satoshi fallback for long-form pages after readability test; Hind for Hindi |
| 16 Nov 2026 | Homepage hero: H1 "Same switch. Smarter home." (flip-the-switch) with the retrofit promise directly below |
| 16 Nov 2026 | Hero layout revised: desktop = full-bleed interactive 3D room (prototype "3D hero" style) with real CC0 models/textures, clickable devices and an app-preview bar; phones = light page with the 2D room. The §30 3D hero is now in launch scope (desktop only, loaded after LCP) |
| 16 Nov 2026 | Dark mode dropped for launch (F15 and §9 "Theme" removed; light-first only) |
| 16 Nov 2026 | Q12 resolved: Supabase for leads + login-protected `/admin` dashboard (modelled on the Kynyx admin) |
| 16 Nov 2026 | Hosting: Vercel free tier initially, moving to AWS when credits are granted |
| 16 Nov 2026 | Tagline kept as brand line; never used as a multi-brand feature claim |
| 16 Nov 2026 | **Launch sequence:** website goes live first (Vercel). When AWS credits are granted, the website moves to AWS hosting and the Homeasy app goes live on AWS at the same time |
| 16 Nov 2026 | **"Live" wording (founder decision, amends R1):** the website presents the core offering as live from day one: the Homeasy app (`APP_LIVE` default = true) and the four core modules (Smart Relay, Fan Controller, Power Module, IR Remote) carry no "Coming soon" label. Future items stay "Planned": voice assistants, energy insights, Hindi mode, other brands in the app, parents' home alerts, inverter-aware automation, No-Neutral Module, Smart Plug, Care plan. Guarantee promises (U1–U5) stay behind `USP_*` flags. Store download buttons are added when the store links exist |
| 16 Nov 2026 | Homepage trimmed: "From survey to support", "Parents' home" and "Made for Indian homes" hidden via switches in `data/home.json`; sixth card "Your switches keep working" added to the promise section; scroll-reveal and hover motion added (movement and colour only) |
| 16 Nov 2026 | Q6/Q7/Q17 facts: phone + WhatsApp +91 91173 79099; working hours 9 am–9 pm every day; survey service area = all of Bihar; form success promise "within 2 working hours"; CIN U74909BR2025PTC073219; registered office B Hub, Mauryalok Complex, A Block, Patna, Bihar 800001 |

---

## 23. Competitor references (Indian retrofit market)

| # | Competitor | Positioning seen on website/listings | Borrowed (5.8) | Gap Homeasy fills |
|---|---|---|---|---|
| 1 | Tata Power EZ Home | Big brand; retrofit convertors (fan, 30A AC/geyser, dimmer, curtain); channel partners and experience centres; largely DIY | Appliance-based range; start-small message | Done-for-you install, Readiness Report, guarantees |
| 2 | Wozart (Hyderabad) | Retrofit since 2018; DIY; 3-year replacement warranty; HomeKit | Warranty headline | Professional install, local service |
| 3 | Smarteefi | Made in India; spec-rich product pages; fits 2M+ boxes | Spec card | Service and suitability check |
| 4 | AZIOT | Low-price D2C; 1–8 node; demo videos; guides | Videos, educational content | Installed, guaranteed, supported |
| 5 | SmartNode | Wireless retrofit + touch; names switch brands it fits | Switch-brand selector | Fixed price incl. installation |
| 6 | Switchy | Made in India, tested in-house; broad range | Tested-in-house story | Survey + guarantee |
| 7 | Sochiot / Jarwis (Noida) | "Any switchboard"; surge protection; offline claims | "Old house" reassurance | Written guarantees, local service |
| 8 | Hogar Controls | Premium, design-led, consultative | Premium visuals, consultation | Affordable retrofit packages |
| 9 | Oakter | Affordable, modular, build-your-own | Estimator | In-box retrofit + installation |
| 10 | Iotics | In-wall modules installed by electrician; retrofit explainer | Explainer FAQ | Accountable Homeasy installers |
| — | Revolve (AIT) | Zigbee retrofit; 5-year replacement warranty | Warranty benchmark | — |
| — | Generic online modules | Very cheap, no service | — | Everything around the module |

*Competitor details are based on their websites and listings as reviewed in Nov 2026 and may change; re-check before publishing comparisons. Never name competitors negatively on the Homeasy website.*

---

## 24. Appendix: glossary

| Term | Meaning |
|---|---|
| Traditional home | A home with ordinary switches and appliances, no smart devices |
| Retrofit | Adding smart capability to an existing installation without replacing it |
| Switchbox | The box in the wall behind a switchboard |
| Retrofit module | Small smart device installed inside the switchbox, connected to existing switches |
| Neutral wire | A wire many smart modules need for constant power; not present at the switch in some older homes |
| No-neutral module | A module designed to work without a neutral wire |
| Relay module | Switches lights/appliances on and off electronically |
| IR remote/blaster | Sends infrared signals to control ACs and TVs |
| ODM | Original design manufacturer — makes hardware that Homeasy brands as its own |
| Firmware | Software running inside the module |
| OTA | Over-the-air firmware updates |
| BIS | Bureau of Indian Standards certification |
| WPC / ETA | Wireless equipment approval in India |
| GeM | Government e-Marketplace (public procurement portal) |
| DPIIT | Startup recognition by India's Department for Promotion of Industry and Internal Trade |
| B2B / B2G | Business-to-business / business-to-government |
| AMC | Annual maintenance contract |
| DPDP Act | Digital Personal Data Protection Act, 2023 |
| NAP | Name, address, phone — consistency matters for local SEO |

## 25. Wireframes (mobile-first)

Wireframes are low-fidelity layouts at **mobile width (360–390 px)**, the main device for Homeasy's audience. Desktop notes follow each one. Copy for every block is in Section 26 (and Section 8 for the homepage). Labels in `[brackets]` are components from Section 6.8 / Section 9.

### 25.1 Global elements

```
┌──────────────────────────────────┐
│ [Announcement bar — optional]  ✕ │
├──────────────────────────────────┤
│ [Logo]          [Book survey] [☰]│  ← sticky header (56 px)
└──────────────────────────────────┘

  ... page content ...

┌──────────────────────────────────┐
│ [💬 WhatsApp] [📞 Call] [Book ▶] │  ← sticky mobile action bar (64 px)
└──────────────────────────────────┘
```

**Mobile drawer (☰):**
```
┌──────────────────────────────────┐
│ [Logo]                        ✕  │
│ How it works                     │
│ Products                         │
│ Installation                     │
│ Pricing                          │
│ Solutions                     ▾  │
│   Interior designers             │
│   Builders & commercial          │
│   Electricians                   │
│   Government & institutions      │
│ Homeasy app                      │
│ About · Roadmap · Investors      │
│ FAQ · Contact                    │
│ ──────────────────────────────── │
│ [Book a free home survey]        │
│ [📷 Send switchboard photo]      │
│ in  ◎  f  ▶                      │
└──────────────────────────────────┘
```

**Footer (mobile, stacked accordions):**
```
┌──────────────────────────────────┐
│ [Logo]                           │
│ One App. Every Device. Easy.     │
│ ▸ Homes                          │
│ ▸ Business                       │
│ ▸ Company                        │
│ ▸ Help & legal                   │
│ 📞 [phone]  💬 [WhatsApp]  ✉ info│
│ in  ◎  f  ▶                      │
│ © 2026 Homeasy Automation Pvt Ltd│
│ CIN [ ] · Incorporated 2025      │
│ Regd. office: [address], Patna   │
└──────────────────────────────────┘
```
*Desktop:* header shows full nav + Solutions dropdown + WhatsApp icon + primary button; floating WhatsApp button bottom-right replaces sticky bar; footer in 4 columns.

### 25.2 Home (`/`)

```
┌──────────────────────────────────┐
│ ONE APP. EVERY DEVICE. EASY.     │  tagline (small caps)
│ Make your existing home smart —  │  H1
│ without changing your switches.  │
│ Subheadline (2–3 lines)          │
│ [Book a free home survey ▶]      │  primary, full width
│ [📷 Send switchboard photo]      │  secondary, outline
│ Free survey · Trained · Patna    │  microcopy
│ ┌──────────────────────────────┐ │
│ │ [Switchboard cut-away anim.] │ │  hero visual (16:10)
│ └──────────────────────────────┘ │
│ ✓Same look ✓Fixed price ✓3-yr ✓24h│  trust chips (scroll-x)
├──────────────────────────────────┤
│ H2 Smart homes shouldn't mean    │  S3 problem
│ breaking walls.                  │
│ [card] New switchboards  ✗       │
│ [card] DIY modules       ✗       │
│ [card] Homeasy retrofit  ✓       │  highlighted
├──────────────────────────────────┤
│ H2 How Homeasy works             │  S4
│ ① Open box ② Fit module          │  step illustrations
│ ③ Close up ④ Control from app    │  (2×2 grid)
│ See the full process →           │
├──────────────────────────────────┤
│ H2 What you can make smart       │  S5
│ [💡][🌀][🚿]                       │  3×2 icon tiles + badges
│ [❄️][💧][🌙]                       │
├──────────────────────────────────┤
│ H2 Our process                   │  S6 vertical timeline
│ ● Free survey                    │
│ ● Clear quote                    │
│ ● Installation                   │
│ ● App setup                      │
│ ● Support & warranty             │
│ [Book a free home survey ▶]      │
├──────────────────────────────────┤
│ H2 The Homeasy promise           │  S7 lead USPs
│ [U1 Readiness Report      →]     │  stacked cards
│ [U2 WhatsApp photo check  →]     │
│ [U3 "Same look" guarantee →]     │
│ [U4 Fixed price           →]     │
│ [U5 24-hour service       →]     │
├──────────────────────────────────┤
│ H3 Which switches do you have?   │  S7A selector
│ (Anchor)(Legrand)(Schneider)     │  chips
│ (Havells)(Roma)(GM)(Other)       │
│ → result message + [Book] [📷]   │
├──────────────────────────────────┤
│ H2 Far from home? Look after     │  S7B parents
│ your parents' home.              │
│ [phone: "Maa-Papa's home"]       │
│ [Book survey for parents' home]  │
├──────────────────────────────────┤
│ H2 Made for Indian homes         │  S7C product USPs
│ [Routines][Inverter][Hindi]      │  scroll-x cards + badges
├──────────────────────────────────┤
│ H2 Packages                      │  S8
│ [Smart Room] [Essentials] [Full] │  scroll-x cards
│ Exact price after free survey    │
├──────────────────────────────────┤
│ H2 One easy app                  │  S9
│ [3 phone screenshots carousel]   │
│ Coming soon on Android & iOS     │
├──────────────────────────────────┤
│ [Real installs gallery]          │  S10 (flag)
├──────────────────────────────────┤
│ H2 For businesses & government   │  S11 2×2 cards
├──────────────────────────────────┤
│ H2 Now serving Patna             │  S12
│ [Pincode ______] [Check]         │
├──────────────────────────────────┤
│ [Founder photo] quote            │  S13
├──────────────────────────────────┤
│ H2 FAQ  ▸ ▸ ▸ ▸ ▸ ▸              │  S14 accordion
├──────────────────────────────────┤
│ ███ Ready to make your home ███  │  S15 gradient band
│ [Book survey] [💬 WhatsApp]      │
└──────────────────────────────────┘
```
*Desktop:* hero two columns (text 6 cols / visual 6 cols); problem cards 3 across; steps 4 across; USP cards 5 across or 3+2; packages 3 across; solutions 4 across.

### 25.3 How it works (`/how-it-works`)

```
┌──────────────────────────────────┐
│ H1 How Homeasy makes your home   │
│ smart · sub                      │
├──────────────────────────────────┤
│ [Large switchbox diagram]        │  front → cut-away → Wi-Fi → app
│ caption                          │
├──────────────────────────────────┤
│ [Before | After slider]          │  same switchboard
├──────────────────────────────────┤
│ Stays the same | What changes    │  two lists (stacked on mobile)
├──────────────────────────────────┤
│ 5-step process (timeline)        │
├──────────────────────────────────┤
│ What we check in the survey      │  icon checklist (5)
├──────────────────────────────────┤
│ ℹ Honest suitability note        │  info callout
├──────────────────────────────────┤
│ Internet & power cuts            │  2 cards
├──────────────────────────────────┤
│ Old house? (reassurance block)   │
├──────────────────────────────────┤
│ FAQ (4)                          │
│ [Book survey] [📷 Send photo]    │
└──────────────────────────────────┘
```

### 25.4 Products (`/products`) and product detail

```
/products                               /products/[slug]
┌──────────────────────────────┐        ┌──────────────────────────────┐
│ H1 Homeasy smart modules     │        │ ‹ All products               │
│ sub                          │        │ [Product render 1:1]         │
├──────────────────────────────┤        │ Name · [Coming soon]         │
│ Filter: (All)(Lights)(Fans)  │        │ One-line purpose             │
│ (Heavy loads)(AC/TV)         │        │ [Book survey] [📷 Photo]     │
├──────────────────────────────┤        ├──────────────────────────────┤
│ ┌────────┐ ┌────────┐        │        │ What it controls (icons)     │
│ │render  │ │render  │        │        ├──────────────────────────────┤
│ │Name    │ │Name    │        │        │ [▶ 30-sec install video]     │
│ │controls│ │controls│        │        ├──────────────────────────────┤
│ │[badge] │ │[badge] │        │        │ Spec card (table)            │
│ └────────┘ └────────┘        │        │ Load · Voltage · Wi-Fi ·     │
│ ... (2-col grid)             │        │ Channels · 2-way · Size ·    │
├──────────────────────────────┤        │ Box fit · Warranty 3 yrs     │
│ ℹ Installed by Homeasy after │        ├──────────────────────────────┤
│   a free survey              │        │ Where it's used (rooms)      │
│ ℹ Specs published after      │        ├──────────────────────────────┤
│   certification & testing    │        │ Certifications (flag)        │
│ [Book a free home survey]    │        │ In the box · FAQs            │
└──────────────────────────────┘        └──────────────────────────────┘
```

### 25.5 Installation (`/installation`)

```
┌──────────────────────────────────┐
│ H1 Professional installation,    │
│ done right · sub · [Book]        │
├──────────────────────────────────┤
│ Process timeline (5 steps, each  │
│ with "who comes" + "how long")   │
├──────────────────────────────────┤
│ Survey checklist (icons)         │
├──────────────────────────────────┤
│ 🛡 Safety promise (6 checks)      │
├──────────────────────────────────┤
│ What you need to do (3 items)    │
├──────────────────────────────────┤
│ Service levels strip:            │
│ [30 min reply][24 h visit][3 yrs]│
│ → Guarantee terms                │
├──────────────────────────────────┤
│ Service area: [Pincode][Check]   │
│ List of covered localities       │
├──────────────────────────────────┤
│ [Book a free home survey]        │
└──────────────────────────────────┘
```

### 25.6 Pricing (`/pricing`)

```
┌──────────────────────────────────┐
│ H1 Simple packages. Exact price  │
│ after a free survey.             │
├──────────────────────────────────┤
│ ┌Smart Room───────────────────┐  │  stacked cards (mobile)
│ │ for · includes ✓✓✓          │  │  "Most popular" ribbon on
│ │ From ₹[ ] / Price after     │  │   Essentials [TBC]
│ │ survey   [Book survey]      │  │
│ └─────────────────────────────┘  │
│ ┌Smart Essentials─────────────┐  │
│ └─────────────────────────────┘  │
│ ┌Full Smart Home──────────────┐  │
│ └─────────────────────────────┘  │
├──────────────────────────────────┤
│ Every package includes (icons)   │
├──────────────────────────────────┤
│ Add-ons table                    │
├──────────────────────────────────┤
│ [Try the cost estimator →]       │
├──────────────────────────────────┤
│ Why survey first · Payment terms │
│ FAQ (4)                          │
└──────────────────────────────────┘
```

### 25.7 App (`/app`)

```
┌──────────────────────────────────┐
│ H1 One easy app for your whole   │
│ home · Free for every customer   │
│ [phone hero screenshot]          │
│ [Coming soon ▸ store badges flag]│
├──────────────────────────────────┤
│ Feature rows (icon + text +      │
│ screenshot), alternating         │
├──────────────────────────────────┤
│ Coming soon (badged list)        │
├──────────────────────────────────┤
│ Parents' home mode (U6)          │
├──────────────────────────────────┤
│ Privacy note · [Book survey]     │
└──────────────────────────────────┘
```

### 25.8 Solutions hub and solution page template

```
/solutions                          /solutions/[segment] (template)
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ H1 Homeasy for business      │    │ H1 segment headline          │
│ sub                          │    │ sub · [Enquire ▶]            │
├──────────────────────────────┤    │ [segment photo]              │
│ [Designers      →]           │    ├──────────────────────────────┤
│ [Builders       →]           │    │ Use cases (icon grid)        │
│ [Electricians   →]           │    ├──────────────────────────────┤
│ [Government     →]           │    │ Benefits (4 cards)           │
├──────────────────────────────┤    ├──────────────────────────────┤
│ Not sure? [Contact us]       │    │ How we work with you (steps) │
└──────────────────────────────┘    ├──────────────────────────────┤
                                    │ Segment-specific block       │
                                    │ (trade pricing / BOQ /       │
                                    │ earnings / credentials)      │
                                    ├──────────────────────────────┤
                                    │ FAQ (3–4)                    │
                                    ├──────────────────────────────┤
                                    │ [Enquiry form inline]        │
                                    └──────────────────────────────┘
```
Government page adds: **Company credentials card** (legal name, CIN, incorporation 2025, address, GST, confirmed registrations) and **[Download capability statement PDF]** button above the form.

### 25.9 About, Roadmap, Investors

```
/about                           /roadmap                        /investors
┌────────────────────────┐       ┌────────────────────────┐      ┌────────────────────────┐
│ H1 + sub               │       │ H1 + disclaimer        │      │ H1 + sub               │
├────────────────────────┤       ├────────────────────────┤      ├────────────────────────┤
│ Story (2 paras)        │       │ ● 2025 Done            │      │ Problem | Solution     │
├────────────────────────┤       │ │                      │      ├────────────────────────┤
│ Mission | Vision       │       │ ● Nov 2026 Done        │      │ Model (3 streams)      │
├────────────────────────┤       │ │                      │      ├────────────────────────┤
│ Values (5 icons)       │       │ ● Next In progress     │      │ Market · Stage         │
├────────────────────────┤       │ │                      │      ├────────────────────────┤
│ [Founder photo] bio    │       │ ● Then Planned         │      │ Founder card           │
├────────────────────────┤       │ │                      │      ├────────────────────────┤
│ Company facts box      │       │ ● Later Planned        │      │ [One-pager PDF]        │
├────────────────────────┤       ├────────────────────────┤      │ [Contact the founder]  │
│ [Book] [Partner]       │       │ [Book survey]          │      └────────────────────────┘
└────────────────────────┘       └────────────────────────┘
```

### 25.10 FAQ, Contact, Careers

```
/faq                             /contact                        /careers
┌────────────────────────┐       ┌────────────────────────┐      ┌────────────────────────┐
│ H1 + [Search FAQs  🔍] │       │ H1 + sub               │      │ H1 + sub               │
├────────────────────────┤       ├────────────────────────┤      ├────────────────────────┤
│ Tabs: Basics · Install │       │ [💬][📞][✉] big tiles  │      │ Why Homeasy (3)        │
│ · App · Pricing ·      │       ├────────────────────────┤      ├────────────────────────┤
│ Business               │       │ Contact form           │      │ Open roles list        │
├────────────────────────┤       ├────────────────────────┤      │ or empty state         │
│ ▸ Q  ▸ Q  ▸ Q ...      │       │ Office hours · address │      ├────────────────────────┤
├────────────────────────┤       │ [static map]           │      │ [Send your profile]    │
│ Still unsure? [💬][Book]│      └────────────────────────┘      └────────────────────────┘
└────────────────────────┘
```

### 25.11 Book a survey (modal, 2 steps)

```
Step 1 — About you                 Step 2 — Your home                 Success
┌──────────────────────────┐       ┌──────────────────────────┐       ┌──────────────────────────┐
│ Book your free survey  ✕ │       │ ‹ Back            ✕      │       │ ✅ Survey request         │
│ ● ○                      │       │ ○ ●                      │       │ received!                │
│ Name      [__________]   │       │ Home type (chips)        │       │ We'll WhatsApp/call you  │
│ Mobile +91[__________]   │       │ Rooms (chips)            │       │ within [TBC].            │
│ ☑ Same number on WhatsApp│       │ Control: (💡)(🌀)(🚿)(❄️)  │       │ Your request no. HE-1234 │
│ Pincode   [______]       │       │ Switch brand (select)    │       │ [💬 WhatsApp us now]     │
│ ✓ We serve your area     │       │ Date [____] Slot (chips) │       │ [Back to home]           │
│ Locality  [__________]   │       │ Heard from (select)      │       └──────────────────────────┘
│ [Next ▶]                 │       │ ☐ Consent text           │
└──────────────────────────┘       │ [Book free survey ▶]     │       Out-of-area variant:
                                   └──────────────────────────┘       "Not in your area yet —
                                                                      we'll notify you."
```
Step 1 alone creates a lead (saved on "Next") so partially completed bookings can be followed up.

### 25.12 Estimator, Demo, Guarantee, Readiness Report

```
/estimator (stepper)             /demo                     /guarantee                 /readiness-report
┌──────────────────────┐         ┌──────────────────┐      ┌──────────────────┐       ┌──────────────────┐
│ ① Home ② Rooms ③ App │         │ H1 See it first  │      │ H1 The Homeasy   │       │ H1 What you get  │
│ ④ Result             │         ├──────────────────┤      │ promise. In      │       │ after survey     │
├──────────────────────┤         │ [Visit demo home]│      │ writing.         │       ├──────────────────┤
│ Rooms: Bedroom [−2+] │         │ [Video demo]     │      ├──────────────────┤       │ [Sample report   │
│ Living [−1+] ...     │         ├──────────────────┤      │ [Same look]   ▸  │       │  page previews]  │
├──────────────────────┤         │ Form (4 fields)  │      │ [Fixed price] ▸  │       │ ‹ 1 2 3 4 ›      │
│ Per room appliances  │         └──────────────────┘      │ [24 h service]▸  │       ├──────────────────┤
├──────────────────────┤                                   │ [30 min reply]▸  │       │ What's inside    │
│ Result: modules list │                                   │ [3-yr warranty]▸ │       │ (6 items)        │
│ ₹[min]–₹[max] (flag) │                                   │ each: promise /  │       ├──────────────────┤
│ [Book survey with    │                                   │ covered / not /  │       │ [Download PDF]   │
│  these details]      │                                   │ how to claim     │       │ [Get yours free] │
└──────────────────────┘                                   └──────────────────┘       └──────────────────┘
```

### 25.13 404

```
┌──────────────────────────────────┐
│ [Illustration: unplugged switch] │
│ H1 This page isn't wired up.     │
│ [Go home]  [Book a free survey]  │
└──────────────────────────────────┘
```


---

## 26. Full page copy (all pages except Home)

Home copy is in Section 8.1. Copy below is **draft, ready to design with**. Placeholders: `[TBC]` = decision pending, `[insert]` = factual value to add. Honesty rules (5.5) apply; any line tied to a flag is marked.

### 26.1 How it works (`/how-it-works`)

**Hero**
- H1: How Homeasy makes your home smart
- Sub: Small modules, inside your existing switchbox. Same switches. Smarter home.
- CTA: Book a free home survey · 📷 Send a switchboard photo

**Retrofit explained**
- H2: The smart part hides behind your switch.
- Body: Every switchboard has a box in the wall behind it. Homeasy fits a compact smart module inside that box and connects it to your existing switches. Nothing changes on the outside — but now your lights, fans and appliances can also be controlled from your phone.
- Diagram labels: ① Your switchboard ② The switchbox in the wall ③ Homeasy module ④ Your Wi-Fi ⑤ Homeasy app

**Before / after**
- H2: Spot the difference. (There isn't one.)
- Caption: Left: before installation. Right: after. Same switches, same look — now smart.

**What stays / what changes**
| What stays the same | What you gain |
|---|---|
| Your switchboard and its design | Control from your phone, anywhere |
| Your switches — they still work by hand | Schedules (geyser at 6 am, lights at sunset) |
| Your wiring | One-tap scenes like "Good night" |
| Your walls — no breaking, no chasing | Family sharing |
| | Voice control and energy insights (coming soon) |

**Process**
1. **Free home survey** — Our technician visits, opens a few switchboxes, and checks wiring and loads. About 30–45 minutes [TBC].
2. **Readiness Report & fixed quote** — You get photos, findings and one clear price on WhatsApp.
3. **Installation** — Trained Homeasy electricians install everything, usually in [TBC] hours.
4. **App setup** — We set up rooms, scenes and family access, and show you how it works.
5. **Support** — WhatsApp reply within 30 minutes (working hours). Technician within 24 hours in Patna.

**What we check in the survey**
- Switchbox depth — is there room for a module?
- Neutral wire — some modules need it; we check every box.
- Appliance loads — fans, geysers, ACs and motors need the right module.
- Wi-Fi signal — in every room you want to control.
- Wiring condition — any safety issues are reported to you first.

**Honest suitability note (info callout)**
> Most homes are suitable. Some older switchboxes or wiring need a small fix first. Your survey tells you exactly what's possible — before you pay anything.

**Internet & power cuts**
- Card 1 — **No internet?** Your switches work exactly as before. App control needs Wi-Fi [local control: TBC per firmware].
- Card 2 — **Power cut?** When power returns, your switches work as normal. [Power-on state behaviour: TBC per firmware.]

**Old house? (reassurance block)**
- H3: Living in an older home?
- Body: Many Patna homes have switchboards that are 10, 20 or even 30 years old. That's exactly what we're built for. If something needs attention, your Readiness Report will show it with photos — no surprises.

**FAQ (4)**
- What's a neutral wire? — One of the wires in your switchbox that many smart modules need. We check it during the survey.
- Will it damage my wiring? — No. Our electricians connect to your existing wiring following a safety checklist, and the "Same look" guarantee covers our work.
- Can I do this in a rented home? — Usually yes, because nothing visible changes. Check with your landlord first.
- Can I add more rooms later? — Yes, anytime. Most families start with one or two rooms.

**Final CTA:** Ready to see what's possible in your home? [Book a free home survey]

---

### 26.2 Products (`/products`)

**Hero**
- H1: Homeasy smart modules
- Sub: Designed to fit inside Indian switchboxes and make everyday appliances smart.
- Filter chips: All · Lights · Fans · Heavy loads · AC & TV · Coming later

**Product cards** (names are working names [TBC]; all badges "Coming soon" until launch)

| Product | Card headline | Card line |
|---|---|---|
| Homeasy Smart Relay (2/4-ch) | Lights and small appliances | Make 2 or 4 switches smart from one compact module. |
| Homeasy Fan Controller | Fans, with speed control | Turn fans on/off and change speed from the app — the regulator-free way. |
| Homeasy Power Module (16A) | Geyser, AC, water motor | Built for heavy loads. Schedule your geyser and never leave it on again. |
| Homeasy IR Remote | AC and TV | Control any AC or TV with an infrared remote — no wiring at all. |
| Homeasy No-Neutral Module | Older homes | For switchboxes without a neutral wire. *(Planned)* |
| Homeasy Smart Plug | Plug-in appliances | Make any plug point smart in seconds. *(Planned)* |

**Info strip**
- 🔧 All Homeasy modules are installed by our trained electricians after a free survey.
- 🛡 3-year warranty on every Homeasy module.
- 📋 Full specifications will be published once certification and testing are complete.

**CTA:** Not sure which modules you need? That's what the free survey is for. [Book a free home survey]

**Product detail template (`/products/[slug]`)**
- Breadcrumb: ‹ All products
- H1: [Product name] · Badge
- Sub: [One-line purpose]
- CTAs: Book a free survey · 📷 Send switchboard photo
- "What it controls" (icon row)
- Video caption: "See it installed in 30 seconds."
- Spec card heading: "Specifications" — rows: Load rating · Voltage · Wi-Fi · Channels · 2-way switching · Dimensions · Fits boxes · Warranty (3 years) *(values only after datasheet + testing)*
- "Where it's used": Bedroom · Living room · Kitchen · Bathroom · Outdoor
- Certifications block *(flag `SHOW_CERTIFICATIONS`)*
- In the box: Module · Mounting accessories [TBC] · Installation by Homeasy
- FAQ (3, product-specific)

---

### 26.3 Installation (`/installation`)

**Hero**
- H1: Professional installation, done right.
- Sub: From free survey to app setup — our trained electricians handle everything, and our promises are in writing.
- CTA: Book a free home survey

**Process timeline (with who/how long)**
| Step | What happens | Who | How long |
|---|---|---|---|
| Survey | Switchbox, wiring, load and Wi-Fi checks | Homeasy technician | 30–45 min [TBC] |
| Report & quote | Photos, findings, fixed price on WhatsApp | Homeasy team | Within [TBC] hours of survey |
| Installation | Modules fitted, switchboards closed, everything tested | 1–2 Homeasy electricians | [TBC] hours |
| App setup | Rooms, scenes, schedules, family accounts | Technician | 20–30 min [TBC] |
| Handover | Before/after photos shared, warranty activated | Technician | 5 min |

**Safety promise (🛡)**
- H2: Safety on every job. No shortcuts.
- Main power off before any work.
- Load checked for every appliance before choosing a module.
- Every connection tightened, insulated and checked.
- Every switch tested by hand and from the app before we leave.
- Photos of every switchbox, before and after.
- Any wiring problem we find is reported to you — never hidden. *(Final list from installation SOP.)*

**What you need to do**
- Be at home (or have someone there) during the visit.
- Keep your Wi-Fi name and password handy.
- Tell us which rooms and appliances matter most.

**Service levels strip**
- **30 min** — WhatsApp reply (working hours)
- **24 hours** — technician visit in Patna
- **3 years** — module warranty
- Link: Read our promises in full →

**Service area**
- H2: Now serving Patna
- Body: Enter your pincode to check. Not covered yet? Leave your details and we'll tell you when we arrive.
- Covered localities: [insert list]

---

### 26.4 Pricing (`/pricing`)

**Hero**
- H1: Simple packages. Exact price after a free survey.
- Sub: One fixed price for modules, installation, app setup and GST. What we quote is what you pay.

**Package cards**
| Package | Tagline | Includes | Price |
|---|---|---|---|
| **Smart Room** | Start with one room | Modules for one room's lights and fan · installation · app setup · 3-year warranty | From ₹[TBC] *(or "Price after free survey")* |
| **Smart Essentials** *(Most popular [TBC])* | The rooms you use most | 2–3 rooms + geyser · installation · app setup · Indian routines · 3-year warranty | From ₹[TBC] |
| **Full Smart Home** | Every room, every switch | All rooms, geyser, AC (IR), custom scenes · installation · app setup · 3-year warranty | Custom quote |

**Every package includes:** Free survey & Readiness Report · Homeasy modules · Professional installation · App setup for your family · "Same look" guarantee · 3-year warranty · WhatsApp support

**Add-ons**
| Add-on | Price |
|---|---|
| Extra module (any room) | ₹[TBC] |
| Homeasy IR Remote (AC/TV) | ₹[TBC] |
| Smart Plug | ₹[TBC] (Planned) |
| Homeasy Care plan | Coming soon |

**Estimator promo:** Want a rough idea first? [Try the cost estimator →]

**Why survey first?** Every home's wiring is different. A survey means your quote is accurate, fair and fixed — no "extra charges" on installation day.

**Payment terms [TBC]:** e.g. booking amount at order, balance after installation. UPI, card, bank transfer.

**FAQ**
- Is the survey free? — Yes, within our service area.
- Any hidden charges? — No. The quote includes modules, installation, app setup and GST.
- Can I start with one room? — Yes. Most families start small and add rooms later.
- Is the app free? — Yes, for every Homeasy customer.

---

### 26.5 App (`/app`)

**Hero**
- H1: One easy app for your whole home.
- Sub: Free for every Homeasy customer. Android and iOS.
- Badge: Coming soon *(store badges when `APP_LIVE`)*

**Feature rows**
| Feature | Copy |
|---|---|
| Rooms at a glance | Every room and every switch on one screen. |
| Fan speed, from your phone | Change speed without getting up. |
| Scenes | "Good morning", "Movie time", "Good night" — one tap, many switches. |
| Schedules | Geyser at 6 am, outdoor lights at sunset, everything off at midnight. |
| Family sharing | Give each family member their own access. |
| Parents' home | Look after your parents' home from another city. (Remote control at launch [TBC]; inactivity alerts coming soon.) |

**Coming soon:** Voice assistants · Energy insights · Hindi with simple mode · Other smart brands in the same app

**Privacy note:** Your home, your data. Read how we protect it → Privacy policy

---

### 26.6 Solutions hub (`/solutions`)

- H1: Homeasy for business
- Sub: Smart retrofit for the people who build, design, wire and run India's buildings.
- Cards: **Interior designers & architects** — Smart features without changing your design. · **Builders & commercial** — Smart-ready flats, offices and shops. · **Electricians** — Grow your work with Homeasy. · **Government & institutions** — Central control and energy efficiency for public buildings.
- Footer line: Not sure where you fit? [Contact us]

### 26.7 Interior designers & architects (`/solutions/designers`)

- H1: Smart homes without changing your design.
- Sub: Add smart control behind the switchboards your clients chose — no wall chasing, no redesign.
- CTA: Become a design partner

**Benefits**
- **Your design stays intact** — modules hide inside existing boxes.
- **No civil work** — install during finishing or after handover.
- **Premium value** — offer smart living in every project.
- **We handle the technical side** — survey, installation, app setup and support.

**How we work with you**
1. Joint site visit with you or your site supervisor
2. A proposal you can share with your client (co-branded [TBC])
3. Installation scheduled around your timeline
4. Client handover with app setup — and we support them afterwards

**Partner benefits:** Trade pricing [TBC] · Priority scheduling · Demo access for your clients · Dedicated contact

**FAQ**
- Can you work during renovation? — Yes; we schedule after electrical rough-in and before final handover [TBC with SOP].
- Who supports the client later? — Homeasy, directly — 30-minute WhatsApp replies and 24-hour visits in Patna.
- Do you work outside Patna? — Patna first; contact us for other locations.

**Form heading:** Tell us about your practice

### 26.8 Builders & commercial (`/solutions/builders`)

- H1: Smart-ready homes and spaces, without redesign.
- Sub: Upgrade ready flats, show flats, offices and shops with Homeasy retrofit — and give buyers a reason to choose you.
- CTA: Discuss a project

**Use cases:** Ready-to-move flats · Show flats · Under-construction projects · Offices · Shops & showrooms · Clinics · PGs & hostels

**Benefits**
- **Sell the smart-home story** — without changing your electrical design.
- **Show-flat demo** — let buyers try it themselves.
- **Resident onboarding** — Homeasy sets up the app for every buyer.
- **After-sales handled** — warranty and service by Homeasy.

**How it works:** Project survey → BOQ & proposal → Pilot/show flat → Rollout → Resident support

**Block:** Project pricing is based on units and scope — share your project and we'll prepare a proposal.

**Form heading:** Tell us about your project

### 26.9 Electricians (`/solutions/electricians`)

- H1: Grow your work with Homeasy.
- Sub: Join the Homeasy electrician network in Patna — learn smart-home installation and earn more.
- CTA: Join the network

**Benefits**
- **Free training** on Homeasy modules and installation SOP.
- **Paid installation jobs** from Homeasy [payout model TBC].
- **Referral rewards** for customers you bring [TBC].
- **Backup from our team** — technical help on WhatsApp.

**Who can join:** Experienced house-wiring electricians · Own smartphone · [Licence/ID requirements TBC]

**How it works:** Apply → Short interview → Training session → First jobs with a Homeasy lead → Independent jobs

**Form heading:** Apply to join

### 26.10 Government & institutions (`/solutions/government`)

- H1: Smarter, energy-efficient public buildings — without rewiring.
- Sub: Homeasy retrofit gives departments central control and schedules for lights, fans and appliances across quarters, hostels and offices.
- CTA: Request a proposal · Download capability statement

**Use cases:** Government quarters · Hostels · Offices · Schools & colleges · Hospitals & health centres · Guest houses

**Benefits**
- **Central control** — switch off unused areas across a building.
- **Schedules** — lights and fans run only when needed.
- **No civil work** — retrofit inside existing switchboxes.
- **Local accountability** — a Patna-based team with written service levels.

**Company credentials card:** Homeasy Automation Private Limited · CIN [insert] · Incorporated 2025 · Registered office [insert] · GST [insert] · Registrations: [only confirmed — DPIIT / GeM / other]

**Note (internal, not shown):** no energy-saving percentages, empanelment or references until real (R8, R11).

**Form heading:** Tell us about your requirement

---

### 26.11 About (`/about`) — see Section 8.8 (complete)

### 26.12 Roadmap (`/roadmap`)

- H1: Where Homeasy is headed
- Sub: What we've done, what we're building, and what's next. Plans may change — we'll keep this page honest.
- Timeline: Section 8.9
- CTA: Want to be part of it? [Book a free survey] · [Partner with us]

### 26.13 Investors (`/investors`)

- H1: Bringing smart living to India's traditional homes.
- Sub: Most Indian homes can't go smart without rewiring. Homeasy makes it possible with retrofit modules, professional installation and a free app.
- **Problem:** Smart homes need new switchboards or rewiring; DIY modules come without installation or support; after-sales is weak.
- **Solution:** Homeasy modules inside existing switchboxes + trained installers + free app + written service levels.
- **Business model:** Hardware and installation revenue from day one; B2B projects with designers and builders; B2G projects; service plans later.
- **Market:** India — starting in Patna, then Bihar and other cities through installer partners.
- **Stage:** Pre-launch; preparing pilot installations. Incorporated 2025.
- **Founder:** Vishwjeet Narayanan — 13+ years in interior design, automation and smart-home integration.
- CTA: Contact the founder · Download one-pager *(Could)*

### 26.14 FAQ — see Section 8.13 (complete)

### 26.15 Contact (`/contact`)

- H1: Get in touch
- Sub: Questions, partnerships or press — we'd love to hear from you.
- Tiles: 💬 **WhatsApp** — Reply within 30 minutes (working hours) · 📞 **Call** — [insert] · ✉ **Email** — info@homeasy.io
- Form labels: Name · Mobile · Email (optional) · What's this about? · Message · Consent
- Office hours: [TBC, e.g. Mon–Sun 9 am–9 pm]
- Address: Homeasy Automation Pvt. Ltd., [insert registered address], Patna, Bihar [insert pincode]
- Success: "Thanks! We'll get back to you soon. For anything urgent, WhatsApp us."

### 26.16 Careers (`/careers`)

- H1: Help us make Indian homes smart.
- Sub: We're a small, focused team in Patna building hardware, software and service that families can trust.
- Why Homeasy: **Real impact** — your work goes into real homes. · **Ownership** — small team, big responsibility. · **Built in Bihar** — for India.
- Empty state: "No open roles right now. Send your profile to info@homeasy.io — we read every one."

### 26.17 Book a survey (modal/page microcopy)

| Element | Copy |
|---|---|
| Title | Book your free home survey |
| Sub | We'll visit, check your switchboxes and wiring, and give you a Readiness Report with a fixed quote. No obligation. |
| Step labels | 1. About you · 2. Your home |
| Pincode OK | ✓ Great — we serve your area. |
| Pincode not covered | We're not in your area yet. Finish booking and we'll tell you as soon as we arrive. |
| Consent | I agree to be contacted by phone/WhatsApp about my survey and accept the Privacy Policy. |
| Button | Book free survey |
| Success | ✅ Request received! Your request no. is HE-[####]. We'll WhatsApp or call you within [TBC] to confirm a time. |
| Errors | "Please enter your name." · "Enter a valid 10-digit mobile number." · "Enter a 6-digit pincode." · "Please accept to continue." |

### 26.18 Guarantee (`/guarantee`)

- H1: The Homeasy promise. In writing.
- Sub: Five promises we make to every Homeasy customer — and exactly what they mean.
- **"Same look" installation guarantee** — Your switchboard looks exactly the same, every switch works by hand, and we leave your home clean — or we redo it free. *(Terms: 8.20.1)*
- **Fixed price** — One price for modules, installation, app setup and GST. What we quote is what you pay.
- **30-minute WhatsApp reply** — During working hours, a real person replies within 30 minutes.
- **24-hour technician visit** — In our Patna service area, a technician visits within 24 hours of your complaint.
- **3-year warranty** — Homeasy modules replaced free for manufacturing defects for 3 years.
- Footer: Last updated [date] · Version [x]

### 26.19 Readiness Report sample (`/readiness-report`)

- H1: Your Smart Home Readiness Report
- Sub: After every free survey, you get a written report on WhatsApp — yours to keep, even if you don't buy.
- What's inside: 📸 Photos of each switchbox · ⚡ Neutral wire and box depth checks · 🔌 Appliance load notes · ⚠ Any safety issues we found · 🧩 Recommended modules room by room · 💰 Your fixed quote, valid for [TBC] days
- CTA: Download sample report · Get yours free — book a survey

### 26.20 Estimator (`/estimator`)

- H1: Estimate your smart home
- Sub: Tell us about your rooms. We'll suggest modules and a price range.
- Steps: Your home · Your rooms · What to control · Your estimate
- Result heading: Your estimated setup
- Result note (prices on): "Estimated ₹[min]–₹[max] including installation and GST. Your exact price is fixed after the free survey."
- Result note (prices off): "We'll confirm your exact price after the free survey."
- CTA: Book a survey with these details

### 26.21 Demo (`/demo`)

- H1: See Homeasy working before you decide.
- Options: **Visit our Patna demo home** — see real switchboards, real modules, real control. · **Video demo on WhatsApp** — 15 minutes from your sofa.
- Form button: Book my demo
- Success: "Booked! We'll confirm your slot on WhatsApp."

### 26.22 Global microcopy

| Element | Copy |
|---|---|
| Floating WhatsApp tooltip | Questions? We reply in 30 min |
| WhatsApp pre-filled (general) | Hi Homeasy, I'd like to know about making my home smart. |
| WhatsApp pre-filled (photo) | Hi Homeasy, here's a photo of my switchboard. Can it be made smart? My pincode: ___ |
| Cookie banner | We use cookies to understand how our site is used. Accept · Reject · Preferences |
| Announcement bar | 📍 Now booking free home surveys in Patna. Book yours → |
| 404 | This page isn't wired up. · Go home · Book a free survey |

### 26.23 Hindi key strings (for Phase 2 or earlier if Q21 = yes)

| English | Hindi |
|---|---|
| One App. Every Device. Easy. | एक ऐप। हर डिवाइस। आसान। |
| Make your existing home smart — without changing your switches. | अपने मौजूदा घर को स्मार्ट बनाइए — बिना स्विच बदले। |
| Book a free home survey | मुफ़्त होम सर्वे बुक करें |
| Send a switchboard photo on WhatsApp | व्हाट्सऐप पर स्विचबोर्ड की फ़ोटो भेजें |
| No rewiring. No broken walls. | न नई वायरिंग। न दीवार तोड़ना। |
| Your switches still work. | आपके स्विच पहले की तरह काम करते रहेंगे। |
| Technician within 24 hours | 24 घंटे में टेक्नीशियन |
| WhatsApp reply in 30 minutes | 30 मिनट में व्हाट्सऐप पर जवाब |
| 3-year warranty | 3 साल की वारंटी |
| "Same look" guarantee | "वही लुक" गारंटी |
| Look after your parents' home from anywhere | कहीं से भी अपने माता-पिता के घर का ख़याल रखें |

*Hindi copy to be reviewed by a native editor for natural tone before publishing.*


---

## 27. Operations: lead handling, templates and SOPs

The website only works if every lead is answered fast and every promise is kept. This section defines the minimum operating system for the pilot and launch, using zero-cost tools.

### 27.1 Tools (zero/low cost)

| Need | Tool | Notes |
|---|---|---|
| Customer chat | WhatsApp Business app (one number) | Labels, quick replies, greeting/away messages, catalogue |
| Lead database / CRM | Google Sheet (or Supabase table) fed by website forms | One row per lead; `status` column = pipeline |
| Technician survey form | Google Forms or AppSheet (free tier) [TBC] | Photo upload per switchbox; generates report data |
| Readiness Report | Google Docs/Slides template → PDF | Shared on WhatsApp |
| Scheduling | Google Calendar (shared) | One calendar per technician |
| Email | Zoho Mail (info@homeasy.io) | SPF/DKIM/DMARC configured |
| Ticketing (service) | "Service" tab in the same Sheet | Ticket ID, timestamps for SLA |

### 27.2 Roles (pilot)

| Role | Who (pilot) | Responsibilities |
|---|---|---|
| Lead desk | Founder + 1 assistant [TBC] | Answer WhatsApp within 30 min, qualify leads, book surveys |
| Survey technician | Installation lead | Surveys, Readiness Report data, photos |
| Installers | 2–3 trained electricians | Installations, service visits |
| Quote & report | Founder | Final quote, report sign-off |
| Service coordinator | Lead desk | Tickets, 24-hour visit scheduling, escalation |

### 27.3 Lead pipeline and SLAs

| Stage (`status`) | Entry trigger | Owner | Action | SLA |
|---|---|---|---|---|
| `new` | Form, WhatsApp, call, referral | Lead desk | Acknowledge, qualify (area, rooms, appliances) | Reply ≤ 30 min (working hours) |
| `contacted` | First human contact made | Lead desk | Offer survey slots | Same day |
| `survey_scheduled` | Slot confirmed | Lead desk | Calendar invite; reminder day before | — |
| `surveyed` | Survey completed | Technician | Submit survey form + photos | Same day |
| `quoted` | Report + quote sent | Founder | Send Readiness Report and fixed quote on WhatsApp | ≤ [24] h after survey [TBC] |
| `won` | Customer accepts + booking amount | Lead desk | Schedule installation | Install within [TBC] days |
| `installed` | Handover done | Installer | Before/after photos, warranty activated, app set up | — |
| `lost` | Declined / no response after follow-ups | Lead desk | Record reason (price, timing, trust, unsuitable, other) | After D+14 |
| `out_of_area` | Pincode not served | System/lead desk | Polite message; keep for expansion | Reply ≤ 30 min |

**Follow-up cadence after quote:** D+1 (questions?), D+3 (gentle reminder), D+7 (last check + offer demo), then `lost` at D+14 with reason.

**Lead qualification questions (WhatsApp):** area/pincode · house or flat · rooms to automate · appliances (fan, geyser, AC) · approximate age of wiring · preferred survey day.

### 27.4 WhatsApp Business setup

| Setting | Value |
|---|---|
| Business name | Homeasy — Smart Home Retrofit |
| Description | Make your existing home smart without changing switches. Free home survey in Patna. Reply within 30 min (working hours). |
| Hours | [TBC, e.g. 9 am–9 pm daily] |
| Greeting message | See T1 |
| Away message | See T2 |
| Labels | New lead · Photo check · Survey booked · Quoted · Won · Installed · Service · B2B · Gov · Out of area |
| Catalogue | Packages (no prices until final) + products (Coming soon) |
| Quick replies | `/photo`, `/survey`, `/area`, `/price`, `/warranty`, `/service`, `/thanks` |

### 27.5 WhatsApp templates (English + Hindi)

> Keep messages short, friendly and specific. Replace `{}` fields. Hindi versions to be reviewed by a native editor.

**T1 — Greeting (new chat)**
- EN: Namaste! 🙏 Thanks for contacting Homeasy. We make existing homes smart without changing switches or rewiring. How can we help — would you like a free home survey, or to send a photo of your switchboard?
- HI: नमस्ते! 🙏 Homeasy से संपर्क करने के लिए धन्यवाद। हम बिना स्विच बदले और बिना नई वायरिंग के आपके घर को स्मार्ट बनाते हैं। क्या आप मुफ़्त होम सर्वे बुक करना चाहेंगे, या अपने स्विचबोर्ड की फ़ोटो भेजना चाहेंगे?

**T2 — Away (outside hours)**
- EN: Thanks for your message! Our team is available {9 am–9 pm}. We'll reply first thing at {9 am}. For a free survey, you can also book here: {link}
- HI: आपके संदेश के लिए धन्यवाद! हमारी टीम {सुबह 9 – रात 9} बजे तक उपलब्ध है। हम {सुबह 9 बजे} सबसे पहले जवाब देंगे। मुफ़्त सर्वे यहाँ भी बुक कर सकते हैं: {link}

**T3 — Photo check: feasible**
- EN: Thanks for the photo, {name}! ✅ Your switchboard looks suitable for Homeasy. A free survey will confirm the wiring and give you a fixed quote. Shall we book one? Available slots: {slot1}, {slot2}.
- HI: फ़ोटो के लिए धन्यवाद, {name}! ✅ आपका स्विचबोर्ड Homeasy के लिए उपयुक्त लगता है। मुफ़्त सर्वे से वायरिंग की पुष्टि होगी और आपको फिक्स्ड कोटेशन मिलेगा। क्या सर्वे बुक करें? उपलब्ध समय: {slot1}, {slot2}।

**T4 — Photo check: needs survey**
- EN: Thanks, {name}! From the photo we can't fully confirm — the box depth/wiring needs a quick look in person. The survey is free and takes about {30–45} minutes. Shall we book it?
- HI: धन्यवाद, {name}! फ़ोटो से पूरी पुष्टि नहीं हो पा रही — बॉक्स की गहराई/वायरिंग को एक बार देखना होगा। सर्वे मुफ़्त है और लगभग {30–45} मिनट लगते हैं। क्या बुक करें?

**T5 — Photo check: not suitable (honest)**
- EN: Thanks for sharing, {name}. Honestly, this switchboard may not be suitable as it is ({reason}). Our technician can suggest a small fix during a free survey, or we can tell you when our new module for this type is ready. What would you prefer?
- HI: शेयर करने के लिए धन्यवाद, {name}। सच कहें तो यह स्विचबोर्ड अभी जैसा है वैसा शायद उपयुक्त नहीं है ({reason})। हमारे टेक्नीशियन मुफ़्त सर्वे में छोटा-सा समाधान बता सकते हैं, या जब इस प्रकार के लिए हमारा नया मॉड्यूल तैयार होगा तब हम आपको बताएँगे। आप क्या चाहेंगे?

**T6 — Survey confirmed**
- EN: Your free Homeasy survey is booked ✅ 📅 {date}, {time} 📍 {address} 👷 Technician: {name} ({phone}). Please keep your Wi-Fi name and password handy. Request no. {HE-####}.
- HI: आपका मुफ़्त Homeasy सर्वे बुक हो गया है ✅ 📅 {date}, {time} 📍 {address} 👷 टेक्नीशियन: {name} ({phone})। कृपया अपना वाई-फ़ाई नाम और पासवर्ड तैयार रखें। अनुरोध संख्या {HE-####}।

**T7 — Reminder (day before)**
- EN: Reminder: your Homeasy survey is tomorrow, {date} at {time}. Reply 1 to confirm or 2 to reschedule.
- HI: याद दिलाना: आपका Homeasy सर्वे कल {date} को {time} बजे है। पुष्टि के लिए 1 या समय बदलने के लिए 2 लिखें।

**T8 — Technician on the way**
- EN: {technician} is on the way and should reach you in about {minutes} minutes. 🚗
- HI: {technician} रास्ते में हैं और लगभग {minutes} मिनट में पहुँचेंगे। 🚗

**T9 — Readiness Report + quote**
- EN: Here's your Smart Home Readiness Report, {name} 📋 (attached). Summary: {n} switchboxes checked · {suitable} suitable · {notes}. Your fixed price: ₹{amount} including modules, installation, app setup and GST. Valid till {date}. Any questions? We're here.
- HI: {name}, यह रहा आपका स्मार्ट होम रेडीनेस रिपोर्ट 📋 (संलग्न)। सारांश: {n} स्विचबॉक्स जाँचे गए · {suitable} उपयुक्त · {notes}। आपकी फिक्स्ड कीमत: ₹{amount} — मॉड्यूल, इंस्टॉलेशन, ऐप सेटअप और GST सहित। {date} तक मान्य। कोई सवाल हो तो बताइए।

**T10 — Quote follow-up (D+3)**
- EN: Hi {name}, just checking if you had any questions about your Homeasy quote. Happy to arrange a demo too. 😊
- HI: नमस्ते {name}, आपके Homeasy कोटेशन को लेकर कोई सवाल हो तो बताइए। चाहें तो डेमो भी दिखा सकते हैं। 😊

**T11 — Installation scheduled**
- EN: Installation booked ✅ 📅 {date}, {time}. Our team: {names}. Expected time: about {hours} hours. We'll take before/after photos of every switchbox for your records.
- HI: इंस्टॉलेशन बुक हो गया ✅ 📅 {date}, {time}। हमारी टीम: {names}। अनुमानित समय: लगभग {hours} घंटे। आपके रिकॉर्ड के लिए हर स्विचबॉक्स की पहले/बाद की फ़ोटो लेंगे।

**T12 — Handover**
- EN: Welcome to Homeasy, {name}! 🎉 Your installation is complete. 📸 Before/after photos attached · 🛡 3-year warranty active from {date} · 📱 App set up for {members}. Problem anytime? WhatsApp us — reply within 30 min, technician within 24 hours.
- HI: Homeasy परिवार में स्वागत है, {name}! 🎉 आपका इंस्टॉलेशन पूरा हुआ। 📸 पहले/बाद की फ़ोटो संलग्न · 🛡 3 साल की वारंटी {date} से शुरू · 📱 {members} के लिए ऐप सेट। कभी भी समस्या हो तो व्हाट्सऐप करें — 30 मिनट में जवाब, 24 घंटे में टेक्नीशियन।

**T13 — Feedback & review (D+7)**
- EN: Hope you're enjoying your smart home, {name}! Could you share a quick review? It helps other families find us: {google_review_link}
- HI: उम्मीद है आपको अपना स्मार्ट होम पसंद आ रहा है, {name}! क्या आप एक छोटा-सा रिव्यू दे सकते हैं? इससे दूसरे परिवारों को हमें खोजने में मदद मिलती है: {google_review_link}

**T14 — Service complaint acknowledged**
- EN: Sorry for the trouble, {name}. Ticket {SV-####} created at {time}. A technician will visit within 24 hours — we'll confirm the time shortly.
- HI: असुविधा के लिए खेद है, {name}। टिकट {SV-####} {time} पर बनाया गया। 24 घंटे के अंदर टेक्नीशियन आएँगे — समय जल्द बताते हैं।

**T15 — Service resolved**
- EN: Ticket {SV-####} resolved ✅ {what_was_done}. Is everything working fine now?
- HI: टिकट {SV-####} हल हो गया ✅ {what_was_done}। क्या अब सब ठीक काम कर रहा है?

**T16 — Out of area**
- EN: Thanks, {name}! We don't serve {area} yet, but we've saved your details and will message you as soon as we do. 🙏
- HI: धन्यवाद, {name}! अभी हम {area} में सेवा नहीं देते, लेकिन आपकी जानकारी सेव कर ली है और जैसे ही शुरू करेंगे, आपको संदेश भेजेंगे। 🙏

**T17 — B2B / Government acknowledgement**
- EN: Thank you for your enquiry, {name}. Our founder will contact you within {1 working day} to understand your project. Reference: {B2B/GOV-####}.

### 27.6 Email templates

**E1 — Survey confirmation** (Section 10.6)

**E2 — Quote email**
> Subject: Your Homeasy Readiness Report and fixed quote
> Hi {first_name}, thank you for letting us survey your home. Attached are your Smart Home Readiness Report and fixed quote of ₹{amount} (including modules, installation, app setup and GST), valid until {date}. Reply here or WhatsApp us at {number} with any questions.
> — Team Homeasy · One App. Every Device. Easy.

**E3 — Handover & warranty**
> Subject: Welcome to Homeasy — your warranty is active
> Hi {first_name}, your installation is complete. Your 3-year warranty is active from {date} (invoice {no.}). Before/after photos are attached. Need help? WhatsApp {number}: reply within 30 minutes (working hours), technician within 24 hours in Patna.

**E4 — B2B acknowledgement**
> Subject: Thanks for your interest in partnering with Homeasy
> Hi {first_name}, thank you for reaching out about {project/partner type}. We'll contact you within one working day to understand your needs and share next steps.

**E5 — Government acknowledgement**
> Subject: Homeasy — acknowledgement of your enquiry (Ref {GOV-####})
> Dear {name}, thank you for your enquiry regarding {building type} in {district}. Our capability statement is attached. Our founder will contact you within one working day.

**E6 — Careers acknowledgement**
> Subject: We received your application
> Hi {first_name}, thanks for your interest in Homeasy. We review every profile and will reach out if there's a fit.

### 27.7 Survey SOP (technician)

**Before the visit**
1. Confirm slot via T6; send T7 the day before.
2. Carry: tester, screwdrivers, insulated tools, torch, phone with survey form, Homeasy ID card, shoe covers, small cloth for cleaning.
3. Read lead notes (rooms, appliances, wiring age, switch brand).

**On site (30–45 min target)**
1. Introduce, show ID, explain what you'll do and that power will be switched off briefly.
2. Ask the family which rooms and appliances matter most.
3. For each selected switchboard:
   - Photo of the switchboard front (before) — straight on, good light.
   - Switch off the relevant MCB; confirm dead with tester.
   - Open the plate; photo inside the box.
   - Record: box depth (fits / tight / no), neutral present (yes/no), wire condition (good / aged / unsafe), loads connected (light/fan/geyser/AC/other with approx wattage), 2-way switches (yes/no), plate condition (good / brittle / damaged).
   - Close the plate; switch power back on; test the switches.
4. Check Wi-Fi strength in each selected room (phone signal meter).
5. Note any safety issues (burnt wires, loose connections, no earthing) — **tell the customer on the spot**.
6. Explain the next step: Readiness Report and fixed quote on WhatsApp within [24] hours.
7. Leave the area clean.

**Survey form fields:** lead ID · address · home type · per box: room, photos (front/inside), depth fit, neutral, wire condition, loads, 2-way, plate condition, recommended module · Wi-Fi per room · safety issues · customer priorities · technician notes · time in/out.

**Module recommendation rules (draft — refine with ODM specs)**
| Finding | Recommendation |
|---|---|
| Lights only, neutral present, depth OK | Smart Relay (2/4-ch) |
| Fan on the board | Fan Controller (+ relay for lights) |
| Geyser/AC/motor (high load) | Power Module (16A) — check rating |
| AC/TV with remote | IR Remote (no wiring) |
| No neutral | No-Neutral Module (when available) or report "needs fix" |
| Box too shallow | Spacer/extension (needs written approval — changes look) or skip |
| Unsafe wiring | Report; fix as paid item before installation |

### 27.8 Readiness Report template

1. **Cover:** Homeasy logo · "Smart Home Readiness Report" · customer name, address, date, technician, request no.
2. **Summary:** boxes checked · suitable · needs fix · not suitable · overall verdict.
3. **Room-by-room:** photo (front + inside) · findings · recommended modules.
4. **Safety notes:** issues found, urgency (fix now / recommended / note).
5. **Your setup:** what you'll be able to control and example routines.
6. **Fixed quote:** itemised modules, installation, app setup, GST, total, validity date.
7. **Our promises:** "Same look" guarantee · 30-min reply · 24-h visit · 3-year warranty.
8. **Next steps:** "Reply YES on WhatsApp to book installation."

### 27.9 Installation SOP (summary)

1. Confirm via T11; carry modules (burn-in tested), tools, spares, shoe covers, drop cloth.
2. Before photos of every box (already in report — retake on the day).
3. MCB off → test dead → install module per wiring diagram → secure and insulate → close plate exactly as before.
4. Power on → test every switch by hand → pair module with app → test from app → test scenes/schedules.
5. App setup for family members; demo for the household (5–10 min).
6. After photos of every box; clean the area.
7. Handover: T12 + E3; update Sheet to `installed`; warranty date recorded.

### 27.10 Service and complaint SOP

| Step | Action | Timer |
|---|---|---|
| 1 | Complaint received (WhatsApp/call) → create ticket SV-#### with timestamp | 0 |
| 2 | Reply with T14; try remote fix (app reset, Wi-Fi check) | ≤ 30 min (working hours) |
| 3 | Assign technician; confirm visit time | ≤ 2 h [TBC] |
| 4 | Visit; replace module first if faulty (spares in van) | ≤ 24 h from ticket |
| 5 | Resolve → T15 → close ticket with root cause | — |
| 6 | If 24 h is at risk → founder escalation; inform customer proactively; apply missed-visit remedy [TBC] | At 18 h |

**Weekly review:** % replies ≤ 30 min · % visits ≤ 24 h · repeat faults by module · root causes. Publish U2/U5 on the website only when both are ≥ 95% [TBC] for 4 consecutive weeks of pilot.

### 27.11 Operations KPIs (weekly dashboard)

| KPI | Source |
|---|---|
| New leads by source | Sheet (`heard_from`, UTM) |
| Median WhatsApp first-reply time; % ≤ 30 min | WhatsApp timestamps / Sheet |
| Surveys booked / completed | Sheet |
| Survey → quote time | Sheet |
| Quote → won conversion; lost reasons | Sheet |
| Installations completed; average install time per room | Sheet |
| Service tickets; % visits ≤ 24 h; repeat faults | Service tab |
| Google reviews count and rating | Google Business Profile |


---

## 28. Launch marketing plan and budget

> **Budget figures are planning estimates for a Patna launch**, not quotes. Ad costs vary by season and competition; set real targets after 2–4 weeks of data. Start in the Bootstrap tier and move up only when cost per survey and survey→order conversion are known.

### 28.1 Objectives

| Phase | Objective | Primary metric |
|---|---|---|
| Pilot (weeks 0–6) | 5–10 installed homes; real photos, videos, testimonials; prove 30-min / 24-h service levels | Installed pilot homes; SLA hit rate |
| Launch (weeks 7–14) | Steady survey pipeline in Patna | Surveys booked per week |
| Growth (week 15+) | Profitable, repeatable acquisition + B2B partners | Cost per order; partner-sourced leads |

### 28.2 Positioning in all marketing

- **Core line:** Smart home without changing a single switch — surveyed, installed and guaranteed by Homeasy.
- **Proof:** "Same look" guarantee · 30-min WhatsApp reply · 24-hour visit · 3-year warranty · Patna team.
- **Emotional hooks:** geyser left on · father struggling with switches at night · "control your parents' home from Bengaluru".
- **Language:** Hindi + Hinglish for social and offline; English for LinkedIn, B2B and B2G.

### 28.3 Channels

| Channel | What we do | Phase | Cost |
|---|---|---|---|
| **Google Business Profile** | Complete profile, real install photos, weekly posts, review requests (T13) | Pilot → ongoing | Free |
| **Website + local SEO** | Section 13; locality pages later | Launch | Free |
| **WhatsApp** | Status updates (before/after), broadcast list for opted-in leads, referral sharing | Pilot → ongoing | Free |
| **Instagram + Facebook** | Reels: before/after, "same switch" demos, parents' story, myth-busting ("No, you don't need rewiring") | Pilot → ongoing | Free organic; paid in Launch |
| **YouTube Shorts** | Same reels + 2–3 min "full installation" videos | Launch | Free |
| **Meta ads (geo-targeted Patna)** | Click-to-WhatsApp and survey-booking ads; audiences: homeowners 30–60, parents' home (children outside Bihar) | Launch | Paid |
| **Google Search ads** | "smart home Patna", "home automation Patna", "smart switch installation" | Launch | Paid |
| **Electrician network** | Referral cards with QR; training sessions; payout per referral [TBC] | Pilot → Growth | Low |
| **Interior designers** | Demo visits, trade pricing, co-branded proposals | Launch → Growth | Low |
| **Housing societies / RWAs** | Weekend demo stalls, notice-board posters, society WhatsApp groups (with permission) | Launch | Low |
| **Electrical & hardware shops** | Counter standees with QR + photo-check offer | Launch | Low |
| **Newspaper inserts / local press** | Pamphlet inserts in selected localities; founder story pitched to Patna editions of Hindi and English papers | Launch | Paid (inserts) / free (PR) |
| **Events** | Local home, interior and building expos [TBC] | Growth | Paid |
| **LinkedIn** | Founder posts, B2B/B2G credibility, hiring | Ongoing | Free |
| **Customer referral programme** | Reward for each referred installation [reward TBC, e.g. free extra module or Care months] | Launch → Growth | Variable |

### 28.4 Content pillars (social)

| Pillar | Example posts | Frequency |
|---|---|---|
| **Same switch, smarter home** | Before/after slider reels; "spot the difference" | 2/week |
| **How it works** | 30-sec module install; "what's inside your switchbox" | 1/week |
| **Real families** | Pilot customer stories (with consent) | 1/week |
| **Indian routines** | Morning geyser, puja lights, night path for parents | 1/week |
| **Myth-busting** | "Smart home = expensive?", "Need new wiring?", "What if internet fails?" | 1/week |
| **Behind the scenes** | Testing modules in Patna, training electricians, founder journey | 1/week |
| **Parents' home** | "Control your parents' home from another city" | 2/month |

### 28.5 Launch timeline

| Week | Activities |
|---|---|
| 0–1 | Phase 0 website fixes; WhatsApp Business set up (27.4); Google Business Profile created; templates loaded |
| 1–3 | Pilot site live; recruit 5–10 pilot homes from network (discounted for feedback + content consent); first electricians trained |
| 3–6 | Pilot installs; shoot before/after photos and videos; collect reviews; measure SLAs and install times |
| 6 | Finalise prices, guarantee terms and SLA publishing decision; full site build |
| 7 | **Launch week:** full site live; GBP posts; first reels; founder LinkedIn post; press note to local papers; society demo #1 |
| 7–10 | Meta + Google ads (Lean tier); 2 society demos; shop standees in 10 electrical shops; designer outreach (20 firms) |
| 10–14 | Optimise ads by cost per survey; referral programme live; first B2B project proposals |
| 14+ | Growth tier if unit economics positive; government capability outreach; plan next localities |

### 28.6 Budget tiers (monthly, INR — estimates)

| Item | Bootstrap (≈ ₹10k/month) | Lean (≈ ₹35k/month) | Growth (≈ ₹1L/month) |
|---|---|---|---|
| Meta ads (Patna geo) | ₹0–3,000 | ₹12,000 | ₹35,000 |
| Google Search ads | ₹0 | ₹8,000 | ₹25,000 |
| Printing (pamphlets, standees, referral cards, posters) | ₹3,000 | ₹5,000 | ₹10,000 |
| Society/RWA demos (stall, travel, refreshments) | ₹2,000 | ₹4,000 | ₹8,000 |
| Content production (phone + gimbal + editing apps; freelance editor later) | ₹2,000 | ₹3,000 | ₹10,000 |
| Referral rewards | ₹0–2,000 | ₹3,000 | ₹8,000 |
| Newspaper inserts / events | ₹0 | ₹0 | ₹4,000+ |
| **Total** | **≈ ₹10,000** | **≈ ₹35,000** | **≈ ₹1,00,000** |

**One-time launch costs (estimates):** demo setup materials ₹[TBC] · branded uniforms/ID cards ₹[TBC] · signage ₹[TBC] · photography/video kit ₹[TBC].

### 28.7 Measurement

| Metric | Formula | Target |
|---|---|---|
| Cost per lead (CPL) | Spend ÷ leads | Set after 2 weeks |
| Cost per survey | Spend ÷ surveys completed | Set after 4 weeks |
| Survey → order conversion | Orders ÷ surveys | Track (business plan KPI) |
| Cost per order (CAC) | Spend ÷ orders | Must stay below gross margin per home (business plan 13.1) |
| Referral share | Orders from referrals ÷ all orders | Grow over time |
| Channel ROI | Orders by source vs spend | Weekly review; shift budget to winners |

**Rule:** increase spend on a channel only when its cost per order is below the target CAC for two consecutive weeks.


---

## 29. Visual design, effects and resource register

This section turns the design references (Fontshare, fffuel, ambientCG, Poly Pizza, PrettySites) into a concrete visual direction. It **supersedes the placeholder typography and colours in 6.2–6.3** once the founder approves it; the new logo/palette redesign should use it as the brief.

### 29.1 Creative concept: "Same switch. Smarter home." (light-first, flat)

The site is **light-first and flat**, matching the logo. Storytelling happens in a few **navy sections** (app demo, how it works, product showcase).
- The hero shows a clean, flat illustration of an Indian switchboard in a room.
- The visitor **flips the switch**; the room's lamp turns on with a soft amber light and the headline changes from "Same switch." to "Smarter home." This is the only lighting effect on the site.
- A thin, flat **"wire" line** (no glow) may connect sections as a subtle brand motif.
- Everything else is calm, clear and readable.

### 29.2 Signature interaction — the hero switch

| Item | Spec |
|---|---|
| Element | A large, realistic modular switch (generic design, no brand) on the hero wall, labelled "Try it" |
| Interaction | Tap/click or press Space/Enter → switch rocks (flat animation) → the lamp in the illustration turns amber with a soft light (400 ms); the page stays light — no theme change |
| Message | Before toggle: "Same switch." · After toggle: "Smarter home." |
| Persistence | Not needed (no theme change); optional dark mode follows system setting only |
| Accessibility | Real `<button role="switch" aria-checked>`; visible focus; works without animation if reduced motion is on |
| Fallback | Static lit-room image if JavaScript fails |

### 29.3 Hero build tiers (performance first)

| Tier | Devices | Hero content | Weight budget |
|---|---|---|---|
| **A — Base (all)** | Every device, loads first | Flat SVG/WebP illustration of room + switchboard (light); switch toggle works with CSS only | ≤ 150 KB |
| **B — Enhanced** | Mid-range phones, desktops on good networks | Lottie/SVG animation of plate lifting → module sliding in → lights on (M7-style exploded sequence, simplified) | ≤ 250 KB extra, lazy-loaded |
| **C — Rich (desktop only)** | Desktop with WebGL, `prefers-reduced-motion: no-preference`, fast connection | Three.js scene: real 3D switchboard with ambientCG wall texture; scroll scrubs the exploded view; mouse parallax | ≤ 1.5 MB extra, loaded after LCP |

Rules: LCP element is always the Tier A image + H1; Tier B/C load after `load` event and only if `navigator.connection.saveData` is false.

### 29.4 Colour palette — final

See **Section 6.2**: Deep Navy `#0B1220`, Homeasy Blue `#3A9ADB`, Switch Amber `#F9B445`, White, plus Cloud White, Border Grey and Slate Grey. Light-first; navy for storytelling sections; amber only for "on"/active moments.

### 29.5 Typography — final

See **Section 6.3**: Chillax throughout (Bold 700 / Semibold 600 / Regular 400); Satoshi fallback for long-form pages if the readability test fails; Hind for Hindi.

### 29.6 Backgrounds and textures (flat direction)

| Area | Treatment | Resource |
|---|---|---|
| Hero | White / Cloud White background with a flat room illustration; soft amber light only when switched on | Own illustration |
| Light sections | Alternate White and Cloud White; 1 px Border Grey dividers | — |
| Dark sections | Solid Deep Navy (`#0B1220`); Navy 800 cards | — |
| "Wire" motif | Thin flat line in Blue-200/Blue-500, animated draw-on (optional) | fffuel **llline** (paths only) |
| Section dividers | Straight or simple geometric edges (no waves) | — |
| Isometric "smart home" | Flat isometric illustration in brand colours | fffuel **iiisometric** / **mmmotif**, or Poly Pizza models rendered flat |
| Realistic renders (product pages only) | Clean studio renders of modules on white | ambientCG HDRI for lighting |
| ❌ Not used | Grainy gradients, blurry glow blobs, noise overlays, neon shapes, liquid glass | (fffuel gggrain, bbblurry, nnnoise, nnneon — dropped) |

### 29.7 Effects library (flat direction)

| Effect | Where | Inspiration | Spec | Cost |
|---|---|---|---|---|
| **Flip-the-switch** | Hero | Original | 29.2; flat rocker animation + amber lamp | Low |
| **Exploded switchbox on scroll** | How it works (navy section) | PrettySites *M7* | Flat illustration: plate lifts → module slides in → plate closes → lamp on; 4 steps | Medium |
| **Appliance tiles fly into phone** | App section (navy) | PrettySites *Formplay* | Flat tiles (fan, geyser, AC, light, motor) move into a phone mock | Medium |
| **Before/after slider** | How it works, Guarantee, installs gallery | PrettySites *OVAL Atelier* (slider only) | Draggable divider, keyboard arrows, "Before/After" labels | Low |
| **360° module turntable** | Product detail | PrettySites *Product Stage* | 36-frame WebP sprite on white | Medium |
| **Interactive isometric home** | "What you can make smart" | iiisometric / Poly Pizza | Tap a room → appliance icon turns amber + label | Medium |
| **Wire draw-on** | Section transitions | fffuel *llline* | Thin flat stroke draws as section enters view | Low |
| **Hover states** | Buttons, cards | — | Colour shift (Blue-500 → Blue-400), border Blue-200 on cards; **no glows or shadows** | Low |
| **Counter strip** | Service levels | — | "30 min · 24 h · 3 yrs" count-up once | Low |
| ❌ Dropped | Liquid-glass cards, glow on hover, dusk→day theme switch | — | Conflicts with flat logo direction | — |

**Motion rules:** 150–500 ms, ease-out; subtle; all reduced/disabled under `prefers-reduced-motion`; no sound.

### 29.8 3D and imagery production plan

| Asset | Method | Resources |
|---|---|---|
| Hero switchboard scene | Model a generic Indian modular switchboard + Homeasy module in Blender; for product pages and optional desktop Tier C only; the site's main hero uses the flat illustration | ambientCG (CC0) |
| Module renders | Blender from ODM CAD/photos; 36-frame turntable per product | ambientCG HDRI for studio lighting |
| Isometric smart home | Low-poly room set (sofa, bed, lamp, TV, table) | Poly Pizza (check per-model licence; credit CC-BY) — custom-model Indian ceiling fan, geyser, inverter |
| Lifestyle photos | Real Patna homes and pilot families (consented) | Own photography — avoid foreign stock |
| Icons | Line icons (Lucide) + custom appliance icons in the same stroke style | — |
| OG images | Dusk switchboard render + headline | Own renders |

### 29.9 Using PrettySites references

PrettySites provides design prompts and source files intended for AI website builders. Use the listed designs as **interaction references** — describe the pattern to the developer (or to Claude) and rebuild it in Homeasy's own style and code. Do not copy proprietary source or media unless the PrettySites licence explicitly allows it; check its pricing/licence terms first.

| Reference | Pattern to reuse | Homeasy section |
|---|---|---|
| OVAL Atelier | Before/after room reveal; liquid-glass buttons | How it works, Guarantee |
| Formplay | Tiles flying into one canvas on scroll | "One easy app" |
| M7 | Scroll-synced disassembly/reassembly | Hero (Tier B/C), How it works |
| Product Stage | 360° product turn on scroll | Product detail |
| HabitFlow | Light + liquid-glass dual theme from one state | Dusk/day theme system |
| Thera | Calm palette and serif headline restraint | Tone reference for trust pages (Warranty, Guarantee) |

### 29.10 Resource register

| # | Resource | Link | Licence (verify before use) | Use in Homeasy |
|---|---|---|---|---|
| R1 | Fontshare — Chillax | https://www.fontshare.com/fonts/chillax | ITF Free Font License (free personal + commercial; no redistribution of font files) | Logo wordmark, display and headings |
| R2 | Fontshare — Satoshi | https://www.fontshare.com/fonts/satoshi | ITF FFL | Body/UI |
| R3 | Fontshare — General Sans (alternate) | https://www.fontshare.com/fonts/general-sans | ITF FFL | Body alternate |
| R4 | ITF Free Font License | https://www.fontshare.com/licenses/itf-ffl | — | Licence record |
| R5 | Hind (Devanagari) | https://fonts.google.com/specimen/Hind | SIL OFL | Hindi |
| R6 | fffuel — pppalette | https://www.fffuel.co/pppalette/ | fffuel licence (https://www.fffuel.co/license/) | Palette generation |
| R7 | fffuel — hhhue | https://www.fffuel.co/hhhue/ | fffuel licence | Palette inspiration |
| R8 | fffuel — gggrain (not used — flat direction) | https://www.fffuel.co/gggrain/ | fffuel licence | Hero grainy gradient |
| R9 | fffuel — bbblurry (not used — flat direction) | https://www.fffuel.co/bbblurry/ | fffuel licence | Glow blobs |
| R10 | fffuel — nnnoise (not used — flat direction) | https://www.fffuel.co/nnnoise/ | fffuel licence | Noise texture |
| R11 | fffuel — sssurf (not used — flat direction) | https://www.fffuel.co/sssurf/ | fffuel licence | Wave dividers |
| R12 | fffuel — llline | https://www.fffuel.co/llline/ | fffuel licence | Wire motif |
| R13 | fffuel — ffflux / uuunion (not used — flat direction) | https://www.fffuel.co/ffflux/ · https://www.fffuel.co/uuunion/ | fffuel licence | Promise band gradient |
| R14 | fffuel — iiisometric / mmmotif | https://www.fffuel.co/iiisometric/ · https://www.fffuel.co/mmmotif/ | fffuel licence | Isometric home |
| R15 | fffuel — nnneon (not used — flat direction) | https://www.fffuel.co/nnneon/ | fffuel licence | Glowing bulb/wire accents |
| R16 | fffuel — eeencode / rrrasterize | https://www.fffuel.co/eeencode/ · https://www.fffuel.co/rrrasterize/ | fffuel licence | Inline SVG / PNG export |
| R17 | ambientCG — Surfaces (search "plaster", "painted plaster") | https://ambientcg.com/list?type=material,atlas,decal | CC0 (no attribution, commercial OK) | Wall textures |
| R18 | ambientCG — Tiles | https://ambientcg.com/list?category=Tiles | CC0 | Floors in renders |
| R19 | ambientCG — HDRIs (Environments) | https://ambientcg.com/list?type=hdri,hdri-element | CC0 | Render lighting |
| R20 | ambientCG — Metal / Fabric & Leather | https://ambientcg.com/list?category=Metal · https://ambientcg.com/list?category=Fabric,Leather | CC0 | Module screws, sofa, curtains |
| R21 | Poly Pizza — low-poly models (search lamp, sofa, bed, TV, plant, room) | https://poly.pizza | Mostly CC-BY (credit required), some CC0 — per model | Isometric home |
| R22 | PrettySites — OVAL Atelier | https://prettysites.io/?prompt=oval-atelier | PrettySites terms | Before/after, glass |
| R23 | PrettySites — Formplay | https://prettysites.io/?prompt=formplay | PrettySites terms | Tiles into app |
| R24 | PrettySites — M7 | https://prettysites.io/?prompt=m7 | PrettySites terms | Exploded switchbox |
| R25 | PrettySites — Product Stage | https://prettysites.io/?prompt=product-stage | PrettySites terms | 360° module |
| R26 | PrettySites — HabitFlow | https://prettysites.io/?prompt=habitflow | PrettySites terms | Dual theme |

**Attribution page:** add `/credits` (footer link) listing any CC-BY models (R21) with creator names and licence links. Keep a `/docs/assets.csv` in the repo recording each asset, source URL, licence, date downloaded and where it's used.

### 29.11 Performance budget for visual effects

| Item | Budget |
|---|---|
| Fonts (Chillax Regular/Semibold/Bold, official WOFF2, unmodified) | ≈ 3 files; measure actual size |
| Hero Tier A image | ≤ 150 KB |
| All SVG backgrounds on a page | ≤ 80 KB total |
| Lottie animations (each) | ≤ 120 KB |
| 360° sprite per product | ≤ 400 KB, lazy |
| Three.js Tier C bundle + assets | ≤ 1.5 MB, desktop only, after LCP |
| Total homepage initial load (mobile) | ≤ 1.5 MB (unchanged from 12.1) |

### 29.12 Acceptance criteria (visual)

- [ ] Hero switch toggles lights and theme with mouse, touch and keyboard; works with reduced motion (instant change).
- [ ] Mobile Lighthouse performance ≥ 90 with all effects enabled for Tier A/B.
- [ ] No Tier C code downloaded on mobile.
- [ ] Dusk and day palettes pass WCAG AA for all text.
- [ ] Every third-party asset listed in `/docs/assets.csv`; CC-BY credits on `/credits`.
- [ ] Fonts self-hosted from Fontshare downloads; licence file stored in repo.


---

## 30. 3D hero plan (desktop "Tier C" upgrade)

**Goal:** a striking, interactive 3D version of the "Same switch. Smarter home." hero for desktop visitors, built on the same story as the current 2D hero (Section 29.2 and prototype). Phones and slow connections keep the light 2D hero, which remains the default and the fallback.

### 30.1 Concept and storyboard

| Beat | What the visitor sees | Trigger |
|---|---|---|
| 1. Dusk | A cosy Indian living room at evening, seen at a slight angle. Painted-plaster wall, a familiar modular switchboard, ceiling fan, sofa, TV unit, geyser visible through a bathroom door. Dim blue-navy light; grainy film overlay | Page load |
| 2. Invitation | The right rocker gently pulses amber; label "Tap the switch" | 1.5 s idle |
| 3. Lights on | Visitor clicks the rocker → it rocks with a soft click → ceiling light warms up (amber), fan starts spinning, geyser indicator glows, room brightens; headline line 2 "Smarter home." gets the amber highlight | Click / Enter / Space |
| 4. Inside the switch (scroll) | Camera glides to the switchboard; plate lifts away; the Homeasy module slides out of the box and labels appear ("Fits inside your existing switchbox", "Your switches still work"); plate closes again | Scroll (pinned section, 3–4 steps) |
| 5. One app | Camera pulls back; a phone floats in front showing the Homeasy app; device cards link to the room's appliances with amber "wires" | Scroll end |
| 6. Hand-off | Pin releases into the rest of the page | Continue scrolling |

Mouse movement adds a gentle parallax (±3°). No autoplay sound; an optional muted click sound can be enabled with a speaker icon.

### 30.2 Scene and asset list

| Asset | Source | Licence | Notes |
|---|---|---|---|
| Room shell (walls, floor, ceiling, door frame) | Custom, modelled in Blender | Own | Simple boxes; realism comes from textures and light |
| Wall finish | ambientCG painted plaster / plaster materials | CC0 | Warm off-white; 1K textures |
| Floor | ambientCG tiles (vitrified tile look common in Patna homes) or wood | CC0 | 1K |
| Fabrics (sofa, curtains) | ambientCG fabric | CC0 | 512–1K |
| Metal (fan, screws, geyser) | ambientCG metal | CC0 | 512 |
| Lighting environment | ambientCG HDRI (indoor/evening) | CC0 | Used for reflections only; main light baked |
| Sofa, side table, plant, rug, TV unit | Poly Pizza low-poly models | Mostly CC-BY (credit) / some CC0 — check each | Re-materialled in brand palette; credit on `/credits` |
| **Modular switchboard + plate** | **Custom** (generic Indian modular style, no brand marks) | Own | Hero object — highest detail |
| **Homeasy module** | **Custom** from ODM photos/CAD when available; placeholder box until then | Own | Must match the real product before launch |
| Ceiling fan | Custom (Indian 3-blade style; rarely found in free libraries) | Own | Animated rotation |
| Geyser | Custom (wall-mounted Indian geyser) | Own | Indicator light animates |
| Tube light / ceiling lamp | Custom or Poly Pizza | Own / per model | Emissive material for "on" |
| Phone with app UI | Custom low-poly phone + app screenshot texture | Own | Real app screens when available |

No third-party brand logos on any object (switches, TV, AC).

### 30.3 Art direction

- **Style:** "soft realism" — clean low-poly shapes with real textures and baked light, not photoreal. Keeps it fast and matches the flat logo.
- **Palette in scene:** walls warm white, floor light beige/grey tile, accents in Homeasy Blue (cushions, rug), amber only for light and the "on" rocker.
- **Lighting:** two baked lighting states (dusk and lights-on) blended in real time — cheap and beautiful.
- **Camera:** 35–40 mm lens look, slight elevation, room fills the right 60% of the hero on desktop; headline on the left over a navy-to-transparent panel for readability.

### 30.4 Technology

| Layer | Choice |
|---|---|
| Rendering | Three.js via React Three Fiber (fits the Next.js stack) + drei helpers |
| Model format | glTF binary (`.glb`) with Draco or meshopt geometry compression |
| Textures | KTX2 (Basis Universal) compressed, 512–1024 px; baked lightmaps for both light states |
| Animation | Camera and object animation baked in Blender or driven by GSAP ScrollTrigger; rocker/fan/emissive changes in code |
| Loading | Dynamically imported after the 2D hero has rendered (after LCP and `load`); progress shown as the switch "warming up" |
| Fallback | The current 2D hero (Tier A/B) — always rendered first; 3D replaces it only when ready and allowed |

### 30.5 When the 3D hero loads (device rules)

Load the 3D hero only if **all** are true:
- Viewport width ≥ 1024 px and a fine pointer (mouse/trackpad).
- WebGL2 available; GPU not flagged as low-end (e.g. via a lightweight GPU-tier check).
- `prefers-reduced-motion` is not set.
- Connection not on Save-Data and effective type is 4G or better.

Otherwise the visitor gets the 2D hero (which already has the full lights-on interaction).

### 30.6 Performance budget

| Item | Budget |
|---|---|
| Total 3D download (models + textures + code) | ≤ 2.5 MB, loaded after LCP |
| Triangles in view | ≤ 150,000 |
| Draw calls | ≤ 80 |
| Texture memory | ≤ 64 MB GPU |
| Frame rate | 60 fps on a mid-range laptop; pause rendering when the hero is off-screen or the tab is hidden |
| Page impact | Mobile Lighthouse score unchanged (3D never loads on mobile); desktop LCP still < 2.5 s (2D hero is the LCP) |

### 30.7 Accessibility

- The switch remains a real `<button role="switch" aria-checked>`; keyboard and screen-reader labels identical to the 2D hero.
- The canvas is decorative (`aria-hidden`); all meaning is in the HTML text beside it.
- "Reduce motion" toggle in the hero corner stops the camera and fan animation and shows the static lit state.
- Scroll pinning limited to one screen-height sequence; a "Skip animation" link jumps past it.

### 30.8 Team, effort and timeline (estimates)

| Work | Who | Effort |
|---|---|---|
| Art direction and storyboard sign-off | Founder + designer | 2–3 days |
| Custom models (switchboard, module, fan, geyser, room shell, phone) | Freelance 3D artist | 6–8 days |
| Texturing (ambientCG), Poly Pizza props, baked lighting (2 states) | 3D artist | 3–4 days |
| Optimisation (Draco/meshopt, KTX2, LODs) | 3D artist / developer | 2 days |
| Web build (R3F scene, interaction, scroll sequence, fallback logic) | Front-end developer | 6–8 days |
| QA on target devices, performance tuning | Developer | 2–3 days |
| **Total** | | **≈ 3–5 weeks** calendar time |

Budget: depends on freelancer rates; get 2–3 quotes from 3D artists (Blender + web/glTF experience) with this section as the brief. Starts **after** the main site launches — the 2D hero is enough for launch.

### 30.9 Cheaper alternative (if budget is tight)

Render the same scene in Blender as a **short image sequence or video** (dusk → lights on → exploded switch) and scrub it with scroll/click. Looks almost as good, no WebGL, but heavier to download (keep ≤ 3 MB with WebP sequence or AV1 video) and less interactive (no parallax).

### 30.10 Acceptance criteria

- [ ] 3D hero loads only under the 30.5 rules; otherwise the 2D hero shows with no errors.
- [ ] Lights-on interaction works by mouse and keyboard; all text readable in both states (WCAG AA).
- [ ] Scroll sequence (beats 4–5) can be skipped; reduced-motion respected.
- [ ] Budgets in 30.6 met on a mid-range laptop.
- [ ] Every Poly Pizza model listed on `/credits` with licence; `docs/assets.csv` updated.
- [ ] Homeasy module model matches the real product before public launch.
- [ ] No third-party brand marks in the scene.

---

*End of document — v3.9*
