# Handsful — marketing site

Marketing and pre-order site for [Handsful](https://handsful.app), the baby
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
   - `KIT_FORM_ID` — the Kit form email signups subscribe to
   - `PUBLIC_GA_MEASUREMENT_ID` — GA4 ID; GA stays off entirely until this is set
3. Point the `handsful.app` domain at the Vercel project.

## Structure

```
src/
  config.ts          ← site-wide config: store URLs, Apple badge wording, socials
  data/              ← editable content: FAQ, testimonials/press
  layouts/           ← BaseLayout (SEO/meta), LegalLayout
  components/        ← header, footer, email signup form, store badges
  sections/          ← homepage sections in page order
  pages/             ← routes (/, legal pages, /waitlist-* signup status pages, /api/subscribe)
  styles/global.css  ← brand tokens from brand/style-guide.html
  assets/            ← bundled assets: store badges, hero photo
brand/               ← source brand assets + style guide (not served)
scripts/generate-og.mjs ← builds the OG share image from brand assets (npm run og)
docs/LAUNCH-CHECKLIST.md ← everything to flip at launch time
```

## The email signup pipeline (Kit, double opt-in)

The form POSTs to `/api/subscribe`, which validates the email (plus a honeypot and
basic per-IP rate limiting) and adds the subscriber to a Kit (ConvertKit) form via
the v4 API. The form markup is fully custom — no Kit embed, no "Powered by Kit"
branding.

- **Double opt-in is Kit's job.** Kit sends the confirmation email; the signup only
  counts once the visitor clicks the link. The form's success message says "check
  your inbox" accordingly, and repeat signups get a friendly "already on the list" /
  "check your earlier email" message.
- **`/waitlist-confirmed`** is the on-brand landing page after they confirm — set it
  as the confirmation redirect URL in the Kit form's settings. (The three
  `/waitlist-*` status routes keep those paths even though the copy no longer
  says "waitlist": the path is configured on Kit's side, so renaming them is a
  code + Kit change, done together or not at all.)
- If `KIT_API_KEY` / `KIT_FORM_ID` are unset, `/api/subscribe` returns a
  "briefly unavailable" error (never a fake success) and logs to Vercel function logs.

## Store badges and the two CTAs

The site has two calls to action, on purpose:

- **Hero + header — the App Store.** The official Apple badge, linking to
  `CTA.appStoreUrl` (`src/config.ts`). `CTA.appleBadge` picks which official
  badge it wears — `'download'` now the app has shipped — and the matching
  `CTA_LABEL` supplies the header button and footer link wording, so the art
  and the words can't drift apart.
- **Foot of the page — email.** `EmailSignup.astro`, for product news and the
  Android release.

Both stores require their **official, unmodified** badge artwork, which lives
in `src/assets/badges/` (in `src/`, not `public/`, so the bundler resolves it
and supplies each badge's intrinsic size and a fingerprinted URL). If the file
a badge expects isn't there, the hero renders a plain brand button with the
same words and `npm run build` prints a warning — see the notes in
`src/components/StoreBadges.astro` and the checklist in
[`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md).

## Analytics & cookie consent

GA4 (`src/components/Analytics.astro`) uses **Google Consent Mode v2 in "basic"
mode**: gtag.js is not injected — not even requested from the network — until
analytics consent is granted, so pre-consent (and forever after a Decline) Google
receives nothing at all. Consent comes from the site's own banner
(`src/components/CookieConsentBanner.astro`): Accept dispatches the consent-granted
event that makes the loader (`src/ga-snippet.ts`) inject gtag.js with ad signals
denied and `analytics_storage` granted; Decline stores the refusal and clears any
existing `_ga*` cookies. The choice persists in localStorage
(`handsful_cookie_consent`) and is read before `<Analytics />` renders via a
bootstrap snippet in `BaseLayout.astro`, so returning visitors who accepted are
tracked from their first hit. The "Cookie preferences" button in the footer reopens
the banner at any time.

## Legal pages

`/privacy-policy` and `/cookie-policy` carry final copy; `/terms-of-service` is still
a structural placeholder. All three stay `noindex` and out of the sitemap until the
indexing ticket ships — see the note at the top of `src/layouts/LegalLayout.astro`.

## SEO notes

- Meta/OG/Twitter tags: `src/layouts/BaseLayout.astro`
- Structured data (Organization, SoftwareApplication, FAQPage): `src/pages/index.astro`
- `sitemap-index.xml` is generated at build; `public/robots.txt` references it
- FAQ copy doubles as FAQPage schema — edit once in `src/data/faq.ts`
