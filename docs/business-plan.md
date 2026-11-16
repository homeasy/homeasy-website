# Homeasy — Business Plan (Retrofit-First Model)

**Version 3.0 · 15 November 2026 · Draft for founder review**

| Field | Detail |
|---|---|
| Company | Homeasy Automation Private Limited |
| Incorporated | 2025, Patna, Bihar, India |
| Founder & CEO | Vishwjeet Narayanan |
| Tagline | One App. Every Device. Easy. |
| Status | Pre-launch; strategy changed to retrofit-first (this document) |

> **How to read this plan.** Figures marked **[TBC]** are deliberately left blank — they must come from real ODM quotes, pilot installations and market research, not guesses. Items are labelled **Decided**, **Proposed** or **Open** so decisions and suggestions stay separate.

---

## 1. Executive summary

Most Indian homes are **traditional homes** — standard modular switchboards, ordinary fans, lights, geysers and ACs, and no smart devices at all. Replacing switchboards or rewiring is expensive and messy, so smart homes remain out of reach for most families.

**Homeasy converts traditional homes into smart homes without changing switches or rewiring.** We install compact **smart retrofit modules inside the existing electrical switchbox**, behind the switches the family already uses. The physical switches keep working exactly as before; the home also becomes controllable from the **Homeasy app**, by schedule, scene and (later) voice.

Homeasy sells a **complete, done-for-you solution**:

1. **Free home survey** — check wiring, switchbox depth, neutral availability and loads.
2. **Homeasy retrofit modules** — our own branded hardware (ODM-manufactured).
3. **Professional installation** — by trained Homeasy electricians.
4. **Homeasy app** — free for every Homeasy customer, Android and iOS.
5. **After-sales support** — warranty, service visits and (later) annual maintenance plans.

**Revenue starts from day one** through hardware and installation, then grows through B2B projects (builders, interior designers, electricians), B2G projects (government buildings, quarters, hostels, offices), and recurring service plans.

**Launch:** India only, starting with a **Patna pilot**, launching sooner than the earlier 4-month plan with a smaller MVP.

---

## 2. What changed (v2 → v3)

| Area | Previous plan (v2) | New plan (v3) | Status |
|---|---|---|---|
| Target customer | Homes already owning several smart brands | **Traditional homes** (plus builders, designers, government) | Decided |
| Core product | Free multi-brand app | **Retrofit modules + installation + app** | Decided |
| Hardware | None in Phase 1 | **Own Homeasy devices in Phase 1** | Decided |
| Installation | Later | **Paid installation from day one** | Decided |
| Channels | D2C via app/waitlist | **D2C + B2B + B2G** | Decided |
| Markets | India, then US/UAE/Japan | **India only** | Decided |
| Timeline | ~4 months | **Launch sooner with a smaller MVP** | Decided |
| App's role | The product itself | Controls Homeasy modules; multi-brand control becomes a later feature | Proposed |
| Free 5-device plan | Core offer | Not needed for Homeasy customers (app free with hardware); may return for non-customers later | Proposed |
| Budget | Zero-cost | Hardware business requires working capital | Reality check (Section 13) |

---

## 3. Problem

| Problem | Detail |
|---|---|
| Smart homes need new switchboards or rewiring | Expensive, dusty, disruptive; landlords and families avoid it |
| Existing smart products assume a "new build" | Many target new projects or premium villas |
| DIY retrofit is risky | Generic modules sold online need electrical knowledge; wrong installation causes failures and safety risks |
| Poor after-sales | Buyers of cheap modules get no installation or support |
| Indian realities | Power cuts, voltage fluctuation, older wiring, elderly family members who prefer physical switches |
| Energy bills | Geysers, ACs and motors left running waste electricity |

---

## 4. Solution

### 4.1 The Homeasy promise

> **"Make your existing home smart — without changing your switches or rewiring."**

| Principle | What it means |
|---|---|
| Keep your switches | Modules sit inside the switchbox; existing switches still work |
| No rewiring | Works with the existing wiring (after survey) |
| Done for you | Survey, installation, setup and app onboarding by Homeasy |
| Always works | Physical switches work even if the internet or app is down |
| One app | Whole home in one app; later, other smart brands too |
| Built for India | Fans, geysers, ACs, motors, inverters, power cuts |

### 4.2 Customer journey

1. Enquiry (website, WhatsApp, call, electrician/designer referral)
2. **Free home survey** — technician checks switchboxes, neutral wire, loads, Wi-Fi coverage
3. **Quote** — package or room-by-room, with clear pricing
4. **Installation** — typically within [TBC] hours for a [TBC]-room home
5. **App onboarding** — family accounts, rooms, scenes, schedules
6. **Support** — warranty, service visits, (later) AMC

### 4.3 Proposed product line-up (Phase 1 MVP)

| Module | Purpose | Notes | Status |
|---|---|---|---|
| Smart relay module (multi-channel, e.g. 2/4-gang) | Lights and small loads | Must fit shallow Indian switchboxes | Proposed |
| Smart fan module | Fan on/off + speed control | Fan speed control is essential in India | Proposed |
| Heavy-load module (16A) | Geyser, AC, motor | Heat and safety critical | Proposed |
| No-neutral variant | Older homes without neutral at switch | Technically harder; may come after MVP | Proposed / Open |
| IR blaster | AC/TV control without rewiring | Plug-in, easy upsell | Proposed |
| Smart plug | Quick add-on | Optional | Proposed |

Final line-up depends on ODM catalogue, certification and pilot learnings.

### 4.4 Homeasy app (MVP scope — proposed)

| Feature | MVP |
|---|---|
| Account, home and rooms setup | Yes |
| Add/control Homeasy modules over Wi-Fi | Yes |
| Fan speed control | Yes |
| Scenes (e.g. "Good morning", "Sleep") | Yes |
| Schedules (geyser, outdoor lights) | Yes (high value for Indian homes) |
| Family sharing | Yes (basic) |
| Local control when internet is down | Target — depends on firmware choice |
| Energy monitoring | Later (needs metering hardware) |
| Voice assistants | Later |
| Third-party brands (multi-brand unification) | Later — original Homeasy vision kept as a future feature |
| Payments in app | No |

---

## 5. Technology decision: module firmware (OPEN — most important decision)

| Option | Description | Pros | Cons |
|---|---|---|---|
| **A. ODM modules with Tuya firmware** | Buy ready modules running Tuya's platform; build Homeasy app on Tuya SDK | Fastest to market; proven hardware/firmware; certifications often available from ODM | Tuya licensing/app costs (conflicts with zero budget); risk of looking like a Smart Life clone; less control over data, local control and roadmap |
| **B. ESP32-based modules with Homeasy firmware** | ODM manufactures hardware to spec (ESP32 chip); Homeasy writes/flashes own firmware | Own the stack; no platform fees; local control possible; builds on earlier ESP32 hub work; stronger long-term valuation | Slower; firmware, OTA updates, security and reliability are Homeasy's responsibility; needs embedded engineering |
| **C. Hybrid** | Pilot with Option A, migrate to B | Learn market fast | Two platforms; customers may need migration |

**Recommendation (proposed): Option B**, because it fits the decisions to avoid a Tuya clone and avoid paid platforms, and gives Homeasy its own technology. If speed becomes critical, use a very small Option A pilot (5–10 homes) only for market learning.

**Non-negotiables for either option:** physical switch always works; safe operation under Indian voltage fluctuation; secure pairing; OTA updates; clear warranty.

---

## 6. Target market

### 6.1 Segments

| Segment | Description | Channel | Priority |
|---|---|---|---|
| **Traditional homes (D2C)** | Existing apartments and independent houses, owner-occupied, middle and upper-middle income | Website, WhatsApp, social, referrals, electricians | P1 |
| **Interior designers & architects** | Renovation projects wanting smart features without rewiring | Partner programme, commission/discount | P1 |
| **Electricians & installers** | Local electricians who can refer or install under Homeasy | Installer partner network, training | P1 |
| **Builders & developers** | Ready or under-construction projects wanting "smart-ready" upgrades | B2B projects, bulk pricing | P2 |
| **Government / B2G** | Government quarters, hostels, offices, schools, hospitals — energy saving and control | Tenders, GeM, direct proposals | P2 (long sales cycles) |
| **Small commercial** | Shops, clinics, offices, PGs and hostels | Direct sales | P3 |

### 6.2 Launch geography

- **Pilot:** Patna (home city — fast installs, fast feedback, low travel cost).
- **Next:** other Bihar cities and nearby markets [TBC], then Tier-1/Tier-2 cities via installer partners.
- **International:** removed from current plan (India only).

### 6.3 Market sizing (method — numbers TBC)

| Level | Definition | How to estimate |
|---|---|---|
| TAM | Urban Indian households with electricity and modular switchboards | Census/NFHS household data × urban share × modular-switch share |
| SAM | Owner-occupied homes in target income bands in launch states | TAM × ownership × income filters |
| SOM (3 years) | Homes Homeasy can realistically install | Installer capacity × installs/day × working days, cross-checked with pilot conversion rates |

Bottom-up capacity (installer teams × installs/day) is more reliable than top-down market reports for a services business.

---

## 7. Business model and revenue streams

| Stream | Description | When | Status |
|---|---|---|---|
| **Hardware sales** | Homeasy modules sold per room/package | Day one | Decided |
| **Installation** | Survey free; installation charged per module/room/package | Day one | Decided |
| **B2B projects** | Bulk modules + installation for builders, designers | Day one (pilot deals) | Decided |
| **B2G projects** | Government buildings, quarters, hostels | After certifications/registrations | Decided (timing TBC) |
| **Extended warranty / AMC** | Annual service and support plans | After pilot | Proposed |
| **Add-ons** | IR blasters, sensors, smart plugs | Day one / later | Proposed |
| **App premium** | Optional premium for non-Homeasy users (multi-brand) | Later | Proposed / Open |

**App policy (proposed):** the Homeasy app is **free with all features for Homeasy customers**, consistent with the earlier decision that hardware buyers get the software free with premium features included.

---

## 8. Pricing strategy (structure — prices TBC)

| Offer | Contents | Price |
|---|---|---|
| Free home survey | Wiring check, recommendations, quote | Free (Patna); [TBC] outside service area |
| **Smart Room** | Modules for one room (lights + fan) + installation + app | [TBC] |
| **Smart Essentials** | Key rooms + geyser + one AC (IR) | [TBC] |
| **Full Smart Home** | Whole home | [TBC] — quote |
| Per-module add-on | Extra module installed | [TBC] |
| B2B project pricing | Volume tiers | [TBC] |
| AMC | Yearly service plan | [TBC] (later) |

**Pricing inputs needed:** ODM unit cost (at MOQ), freight and duty if imported, certification cost amortised, installer cost per visit, warranty reserve (% of hardware), GST, target gross margin [TBC], competitor benchmark.

**Positioning:** priced above generic online modules (because installation, warranty and support are included) and below premium automation brands.

---

## 9. Go-to-market plan

### 9.1 Phase A — Patna pilot (first 5–10 homes)

| Activity | Detail |
|---|---|
| Demo setup | Office or partner home showing modules behind normal switches |
| Pilot customers | Friends, network, early enquiries — discounted in exchange for feedback, photos and testimonials (real ones) |
| Electricians | Recruit and train 2–3 trusted electricians |
| Learn | Switchbox depth, neutral availability, failure rates, install time, customer questions |

### 9.2 Phase B — Patna commercial launch

- Website relaunch with "Book a free home survey".
- WhatsApp Business for enquiries and support.
- Google Business Profile, local SEO ("smart home Patna").
- Instagram/YouTube reels: before-and-after installs, "same switches, now smart".
- Designer and electrician referral programme.
- Housing society demos and RWA tie-ups.

### 9.3 Phase C — B2B and B2G

| Channel | Approach |
|---|---|
| Builders | Smart-ready flat upgrade packages; show-flat installations |
| Interior designers | Trade pricing, co-branded proposals, quick installs during renovation |
| Government | Register on GeM [TBC]; DPIIT startup recognition [TBC] for procurement benefits; energy-saving pitch for quarters, hostels, offices; Bihar startup ecosystem connections |

### 9.4 Phase D — Expansion within India

Installer partner model in new cities: Homeasy supplies modules, training, app and support; local partners install.

---

## 10. Operations

| Area | Plan |
|---|---|
| Sourcing | Shortlist 2–3 ODMs; compare MOQ, unit cost, module size, certification support, firmware flexibility |
| Quality control | Incoming inspection, burn-in testing before installation |
| Inventory | Start small (pilot batch) to protect cash |
| Installation | Survey checklist, installation SOP, photo documentation, safety checklist |
| Installer training | Wiring checks, neutral detection, load limits, app onboarding |
| Support | WhatsApp reply within **30 minutes** (working hours) and technician visit within **24 hours** in Patna (decided); replacement process |
| Warranty | **3 years** on Homeasy modules (decided); replace-first policy; confirm ODM supplier warranty matches |
| Data & app | Privacy policy aligned with DPDP Act; secure device pairing |

---

## 11. Compliance and registrations (verify with experts)

| Item | Why | Status |
|---|---|---|
| BIS certification | Many electrical/electronic products sold in India require it — confirm category for modules | Open |
| WPC (ETA) approval | Products with Wi-Fi radios | Open |
| GST registration | Billing hardware and services | [Confirm] |
| Electrical safety | Installer qualifications, local electrical rules | Open |
| DPIIT startup recognition | Procurement and tax benefits | [Confirm] |
| GeM seller registration | Government procurement | Open |
| Trademark "Homeasy" | Brand protection | [Confirm] |
| Product liability / insurance | Hardware inside walls carries risk | Open |
| Privacy (DPDP Act 2023) | App and customer data | Open |

---

## 12. Team and hiring needs

| Role | When | Notes |
|---|---|---|
| Founder & CEO | Now | Strategy, sales, partnerships, operations |
| Embedded/firmware engineer | Immediately if Option B | Critical hire or contractor |
| Mobile app developer (Android/iOS) | Now | Cross-platform recommended for speed [TBC] |
| Backend developer | Now / part-time | Device cloud, accounts, OTA |
| Installation lead + 2–3 electricians | Pilot | Can start as contracted partners |
| Sales/BD (B2B/B2G) | After pilot | Builders, designers, government |
| Customer support | After launch | Can be founder + one person initially |

---

## 13. Financial plan (framework)

> Numbers must be built from real ODM quotes and pilot data. The earlier fundraising target discussed was ₹30–50 lakh; it should be re-validated for a hardware + installation business, which needs more working capital than an app-only plan.

### 13.1 Unit economics per home (template)

| Line | Value |
|---|---|
| Hardware revenue | [TBC] |
| Installation revenue | [TBC] |
| Hardware cost (landed) | [TBC] |
| Installer cost (time + travel) | [TBC] |
| Warranty reserve | [TBC] |
| Payment/GST effects | [TBC] |
| **Gross margin per home** | [TBC] |
| Customer acquisition cost | [TBC] |
| **Contribution per home** | [TBC] |

### 13.2 Use of funds (structure)

| Bucket | Purpose |
|---|---|
| Product development | Firmware, app, backend, hardware samples |
| Certification | BIS/WPC testing and fees |
| Inventory | First production batch |
| Installation team | Training, tools, salaries/contracts |
| Marketing | Demo setup, local marketing, content |
| Working capital buffer | B2B/B2G payment delays |

### 13.3 Cash-saving tactics

- Pilot batch before full MOQ.
- Advance payment or deposit on installation orders.
- Contracted electricians before full-time hires.
- Use startup credits and grants already applied for (cloud, AI, storage programmes).

---

## 14. Milestones (India only — dates TBC)

| Milestone | Status |
|---|---|
| Company incorporated (2025) | Done |
| Strategy changed to retrofit-first | Done (Nov 2026) |
| Firmware decision (Option A/B/C) | Open |
| ODM shortlist and samples | Next |
| MVP app (Homeasy modules only) | Next |
| Pilot: 5–10 homes in Patna | Next |
| Certifications started | Next |
| Patna commercial launch | Planned |
| First B2B project (designer/builder) | Planned |
| GeM/B2G readiness | Planned |
| Installer partner model in new cities | Planned |
| Multi-brand app features, energy monitoring, voice | Later |

---

## 15. Competition and differentiation

| Type | Examples | Homeasy's edge |
|---|---|---|
| Generic online retrofit modules | Many Tuya-based brands | Survey + professional installation + warranty + local support |
| Indian smart-home brands | Wozart, Oakter, Hogar, Wipro | Retrofit-first, done-for-you, Patna/Bihar-first focus, service quality |
| Premium automation | High-end integrators | Affordable, no rewiring, faster |
| Platforms | Google Home, Alexa | Works alongside them (voice later); Homeasy handles the hardware they can't install |

**Moat over time:** installation know-how for Indian switchboxes, installer network, own firmware (if Option B), customer trust and service data.

---

## 16. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Working capital for inventory | Small pilot batch; deposits; fundraise sized for hardware |
| Switchbox fit / no-neutral homes | Survey-first; multiple module variants; decline unsuitable boxes honestly |
| Heat/safety failures | Burn-in tests, load limits, quality ODM, installer SOP |
| Certification delays | Start early; choose ODM with existing certifications |
| Installer quality | Training, checklists, photo audits, customer feedback |
| Firmware reliability (Option B) | Hire embedded expertise; staged OTA rollouts; extensive pilot testing |
| Cheap competitors | Sell the service, not just the module |
| B2G long payment cycles | Keep B2G small until cash flow is stable |
| Founder bandwidth | Focus: retrofit + Patna first; pause other ventures' time where possible |

---

## 17. KPIs

| KPI | Definition |
|---|---|
| Survey bookings / week | Leads from all channels |
| Survey → order conversion | % of surveys that become orders |
| Average order value | Revenue per home |
| Gross margin per home | From Section 13.1 |
| Install time per room | Operational efficiency |
| Failure/return rate (90 days) | Hardware and install quality |
| App activation rate | % of installed homes actively using the app |
| Customer satisfaction / referrals | NPS-style score, referral share |
| B2B pipeline | Designer/builder projects in pipeline |

---

## 18. Open decisions

| # | Decision | Owner |
|---|---|---|
| D1 | Firmware: Option A (Tuya), B (own ESP32) or C (hybrid) | Founder |
| D2 | MVP module line-up (relay, fan, 16A, IR; no-neutral now or later) | Founder + ODM |
| D3 | ODM shortlist and pilot batch size | Founder |
| D4 | Package prices and installation charges | Founder (after quotes) |
| D5 | Warranty term — **resolved: 3 years** | Founder |
| D6 | Pilot timeline and launch date | Founder |
| D7 | Free-plan policy for non-customers (keep 5-device free app or drop) | Founder |
| D8 | Fundraising amount for hardware model | Founder |
| D9 | Installer model: employees vs contracted partners | Founder |
| D10 | B2G entry timing (GeM, DPIIT) | Founder |

---

*Compliance items in this plan are general guidance; confirm requirements with a certification consultant, CA and lawyer.*
