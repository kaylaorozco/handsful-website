# Handoff notes — what's left to do

Status as of 2026-07-05: site is built, verified locally, and pushed to
GitHub (`mesquite-thorn/handsful-website`, private). **Not yet deployed.**
This file is the to-do list from here; `LAUNCH-CHECKLIST.md` covers the
launch-day flips (badge wording, legal copy going final, etc.).

## 1. Deploy to Vercel (~3 min)

- [ ] Go to <https://vercel.com/new>, sign in with GitHub, import
      `mesquite-thorn/handsful-website` (grant Vercel access to the
      mesquite-thorn org when prompted). No build settings needed — the
      `@astrojs/vercel` adapter is preconfigured.
- [ ] Every push to `main` auto-deploys after this; branches get preview URLs.

## 2. Kit (ConvertKit) setup + environment variables

One-time setup in the Kit dashboard:

- [ ] Create the Handsful signup form in Kit.
- [ ] Enable **double opt-in** on that form (Kit sends the confirmation email).
- [ ] Set the form's confirmation redirect URL to
      `https://handsful.app/waitlist-confirmed` so confirming stays on-brand.
- [ ] Create a v4 API key: app.kit.com → Account settings → Developer.

Then in Vercel → Project → Settings → Environment Variables:

- [ ] `KIT_API_KEY` — the v4 API key (server-side only; never exposed to the
      client).
- [ ] `KIT_FORM_ID` — the numeric ID of the signup form. Until both are set,
      `/api/subscribe` returns a "briefly unavailable" error (it never fakes
      success) — set them before sharing the URL anywhere.

## 3. Domain

- [ ] Vercel → Project → Settings → Domains → add `handsful.app` (and `www`),
      then follow the DNS instructions at the registrar.
- [ ] After DNS resolves: check `https://handsful.app/sitemap-index.xml` and
      `/robots.txt` load, then submit the sitemap in Google Search Console
      (also verifies the domain — do this early, indexing takes time).

## 4. Domain email

- [ ] Create/forward the role inboxes in `src/config.ts` → `EMAILS`:
      `hello@`, `privacy@`, `support@handsful.app`. Most registrars offer free
      alias forwarding to a personal inbox.
- [ ] Send a test email to each. `privacy@` is already linked from the Privacy
      and Cookie Policy pages, so it should work before launch traffic arrives.

## 5. Verify the live site (once deployed)

- [ ] Submit the signup form with a real email → Kit's confirmation email
      arrives → click the link → land on `/waitlist-confirmed` → the
      subscriber shows as confirmed on the Kit form (referrer notes `hero` or
      `footer-cta`).
- [ ] Submit the same email again → the form shows the friendly
      "already on the list" message, not an error.
- [ ] Share the URL in iMessage/Slack → confirm the OG card image shows.

## 6. Analytics + cookie consent (GA4 · Consent Mode v2 · custom banner)

- [x] GA4 property: **"Handsful"**, Web data stream for
      `https://www.handsful.app`, Measurement ID **`G-PJC1SRJSPB`**.
      ⚠️ Correction (2026-07-12): the ID documented previously,
      `G-6463W89ED0`, was never a valid/findable GA4 property — if it turns
      up in old notes or dashboards, it's wrong; `G-PJC1SRJSPB` is the
      corrected one.
- [x] `PUBLIC_GA_MEASUREMENT_ID` set in Vercel env vars (Production +
      Preview) with the corrected ID. GA is completely absent from the page
      until this is set. It's a public identifier, not a secret — hence the
      `PUBLIC_` prefix.
- Consent UI is the site's own banner (`src/components/CookieConsentBanner.astro`,
  issue #7 — Termly was dropped). The visitor's choice is stored in
  localStorage under `handsful_cookie_consent` (`{ value, timestamp }`,
  expires after 12 months); a bootstrap snippet in `BaseLayout.astro` reads
  it before `<Analytics />` so a stored "granted" applies before gtag.js
  loads. The footer "Cookie preferences" button reopens the banner to change
  the choice; declining also removes any existing `_ga*` cookies.

### Verify AFTER the production push

(GA4 Test Installation and DebugView both need the live site reachable with
the correct ID deployed.)

- [ ] **GA4 Test Installation**: Admin → Data Streams → Handsful Website
      stream → "Test installation" — confirms the tag is detected on the
      live domain.
- [ ] **DebugView full consent loop**: fresh load with no stored consent
      shows no `_ga*` cookies → Accept: `_ga*` cookies appear and a
      `page_view`/`session_start` event registers in DebugView/Realtime →
      reload doesn't reshow the banner and still registers hits → Decline
      via "Cookie preferences": `_ga*` cookies are removed → reload after
      declining shows no new hits.
- [ ] Confirm no residual references to `G-6463W89ED0` anywhere in the
      codebase or docs (verified clean in the repo as of 2026-07-12 — this
      check is for dashboards/external notes).

## 7. Content that's stubbed and waiting

- Testimonials & press: add real entries to `src/data/testimonials.ts` —
  the section appears automatically (renders nothing while empty).
- Social links: fill URLs in `src/config.ts` → `SOCIAL` (footer shows
  "· soon" placeholders until then).
- Legal copy: Privacy and Cookie Policy are final; Terms of Service is still a
  placeholder. All stay `noindex`'d and out of the sitemap until the indexing
  ticket — steps at the top of `src/layouts/LegalLayout.astro`.
- App mocks: swap `src/components/AppPeek.astro` and
  `src/components/NotesPeek.astro` (both in the "See it in action" section,
  `src/sections/SeeItInAction.astro`) for real screenshots when app screens
  are final (and rework the captions).

## Then: launch time

Work through `docs/LAUNCH-CHECKLIST.md`. The pre-order → download flip and the
copy that went with it are done; still open are the "Download on the App Store"
badge artwork, legal pages going final, and the price/rating schema additions.
