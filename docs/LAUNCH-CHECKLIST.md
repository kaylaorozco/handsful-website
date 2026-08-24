# Launch checklist

Everything that changes as Handsful goes pre-order → live app.

## Now: finish the pre-order CTA

The hero and header point at the real App Store listing
(`CTA.appStoreUrl` in `src/config.ts`), but Apple's badge artwork isn't in the
repo yet — until it is, the hero shows a plain brand button reading
"Pre-Order on the App Store" and `npm run build` prints a warning.

- [ ] Download the official **"Pre-Order on the App Store"** badge (SVG, black)
      from <https://toolbox.marketingtools.apple.com/en/us/app-store>
- [ ] Save it, unmodified, as `public/images/badges/app-store-pre-order.svg`
      — the badge replaces the fallback button automatically, no code change
- [ ] Check the hero on mobile and desktop after the swap

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
      `public/images/badges/app-store-download.svg`
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

- [ ] Download the official "Get it on Google Play" badge → `public/images/badges/google-play.svg`
- [ ] Set `CTA.playStoreUrl` in `src/config.ts` — the Play badge then renders
      beside Apple's everywhere the store CTA appears
- [ ] Add `Android` back to `operatingSystem` in the app schema (`src/pages/index.astro`)
- [ ] Update the FAQ and the final-CTA copy, which currently say Android is on the way
