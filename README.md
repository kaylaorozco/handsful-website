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
   - `KIT_API_KEY` — Kit (ConvertKit) v4 API key, server-side only
   - `KIT_FORM_ID` — the Kit form waitlist signups subscribe to
   - `PUBLIC_GA_MEASUREMENT_ID` — GA4 ID; GA stays off entirely until this is set
3. Point the `handsful.app` domain at the Vercel project.

## Structure

```
src/
  config.ts          ← site-wide config: CTA mode, store URLs, socials
  data/              ← editable content: FAQ, testimonials/press
  layouts/           ← BaseLayout (SEO/meta), LegalLayout
  components/        ← header, footer, waitlist form, store badges
  sections/          ← homepage sections in page order
  pages/             ← routes (/, legal pages, /waitlist-confirmed, /api/subscribe)
  styles/global.css  ← brand tokens from brand/style-guide.html
brand/               ← source brand assets + style guide (not served)
scripts/generate-og.mjs ← builds the OG share image from brand assets (npm run og)
scripts/generate-blobs.mjs ← regenerates the hero intro's blob morph paths (npm run blobs;
                             deterministic — paste the output into Hero.astro)
docs/LAUNCH-CHECKLIST.md ← everything to flip at launch time
```

## The waitlist pipeline (Kit, double opt-in)

The form POSTs to `/api/subscribe`, which validates the email (plus a honeypot and
basic per-IP rate limiting) and adds the subscriber to a Kit (ConvertKit) form via
the v4 API. The form markup is fully custom — no Kit embed, no "Powered by Kit"
branding.

- **Double opt-in is Kit's job.** Kit sends the confirmation email; the signup only
  counts once the visitor clicks the link. The form's success message says "check
  your inbox" accordingly, and repeat signups get a friendly "already on the list" /
  "check your earlier email" message.
- **`/waitlist-confirmed`** is the on-brand landing page after they confirm — set it
  as the confirmation redirect URL in the Kit form's settings.
- If `KIT_API_KEY` / `KIT_FORM_ID` are unset, `/api/subscribe` returns a
  "briefly unavailable" error (never a fake success) and logs to Vercel function logs.

## Switching the CTA to App Store / Play Store badges

One config change, no redesign — see the checklist in
[`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md) and the notes in
`src/components/StoreBadges.astro`.

## Analytics & cookie consent

GA4 (`src/components/Analytics.astro`) loads via **Google Consent Mode v2**: every
consent signal defaults to `denied` before gtag.js runs, so GA sets no cookies and
stores no identifiers out of the box. Consent comes from the site's own banner
(`src/components/CookieConsentBanner.astro`): Accept calls
`gtag('consent', 'update', { analytics_storage: 'granted' })` and only then do GA
cookies appear; Decline keeps the denied default and clears any existing `_ga*`
cookies. The choice persists in localStorage (`handsful_cookie_consent`) and is
applied before gtag.js loads via a bootstrap snippet in `BaseLayout.astro`, so
returning visitors' first hit is decided correctly. The "Cookie preferences" button
in the footer reopens the banner at any time.

## Legal pages

`/privacy-policy` and `/cookie-policy` carry final copy; `/terms-of-service` is still
a structural placeholder. All three stay `noindex` and out of the sitemap until the
indexing ticket ships — see the note at the top of `src/layouts/LegalLayout.astro`.

## SEO notes

- Meta/OG/Twitter tags: `src/layouts/BaseLayout.astro`
- Structured data (Organization, SoftwareApplication, FAQPage): `src/pages/index.astro`
- `sitemap-index.xml` is generated at build; `public/robots.txt` references it
- FAQ copy doubles as FAQPage schema — edit once in `src/data/faq.ts`
