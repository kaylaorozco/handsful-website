# Development

Setup, deployment, and implementation notes for the Handsful marketing site.

Built with [Astro](https://astro.build) (static output, near-zero JS) and deployed on
**Vercel**. The only server-side code is one serverless function: `/api/subscribe`.

## Quick start

```bash
npm install
cp .env.example .env   # fill in as needed (see below)
npm run dev            # http://localhost:4321
npm run build          # generates OG image + static build into dist/
```

## Environment variables

All three are optional locally — the site builds and runs without them. See
`.env.example` for the annotated versions.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `KIT_API_KEY` | Server-side only | Kit (ConvertKit) v4 API key. Read through `astro:env/server` with `access: 'secret'`, so it can never reach the client bundle. |
| `KIT_FORM_ID` | Server-side only | The Kit form email signups subscribe to. |
| `PUBLIC_GA_MEASUREMENT_ID` | Public / client-side | GA4 measurement ID. A public identifier, not a secret — hence the `PUBLIC_` prefix. GA stays off entirely until this is set. |

Both Kit variables are declared `optional` in `astro.config.mjs` on purpose: local
dev and previews run without Kit, and `/api/subscribe` answers 503 rather than
faking success when they are missing.

## Deploying (Vercel)

1. Push this repo to GitHub and import it in Vercel — the `@astrojs/vercel` adapter is
   already configured; no build settings needed.
2. Add the environment variables above in **Vercel → Project → Settings → Environment
   Variables**.
3. Point the `handsful.app` domain at the Vercel project.

Merges to `main` deploy to production; branches get preview URLs.

## Structure

```
src/
  config.ts          ← site-wide config: store URLs, Apple badge wording, socials
  data/              ← editable content: FAQ, testimonials/press
  layouts/           ← BaseLayout (SEO/meta), LegalLayout
  components/        ← header, footer, email signup form, store badges
  sections/          ← homepage sections in page order
  pages/             ← routes (/, legal pages, /waitlist-* signup status pages, /card QR landing page, /api/subscribe)
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

The endpoint also serves a no-JS path: a plain form POST (no `application/json`
content type) gets a 303 redirect to `/waitlist-thanks` or `/waitlist-error`
instead of a JSON body.

## Store badges and the two CTAs

The site has two calls to action, on purpose:

- **Hero — the stores.** The official Apple badge, linking to
  `CTA.appStoreUrl` (`src/config.ts`). `CTA.appleBadge` picks which official
  badge it wears — `'download'` now the app has shipped — and the matching
  `CTA_LABEL` supplies the header button and footer link wording, so the art
  and the words can't drift apart.
  The Google Play badge sits beside it, linking to `CTA.playStoreUrl`.
  The header's Download button scrolls back to these badges (`/#download`)
  rather than picking a store, so both platforms land on their own badge.
- **Foot of the page — email.** `EmailSignup.astro`, for product news.

Both stores require their **official, unmodified** badge artwork, which lives
in `src/assets/badges/` (in `src/`, not `public/`, so the bundler resolves it
and supplies each badge's intrinsic size and a fingerprinted URL). If the file
a badge expects isn't there, the hero renders a plain brand button with the
same words and `npm run build` prints a warning — see the notes in
`src/components/StoreBadges.astro` and the checklist in
[`LAUNCH-CHECKLIST.md`](LAUNCH-CHECKLIST.md).

## Business-card QR route (`/card`)

The QR code printed on the business cards encodes **`https://handsful.app/card`**
and must never change — it is the permanent destination for every card in
circulation. What a scan shows is decided by `src/pages/card.astro`.

**`/card` is a landing page on every device.** Everyone who scans stays on the
page and sees the campaign's message and both store badges, then chooses a
store. It does not redirect anyone automatically, on iPhone, Android or desktop.

**Current campaign: the 14-day free trial the app already offers.** There is no
extra discount, offer code or redemption step; the badges link to the normal
store listings and the trial starts in the app as it does for everyone. The page
reads "Try Handsful free for 14 days.", a line about what the app tracks, both
badges, "No payment required to start." and a link to handsful.app.

Both store badges are always visible. The detected platform only changes the
emphasis:

| Visitor | Badges |
| --- | --- |
| iPhone / iPad | App Store badge first, Google Play directly below it |
| Android | Google Play badge first, App Store directly below it |
| Desktop / unknown / no JavaScript | Both side by side with equal weight |

The emphasis is order only. Both badges keep their official artwork at the same
size, because neither store allows its badge to be dimmed, recoloured or shown
smaller than the other store's.

**To repurpose the route for a future campaign**, edit `CARD` in `src/config.ts`
and merge to `main` — the printed QR code stays the same. `CARD.iosUrl` and
`CARD.androidUrl` are configurable campaign destinations (any https URL, including
a page on this site); `CARD.headline`, `CARD.lead` and `CARD.note` are the page's
copy. Anything beyond that (a different layout, sending some visitors elsewhere)
is a change to `src/pages/card.astro`.

- UTM parameters on the QR URL (`/card?utm_source=business_card&utm_medium=qr&utm_campaign=launch`)
  are picked up by GA's page view as usual. While `CARD.androidUrl` is a Play listing
  URL they are also passed to Google Play as its `referrer`, defaulting to
  `utm_source=business_card&utm_medium=qr`, so card installs appear in Play Console's
  acquisition reports. Other destinations are used exactly as written.
- GA events, all with `source: business_card` and `platform`: `business_card_visit`,
  one of `business_card_ios` / `business_card_android` / `business_card_desktop`, and
  `business_card_store_click` (with `store` and `destination`).
- **GA only sees visitors who have accepted the cookie banner** (see below). Events
  raised before a visitor accepts are held and sent if they accept while still on
  the page; otherwise they are never sent. Because nobody is redirected away, a
  visitor now has time to answer the banner, but GA will still undercount scans.
  The store-side numbers (Play referrer, an App Store Connect campaign link in
  `CARD.iosUrl`) are the reliable count.
- The page is `noindex`, left out of the sitemap, and rendered without the site
  header and footer (`bare` on `BaseLayout`).

## Analytics & cookie consent

GA4 (`src/components/Analytics.astro`) uses **Google Consent Mode v2 in "basic"
mode**: gtag.js is not injected — not even requested from the network — until
analytics consent is granted, so pre-consent (and forever after a Decline) Google
receives nothing at all. Consent comes from the site's own banner
(`src/components/CookieConsentBanner.astro`): Accept dispatches the consent-granted
event that makes the loader (`src/ga-snippet.ts`) inject gtag.js with ad signals
denied and `analytics_storage` granted; Decline stores the refusal and clears any
existing `_ga*` cookies. The choice persists in localStorage
(`handsful_cookie_consent`, with a 12-month expiry) and is read before `<Analytics />`
renders via a bootstrap snippet in `BaseLayout.astro`, so returning visitors who
accepted are tracked from their first hit. The "Cookie preferences" button in the
footer reopens the banner at any time.

### Content Security Policy

`astro.config.mjs` builds a hash-based CSP. The two inline scripts Astro cannot see
— the consent bootstrap and the GA loader — are exported as string constants
(`src/consent.ts`, `src/ga-snippet.ts`), rendered verbatim via `set:html`, and hashed
from those same strings at config time, so a script and its hash cannot drift apart.
The policy also narrows itself when `PUBLIC_GA_MEASUREMENT_ID` is unset: no Google
origins appear in it at all. Non-CSP security headers live in `vercel.json`.

## Legal pages

`/privacy-policy`, `/cookie-policy` and `/terms-of-service` all carry final copy.
Each sets `placeholder={false}` in its front matter, which is what makes it
indexable — `LegalLayout.astro` defaults `noindex` to the `placeholder` prop, so a
page still awaiting copy shows a pending-copy notice and stays out of search. All
three are listed in the generated sitemap and carry a `lastUpdated` date.

Short aliases `/privacy`, `/cookies` and `/terms` redirect to the full paths
(`redirects` in `astro.config.mjs`). Those redirect stubs are excluded from the
sitemap by an exact-match filter, so `/privacy` cannot swallow `/privacy-policy`.
The `/waitlist-*` status routes are excluded permanently — they are only reachable
from the double opt-in email link or the endpoint's no-JS redirects.

## SEO notes

- Meta/OG/Twitter tags: `src/layouts/BaseLayout.astro`
- Structured data (Organization, SoftwareApplication, FAQPage): `src/pages/index.astro`
- `sitemap-index.xml` is generated at build; `public/robots.txt` references it
- FAQ copy doubles as FAQPage schema — edit once in `src/data/faq.ts`
- The 1200×630 OG image is generated at build time by `scripts/generate-og.mjs`
  (sharp) from the brand wordmark and the shared copy in `src/copy.mjs`
