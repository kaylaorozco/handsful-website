# Handoff notes — what's left to do

Status as of 2026-07-05: site is built, verified locally, and pushed to
GitHub (`mesquite-thorn/handsful-website`, private). **Not yet deployed.**
This file is the to-do list from here; `LAUNCH-CHECKLIST.md` covers the
launch-day flips (store badges, legal copy going final, etc.).

## 1. Deploy to Vercel (~3 min)

- [ ] Go to <https://vercel.com/new>, sign in with GitHub, import
      `mesquite-thorn/handsful-website` (grant Vercel access to the
      mesquite-thorn org when prompted). No build settings needed — the
      `@astrojs/vercel` adapter is preconfigured.
- [ ] Every push to `main` auto-deploys after this; branches get preview URLs.

## 2. Kit (ConvertKit) setup + environment variables

One-time setup in the Kit dashboard:

- [ ] Create the Handsful waitlist form in Kit.
- [ ] Enable **double opt-in** on that form (Kit sends the confirmation email).
- [ ] Set the form's confirmation redirect URL to
      `https://handsful.app/waitlist-confirmed` so confirming stays on-brand.
- [ ] Create a v4 API key: app.kit.com → Account settings → Developer.

Then in Vercel → Project → Settings → Environment Variables:

- [ ] `KIT_API_KEY` — the v4 API key (server-side only; never exposed to the
      client).
- [ ] `KIT_FORM_ID` — the numeric ID of the waitlist form. Until both are set,
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

- [ ] Submit the waitlist form with a real email → Kit's confirmation email
      arrives → click the link → land on `/waitlist-confirmed` → the
      subscriber shows as confirmed on the Kit form (referrer notes `hero` or
      `footer-cta`).
- [ ] Submit the same email again → the form shows the friendly
      "already on the list" message, not an error.
- [ ] Share the URL in iMessage/Slack → confirm the OG card image shows.

## 6. Analytics + cookie consent (GA4 · Consent Mode v2 · Termly)

- [ ] Create the GA4 property: analytics.google.com → Admin → Create property
      ("Handsful", your timezone/currency) → add a **Web** data stream for
      `https://handsful.app` → copy the `G-XXXXXXXXXX` measurement ID.
- [ ] Set `PUBLIC_GA_MEASUREMENT_ID` in Vercel env vars (Production + Preview).
      GA is completely absent from the page until this is set. It's a public
      identifier, not a secret — hence the `PUBLIC_` prefix.
- [ ] Add Termly's consent embed in `BaseLayout.astro`, **above** `<Analytics />`
      (a placeholder comment marks the spot), and enable Termly's **Google
      Consent Mode** integration in the Termly dashboard.
- [ ] Verify on the live site: before accepting the Termly banner there are no
      `_ga*` cookies (gtag loads but consent defaults are denied); after
      accepting, `_ga*` cookies appear and hits show in GA4 Realtime.

## 7. Content that's stubbed and waiting

- Testimonials & press: add real entries to `src/data/testimonials.ts` —
  the section appears automatically (renders nothing while empty).
- Social links: fill URLs in `src/config.ts` → `SOCIAL` (footer shows
  "· soon" placeholders until then).
- Legal copy: three placeholder pages, `noindex`'d and out of the sitemap.
  Un-flagging steps are at the top of `src/layouts/LegalLayout.astro`.
- App mocks: swap `src/components/AppPeek.astro` and
  `src/components/NotesPeek.astro` (both in the "See it in action" section,
  `src/sections/SeeItInAction.astro`) for real screenshots when app screens
  are final (and rework the captions).

## Then: launch time

Work through `docs/LAUNCH-CHECKLIST.md` (store badges + CTA mode flip,
legal pages going final, FAQ copy updates, schema additions).
