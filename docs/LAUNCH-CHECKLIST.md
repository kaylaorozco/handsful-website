# Launch checklist

Everything that changes when Handsful goes from waitlist → live app.

## Domain email

- [ ] Set up role inboxes (or aliases forwarding to one inbox) at the mail/domain
      provider for every address in `EMAILS` in `src/config.ts`:
      `hello@`, `privacy@`, `support@handsful.app`
- [ ] Send a test email to each before the pages referencing them go live

## 2–4 weeks out: pre-order / pre-registration goes live

- [ ] Download official badge artwork (both stores require unmodified official art):
  - Apple: <https://developer.apple.com/app-store/marketing/guidelines/> → save as `public/images/badges/app-store.svg`
  - Google: <https://play.google.com/intl/en_us/badges/> → save as `public/images/badges/google-play.svg`
- [ ] In `src/config.ts`: set `CTA.appStoreUrl` and `CTA.playStoreUrl`
- [ ] In `src/config.ts`: flip `CTA.mode` from `'waitlist'` to `'stores'`
      (every CTA on the site swaps automatically; a badge only renders if its URL is set)
- [ ] Email the waitlist announcing pre-order

## Legal copy lands

- [ ] Replace placeholder content in `src/pages/{privacy-policy,cookie-policy,terms-of-service}.astro`
- [ ] Set `placeholder={false}` on each finished page (removes banner + noindex)
- [ ] Remove finished pages from the sitemap `filter` in `astro.config.mjs`
- [ ] Add a `lastUpdated` date to each page

## Analytics

- [ ] Set `PUBLIC_GA_MEASUREMENT_ID` in Vercel env vars (all environments)
- [ ] Verify: GA network requests fire only AFTER accepting the cookie banner
- [ ] Update `/cookie-policy` with the actual GA4 cookie table

## Social proof

- [ ] Add real testimonials to `src/data/testimonials.ts` (section auto-appears)
- [ ] Add press mentions (+ logos under `public/images/press/`) as they land

## At launch

- [ ] Update FAQ answers that reference "launching soon" (`src/data/faq.ts`)
- [ ] Add `Offer` (price) and later `AggregateRating` to the SoftwareApplication
      schema in `src/pages/index.astro`
- [ ] Fill in social profile URLs in `src/config.ts` (footer placeholders become links)
- [ ] Consider swapping the hero art for real app screenshots (per brand imagery
      rules: warm-toned, natural, never staged/stock)
