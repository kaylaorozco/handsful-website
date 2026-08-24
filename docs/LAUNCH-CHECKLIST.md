# Launch checklist

Everything that changes as Handsful goes pre-order → live app.

## Pre-order CTA (done)

The hero and header point at the real App Store listing
(`CTA.appStoreUrl` in `src/config.ts`), and Apple's official
"Pre-Order on the App Store" badge is in place at
`src/assets/badges/app-store-pre-order.svg`. Nothing to do here until launch.

Badge artwork lives in `src/assets/badges/`, not `public/` — the bundler
resolves it there, which is what gives each badge its intrinsic size and a
fingerprinted URL. Drop a new badge in with the file name the component
expects and it renders itself; if it's missing, the CTA falls back to a plain
brand button and `npm run build` says so.

Never redraw, re-typeset, recolor or stretch either store's badge — both
stores require the official art exactly as supplied.

## Domain email

- [ ] Set up role inboxes (or aliases forwarding to one inbox) at the mail/domain
      provider for every address in `EMAILS` in `src/config.ts`:
      `hello@`, `privacy@`, `support@handsful.app`
- [ ] Send a test email to each before the pages referencing them go live

## Legal copy lands

- [ ] Replace placeholder content in `src/pages/{privacy-policy,cookie-policy,terms-of-service}.astro`
- [ ] Set `placeholder={false}` on each finished page (removes banner + noindex)
- [ ] Remove finished pages from the sitemap `filter` in `astro.config.mjs`
- [ ] Add a `lastUpdated` date to each page

## Social proof

- [ ] Add real testimonials to `src/data/testimonials.ts` (section auto-appears)
- [ ] Add press mentions (+ logos under `public/images/press/`) as they land

## Launch day (the app goes live)

- [ ] Download the official **"Download on the App Store"** badge and save it as
      `src/assets/badges/app-store-download.svg`
- [ ] In `src/config.ts`: flip `CTA.appleBadge` from `'pre-order'` to `'download'`
      (header, hero and footer wording follow automatically)
- [ ] Email the list announcing the launch
- [ ] Update FAQ answers that reference pre-order / "launching soon" (`src/data/faq.ts`)
- [ ] Add `Offer` (price) and later `AggregateRating` to the SoftwareApplication
      schema in `src/pages/index.astro`
- [ ] Swap the stylized UI mocks (`src/components/AppPeek.astro` and
      `src/components/NotesPeek.astro`, used in `src/sections/SeeItInAction.astro`)
      for real app screenshots once screens are final — and rework their
      captions

## When Android lands

- [ ] Download the official "Get it on Google Play" badge → `src/assets/badges/google-play.svg`
- [ ] Set `CTA.playStoreUrl` in `src/config.ts` — the Play badge then renders
      beside Apple's everywhere the store CTA appears
- [ ] Add `Android` back to `operatingSystem` in the app schema (`src/pages/index.astro`)
- [ ] Update the FAQ and the final-CTA copy, which currently say Android is on the way
