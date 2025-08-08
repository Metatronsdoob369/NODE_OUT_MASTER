# Asset Generation + Marketplace — 14‑Day Launch Blueprint (v1)

*A pragmatic, one‑person launch plan with dual tracks: BUILD (product) × SELL (market). Assumes AI‑generated marketing assets + a marketplace for templates/packs, but adaptable to other asset types.*

---

## 0) Positioning (pick one to start)

- **Category:** AI Asset Studio + Marketplace
- **Wedge promise:** "Ship conversion‑ready assets in hours; sell the best to the market."
- **Who:** Indie founders & lean teams (pre‑PMF → early growth)
- **Outcome:** 10 conversion‑tested assets live + first \$1k GMV in 30 days
- **Taglines (test):**
  1. *Make. Test. Sell.*
  2. *From blank page to bankable assets.*
  3. *Your creative engine, plus a store.*

---

## 1) ICPs & Use Cases

- **ICP‑A (Creators):** Growth marketers/designers creating repeatable assets (LP sections, ad sets, email packs). *Goal:* monetize templates.
- **ICP‑B (Buyers):** SaaS founders, coaches, info‑product builders. *Goal:* acquire proven assets that convert.

**Core use cases:**

1. Generate ad sets + landing hero variants for a launch.
2. Spin a welcome sequence from a persona brief.
3. Buy a “tested pack” (copy + layout + images) with benchmarks.

---

## 2) Pricing & Packaging (v1)

- **Studio (SaaS):** \$39/mo Starter (200 credits), \$99/mo Pro (1,000 credits), \$299/mo Team (4,000 credits)
- **Marketplace:** 20% platform fee (intro 10% for first 90 days to seed supply). Creators set price (\$9–\$199 typical).
- **Credit logic:** 1 render = N credits (by asset type). Drafts free; export unlocked via credits or purchase.
- **Founding Creator deal:** 90/10 split for first 90 days + homepage feature + early analytics access.

---

## 3) MVP Scope (2 weeks buildable)

**Studio (generation)**

- Inputs: brand brief, persona, offer, tone.
- Outputs: ad copy sets (FB/Google/LinkedIn), LP hero sections, email welcome (3‑5), SEO briefs.
- Features: versioning, A/B labels, export (Markdown/HTML/CSV), watermark previews.

**Marketplace (supply/demand)**

- Creator onboarding (profile, payout, listing wizard)
- Listings: title, purpose, preview, license, price, changelog, proof (benchmarks/test results)
- Purchase + license delivery (download + clone into Studio)
- Reviews/ratings; simple refund flow

**Admin**

- Content moderation queue, DMCA takedown, featured curation

---

## 4) Tech Architecture (lean)

- **Frontend:** Next.js + Tailwind. Auth via Clerk/Auth0.
- **DB:** Firestore (Firebase). **Auto‑save** for Studio docs.
- **Storage:** Firebase Storage (originals + watermarked previews). CDN via Cloudflare.
- **Payments:** Stripe Checkout + **Stripe Connect (Express)** for creator payouts.
- **Webhooks:** Cloud Functions to sync orders, licenses, credit balances, payouts, and listing unlocks.
- **Search:** Algolia (listings, tags, creators). Fallback: Firestore + simple filters.
- **Observability:** Sentry + simple events to GA4 / PostHog.

**Core Collections (Firestore)**

```
/brands/{brandId}
/personas/{personaId}
/assets/{assetId}  // generated artifacts
/listings/{listingId}
/orders/{orderId}
/licenses/{licenseId}
/creators/{creatorId}
/reviews/{reviewId}
/users/{userId}/credits
```

**Listing schema (v1)**

```json
{
  "title": "SaaS Hero Section Pack v3",
  "type": "lp_section|ad_set|email_pack|seo_brief|bundle",
  "description": "7 hero variants with social proof blocks",
  "previews": ["gs://.../hero1.png"],
  "files": ["gs://.../export.zip"],
  "benchmarks": {"cvr": 0.086, "ctr": 0.023},
  "tags": ["saas","producthunt","launch"],
  "license": "NEC-Commercial-Perpetual",
  "price": 49,
  "creatorId": "",
  "version": "3.0.1",
  "changelog": "Added outcome-first layout",
  "status": "pending|live|suspended"
}
```

**Flow: Claude/LLM → Studio → Marketplace**

1. Generate asset draft; save JSON + preview; mark `status=draft`.
2. QA Gate (rubric) → approve → `status=ready`.
3. If seller wants to monetize → create listing; attach preview + license; set price; submit.
4. Moderator approve → `status=live` → indexed to Algolia.
5. Buyer purchases → webhook issues `license` + clone to buyer’s Studio workspace.

---

## 5) Legal & Policy (not legal advice)

- **License:** Non‑exclusive, perpetual, commercial use; no resale outside the platform; disclose AI usage.
- **DMCA:** Clear takedown process + repeat‑infringer policy.
- **Content Rules:** Ban deceptive claims, regulated categories without substantiation, disallow disallowed topics.
- **Attribution:** Optional but encouraged; creators may include a small credit file.

---

## 6) Quality Gates (rubrics)

**Ad Set Gate (1–5 each):** Clarity, Specificity, Proof, Persona fit, CTA strength, Platform compliance. **LP Section Gate:** Above‑fold clarity (<5s), Credibility (proof present), Scannability, Message‑match with ad, Visual hierarchy. **Email Pack Gate:** Value density, Spam trigger scan, Narrative flow, Clear next step.

Artifacts failing a gate return with exact edit suggestions.

---

## 7) Cold‑Start Strategy (Supply × Demand)

**Supply (Creators) first 7–10 days**

- Invite 20 founding creators (growth copywriters/designers). Offer 90/10 split for 90 days + homepage feature.
- Seed 60–100 high‑quality listings (3–5 per creator). Curate *tested packs* with benchmarks.
- Weekly “Creator Spotlight” and early analytics access.

**Demand (Buyers) days 7–14**

- ‘Launch Stack’ bundles for specific goals (e.g., *Product Hunt Launch Pack*, *Webinar Funnel Pack*).
- Guarantee: "If your CVR doesn’t improve in 14 days using a purchased pack, we’ll swap or credit you."
- Partner with 3 micro‑communities (SaaS indie circles, cohorts, newsletters) for bundle codes.

---

## 8) Go‑to‑Market — 14‑Day Plan

**Day 1–2 (Prep)**

- Lock ICP + promise; write 1‑page offer.
- Build waitlist page + creator application.
- Set Stripe, Connect (Express), Firebase, Storage, basic moderation dashboard.

**Day 3–5 (Supply)**

- Outbound to 50 top creators (DM/email + Loom micro‑audit). Target 20 yes’s.
- Creator onboarding sessions; publish first 40 listings.

**Day 6–7 (Demand preheat)**

- Publish 2 bundles with founders’ use cases; 3 case mini‑studies.
- Start paid test: \$500 across Meta/LinkedIn search lookalikes.

**Day 8 (Soft Open)**

- Invite‑only access to waitlist; capped to 100 buyers. Collect NPS + first‑sale time.

**Day 9–11 (Iterate)**

- Kill weak categories; double down on high CTR tags.
- Add “proof badge” for listings with verified benchmarks.

**Day 12–14 (Public Launch)**

- Product Hunt + LinkedIn thread + 3 partner newsletters.
- Public coupon (first 200 buyers). Publish revenue share stats for creators.

---

## 9) Metrics to Instrument (daily)

- **GMV, Take‑rate, Refund rate**
- **Creator**: applications, activation %, listings/creator, time‑to‑first‑sale, GMRR/creator
- **Buyer**: time‑to‑first‑value, purchase CVR, attach rate (Studio usage after purchase)
- **Traffic**: CTR by tag, LP CVR, bundle CVR
- **Quality**: gate pass rate, review average, dispute rate

Alert thresholds: CPA warn, CVR drop, refund spike, creator inactivity.

---

## 10) Scripts & Assets

**Creator Recruit (DM/email)**

> Subject: Feature your best converting pack?
>
> Building a new studio + marketplace for conversion‑ready assets. Found your work on {where}. We’re featuring 20 founding creators at 90/10 for 90 days + homepage placement. Interested in listing 3–5 packs (LP hero, ad sets, emails) next week? Quick 10‑min onboarding?

**Buyer DM**

> Noticed you’re shipping {product}. I have a Launch Pack (hero + ad set + emails) used by {peer ICP}. Want a preview + benchmarks? If it doesn’t lift CVR in 14 days, I’ll swap/credit.

**Launch LP (sections)**

- Hero: *Make. Test. Sell.* → CTA: Start free / Browse Packs
- Proof: creator logos, GMV to‑date, review snippets
- How it works: Generate → Gate → Publish/Buy → Iterate
- Bundles: PH Launch, Webinar, SaaS Trial
- FAQ: licensing, refunds, AI disclosure, payouts

---

## 11) Risk & Mitigation

- **Low‑quality flood:** strict gates + featured curation + limit to invited creators first.
- **IP issues:** DMCA workflow, AI disclosure, watermark previews.
- **Demand mismatch:** bundle offers aligned to specific launches; targeted partnerships.
- **Cash flow:** delay payouts 7 days to cover refunds.

---

## 12) What to Build Today (checklist)

-

---

## 13) Where I can plug in (fast wins)

1. Write the Launch LP + two bundle pages (today).
2. Draft 5 creator DMs + 5 buyer DMs tailored to your ICP.
3. Seed 10 high‑quality listings from your own assets.
4. Set up Stripe Connect + Firebase rules and review together.

---

## 14) Open Questions (to tailor v2)

- Primary asset types at launch? (LP sections, ads, emails, images, datasets, code?)
- Any regulated verticals? (changes compliance + gates)
- Refund policy appetite? (swap vs credit vs cash)
- Which communities/newsletters can we partner with week 2?
- Benchmarks you already have for initial “tested packs”?

