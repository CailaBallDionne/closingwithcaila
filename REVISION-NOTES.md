# Closing With Caila — Revision Notes
## Logged: May 2026 | Status: PENDING — do not rebuild until instructed

---

## 1. FIXES

### Copyright
- Change all footer copyright lines from:
  "© 2025 Closing With Caila"
  to:
  "© 2026 Caila Ball-Dionne"
- Applies to: index.html, buyers.html, sellers.html, blog.html, faq.html, contact.html

### DRE Number
- Replace all instances of CA DRE #00000000 with: CA DRE #02439602
- Applies to all pages

### Text box width on Buyers and Sellers pages
- The two-column intro cards (.two-cards / .info-card) are rendering too narrow
- Fix: increase max-width on .two-cards or adjust padding on .info-card
- Also check .process-inner max-width — may be too constrained on mid-size screens

---

## 2. BRANDING & IDENTITY

### Full name
- Use "Caila Ball-Dionne" more throughout the site, not just in copyright
- Specifically: About section, Contact page hero, meta descriptions, page titles
- Example: page title → "Caila Ball-Dionne | Southern California Real Estate Agent"

### eXp and Borges Real Estate Team
- Add to About section and footer: "Caila Ball-Dionne is a licensed California real estate agent with eXp Realty, proudly part of the Borges Real Estate Team."
- Add brokerage name to footer for DRE/NAR compliance (see compliance section below)
- Consider a small "Part of the Borges Real Estate Team at eXp Realty" line under logo or in footer

### Instagram handle vs. business name
- "Closing With Caila" is a personal brand/handle, not a registered business
- Adjust any language that implies it's a company (e.g. "© Closing With Caila" → "© Caila Ball-Dionne")

---

## 3. COMPLIANCE — California DRE & NAR Rules

### Required footer disclosures (every page):
Per CA DRE and NAR rules, every page must display:
- Full legal name: Caila Ball-Dionne
- License number: CA DRE #02439602
- Brokerage name: eXp Realty (required — agent cannot advertise without broker name)
- Equal Housing Opportunity logo or text (NAR requirement)

Footer should read something like:
"Caila Ball-Dionne | CA DRE #02439602 | eXp Realty | Equal Housing Opportunity | © 2026"

### Buyer Representation Agreement disclosure (per AB 2992 / DRE Advisory Nov 2024):
- The Buyers page currently says "buyers typically pay no direct commission" — this is outdated and potentially non-compliant
- Must reflect new reality: buyers now sign a Buyer-Broker Representation Agreement (BBRA) before touring, compensation is negotiated directly between buyer and agent, and seller may or may not cover it as a concession
- New language for Buyers page FAQ item on cost:
  Per AB 2992 (effective Jan 1, 2025), California buyers are required to sign a Buyer-Broker Representation Agreement before or at the time of making an offer. This agreement spells out services and compensation clearly upfront. We'll discuss compensation in our first conversation — there are several options depending on the transaction.
- Also update the FAQ page answer on buyer cost to reflect this

### NAR Code of Ethics / advertising rules:
- Cannot use "best" in claims without substantiation — review copy for superlatives
- "Always available" type language is fine but should be softened (client notes this too)
- Testimonials: if using real client quotes, need written consent on file

---

## 4. SEO / AEO PRIORITIES
(In priority order — work these into page copy, meta descriptions, headings, and eventually schema)

1. La Crescenta realtor / real estate agent
2. Foothills realtor / real estate agent (covers La Crescenta, La Canada, Glendale foothills)
3. Best realtor for first-time buyers (La Crescenta / Foothills)
4. Modern real estate marketing / high-tech real estate marketing ("modern" likely better SEO)
5. La Canada Flintridge real estate agent
6. Burbank real estate agent

### SEO implementation notes:
- "La Crescenta realtor" should appear in: page title, H1 or H2 on home page, meta description, About section, at least one FAQ answer
- "Foothills" is a good umbrella term that covers multiple cities — use it consistently
- First-time buyers: already have good content here — just need to geo-target it ("first-time homebuyers in La Crescenta")
- Modern marketing: add a section or card on the home page about tech-forward marketing approach (YLOPO, social, etc.) — this differentiates from older agents
- La Canada and Burbank: mention in service area text, not worth separate pages yet
- Do NOT spread equally across all 6 — weight heavily toward La Crescenta and Foothills

### Page-level SEO targets:
- index.html:      La Crescenta realtor, Foothills real estate
- buyers.html:     First-time buyers La Crescenta, Foothills home search
- sellers.html:    Sell home La Crescenta, Foothills home seller
- faq.html:        Long-tail question queries, first-time buyer questions
- blog.html:       Info hub, real estate tips Southern California

---

## 5. COPY ADJUSTMENTS

### "Always available" → soften
- Current: implied always-on availability
- Change to something like: "Responsive, not robotic. You'll hear back from me the same day — usually within the hour."
- Or: "I keep my client list intentionally manageable so I can actually show up for each one."

### Buyers page — expand beyond pre-approval
Per DRE advisory, the buying process now starts with the Buyer-Broker Representation Agreement.
New step 1 should be:
  "Sign a Buyer Representation Agreement
   California law now requires a signed agreement before we tour any property together. This protects you — it spells out exactly what services I provide, how compensation works, and what you can expect from me. We review it together before you sign anything."
Then move pre-approval to step 2.

### Use "Caila Ball-Dionne" more in body copy
- Home hero subtext or about section should include full name naturally
- "I'm Caila Ball-Dionne, a licensed real estate agent serving La Crescenta and the Foothills area..."

---

## 6. FORMATTING BUGS TO FIX
- Buyers page: .two-cards info cards too narrow — fix CSS
- Sellers page: same issue
- Verify .process-inner renders at comfortable reading width on 13" laptops

---

## 7. ADDITIONAL CONFIRMED DETAILS

### Borges Real Estate Team
- Proper name: "The Borges Real Estate Team at eXp"
- Feature in About section and footer
- Link out to their main site — opens in new tab (confirm URL before rebuilding)

### Marketing background
- Caila has 20+ years of marketing agency experience
- PRIMARY differentiator — lead with it in About section and an approach card
- Angle: most agents list homes and wait. Caila approaches selling like a marketer:
  positioning, targeting, presentation, and channels. Rare and real advantage.
- Works both ways: sellers get a proper marketing strategy, not just an MLS listing.
  Buyers get an agent who understands how properties are presented and priced.

### Testimonials
- Remove section entirely — no placeholder, no "coming soon"
- Add back cleanly when real quotes exist

### Contact form
- Formspree submissions go to: caila@theborgesrealestateteam.com
- Note this in contact.html setup instructions

### Availability copy (confirmed)
- Use: "Responsive, not robotic. You'll hear back from me the same day, usually within the hour."

---

## STATUS: READY TO REBUILD WHEN CAILA SAYS GO
