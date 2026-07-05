# Handsful — marketing site

Pre-launch marketing and waitlist site for [Handsful](https://handsful.app), the baby
tracker built for twins, triplets & multiples.

Built with [Astro](https://astro.build) (static output, near-zero JS) and deployed on
**Vercel**. The only server-side code is one serverless function: `/api/subscribe`.

## Quick start

```bash
npm install
cp .env.example .env   # fill in as needed (see below)
npm run dev            # http://localhost:4321
npm run build          # generates OG image + static build into dist/
```

## Deploying (Vercel)

1. Push this repo to GitHub and import it in Vercel — the `@astrojs/vercel` adapter is
   already configured; no build settings needed.
2. Add environment variables in **Vercel → Project → Settings → Environment Variables**
   (see `.env.example`):
   - `WAITLIST_WEBHOOK_URL` — where signups are forwarded (see below)
   - `PUBLIC_GA_MEASUREMENT_ID` — GA4 ID; analytics stays off until this is set
3. Point the `handsful.app` domain at the Vercel project.

## Structure

```
src/
  config.ts          ← site-wide config: CTA mode, store URLs, socials, GA
  data/              ← editable content: features, FAQ, testimonials/press
  layouts/           ← BaseLayout (SEO/meta/analytics), LegalLayout
  components/        ← header, footer, waitlist form, store badges, cookie banner
  sections/          ← homepage sections in page order
  pages/             ← routes (/, legal pages, /api/subscribe)
  styles/global.css  ← brand tokens from brand/style-guide.html
brand/               ← source brand assets + style guide (not served)
scripts/generate-og.mjs ← builds the OG share image from brand assets
docs/LAUNCH-CHECKLIST.md ← everything to flip at launch time
```

## The waitlist pipeline (provider-agnostic)

The form POSTs to `/api/subscribe`, which validates the email (plus a honeypot for
bots) and forwards `{ email, source, timestamp }` as JSON to `WAITLIST_WEBHOOK_URL`.

- **Today:** point the env var at a Zapier/Make webhook or Google Apps Script that
  appends to a sheet — signups are collected with zero code changes.
- **Later (Mailchimp / ConvertKit / Supabase):** either keep the webhook pattern via
  their incoming-webhook/automation endpoints, or replace the single `forward()`
  function in `src/pages/api/subscribe.ts` with a native API call.
- If the env var is unset, signups are logged to Vercel function logs and the form
  still succeeds — the UX never breaks.

## Switching the CTA to App Store / Play Store badges

One config change, no redesign — see the checklist in
[`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md) and the notes in
`src/components/StoreBadges.astro`.

## Analytics & cookie consent

GA4 loads **only after** the visitor accepts the cookie banner
(`src/components/CookieConsent.astro` → `src/components/Analytics.astro`). Declining
sets no cookies at all. The banner links to `/cookie-policy`.

## Legal pages

`/privacy-policy`, `/cookie-policy`, `/terms-of-service` are structural placeholders
(clearly marked, `noindex`, excluded from the sitemap). When final copy lands, follow
the three-step note at the top of `src/layouts/LegalLayout.astro`.

## SEO notes

- Meta/OG/Twitter tags: `src/layouts/BaseLayout.astro`
- Structured data (Organization, SoftwareApplication, FAQPage): `src/pages/index.astro`
- `sitemap-index.xml` is generated at build; `public/robots.txt` references it
- FAQ copy doubles as FAQPage schema — edit once in `src/data/faq.ts`
