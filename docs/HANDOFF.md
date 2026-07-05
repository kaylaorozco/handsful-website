# Handoff notes — what's left to do

Status as of 2026-07-05: site is built, verified locally, and pushed to
GitHub (`kaylaorozco/handsful-website`, private). **Not yet deployed.**
This file is the to-do list from here; `LAUNCH-CHECKLIST.md` covers the
launch-day flips (store badges, legal copy going final, etc.).

## 1. Deploy to Vercel (~3 min)

- [ ] Go to <https://vercel.com/new>, sign in with GitHub, import
      `kaylaorozco/handsful-website`. No build settings needed — the
      `@astrojs/vercel` adapter is preconfigured.
- [ ] Every push to `main` auto-deploys after this; branches get preview URLs.

## 2. Environment variables (Vercel → Project → Settings → Environment Variables)

- [ ] `WAITLIST_WEBHOOK_URL` — where `/api/subscribe` forwards signups as JSON
      `{ email, source, timestamp }`. Quickest zero-code option: a Zapier/Make
      webhook or Google Apps Script that appends to a sheet. Until this is set,
      signups only appear in Vercel function logs (form still works, but
      **emails aren't stored** — set this before sharing the URL anywhere).
- [ ] `PUBLIC_GA_MEASUREMENT_ID` — GA4 ID (`G-XXXXXXXXXX`). Create the GA4
      property first. Analytics stays completely off until this is set, and
      even then only loads after a visitor accepts the cookie banner.

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

- [ ] Submit the waitlist form with a real email → confirm it reaches the
      webhook destination (check `source` field says `hero` or `footer-cta`).
- [ ] Accept the cookie banner → confirm GA requests fire only *after* accepting.
- [ ] Share the URL in iMessage/Slack → confirm the OG card image shows.

## 6. Pick an email provider (whenever)

Mailchimp / ConvertKit / Supabase — two integration options, both small:
- Keep the webhook pattern (point `WAITLIST_WEBHOOK_URL` at their incoming
  webhook/automation endpoint), or
- Replace the single `forward()` function in `src/pages/api/subscribe.ts`
  with a native API call.
Turn on **double opt-in** in the provider — keeps consent airtight for the
marketing emails the signup copy now promises.

## 7. Content that's stubbed and waiting

- Testimonials & press: add real entries to `src/data/testimonials.ts` —
  the section appears automatically (renders nothing while empty).
- Social links: fill URLs in `src/config.ts` → `SOCIAL` (footer shows
  "· soon" placeholders until then).
- Legal copy: three placeholder pages, `noindex`'d and out of the sitemap.
  Un-flagging steps are at the top of `src/layouts/LegalLayout.astro`.
- Hero mock: swap `src/components/AppPeek.astro` for real screenshots when
  app screens are final (and remove the "psst — mid-build" caption).

## Then: launch time

Work through `docs/LAUNCH-CHECKLIST.md` (store badges + CTA mode flip,
legal pages going final, FAQ copy updates, schema additions).
