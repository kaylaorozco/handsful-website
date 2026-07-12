---
name: verify
description: Build, run and visually verify the Handsful marketing site (Astro, zero-JS-framework). Use when confirming a change works in the real rendered page, not just in the build.
---

# Verifying changes to the Handsful site

## Build

```bash
npx astro build        # fast check; skips OG image generation
npm run build          # full build (generates OG image first)
```

The `@astrojs/vercel` adapter warns about local Node 24 vs runtime Node 22 — harmless.

## Run

```bash
npx astro dev --port 4399   # background it; ready in ~2s, http://localhost:4399/
```

`astro preview` is unreliable with the Vercel adapter — use `astro dev`.

## Drive / capture

- Playwright browsers are cached at `~/Library/Caches/ms-playwright/` but the
  cached build may not match the latest `playwright` npm package. Pass the
  cached binary explicitly:
  `chromium.launch({ executablePath: HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-<build>/chrome-headless-shell-mac-arm64/chrome-headless-shell' })`
- **The Astro dev toolbar intercepts pointer events** (a floating pill at the
  bottom of the viewport; it also photobombs fullPage screenshots). Remove it
  before clicking anything:
  `page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove())`
- **The site ships its own cookie consent banner**
  (`src/components/CookieConsentBanner.astro`): with no stored consent it
  appears ~2 seconds after load, fixed to the bottom of the viewport — it
  overlays lower-page content, photobombs screenshots, and intercepts
  bottom-of-page clicks taken after that delay. To suppress it, pre-set a
  choice before load (fresh, ISO timestamp — bare strings and >12-month-old
  choices are treated as no consent and the banner reshows):
  `page.addInitScript(() => localStorage.setItem('handsful_cookie_consent', JSON.stringify({ value: 'denied', timestamp: new Date().toISOString() })))`
  To test the banner itself, wait for it rather than racing the delay:
  `page.waitForSelector('[data-cookie-banner]:not([hidden])')`. The footer
  "Cookie preferences" button reopens it instantly (no delay).

## Flows worth driving

- Landing page top-to-bottom (`fullPage` screenshot) — section order and
  alternating warm/white backgrounds.
- Hero waitlist form: bad email → inline status "That email looks a little
  off…" (client-side; no network needed). Real submits POST `/api/subscribe`,
  which calls the Kit API and needs `KIT_API_KEY`/`KIT_FORM_ID` — don't drive
  live; stub `window.fetch` to return
  `{ ok: true, status: 'confirmation_sent' | 'already_subscribed' | 'already_pending' }`
  to exercise the success states. Note the hero intro's infinite blob
  animations throw on `Animation.finish()` — wrap in try/catch.
- Animations: sample `getComputedStyle(el).getPropertyValue('d')` /
  `.transform` twice a few seconds apart to prove motion; emulate
  `reducedMotion: 'reduce'` to prove the global freeze rule applies.
- One-shot sequences (e.g. the hero intro): capture deterministic frames by
  seeking every CSS animation via WAAPI instead of racing wall-clock time:
  `page.evaluate(t => document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; }), ms)`
  then screenshot at each phase timestamp.
- Mobile: 390×844 viewport — copy/CTA must come before the hero art.
