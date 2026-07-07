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
- The cookie consent banner covers the lower viewport on first load — click
  its Decline button (`#cookie-decline`) when it's in the way.

## Flows worth driving

- Landing page top-to-bottom (`fullPage` screenshot) — section order and
  alternating warm/white backgrounds.
- Hero waitlist form: bad email → inline status "That email looks a little
  off…" (client-side; no network needed). Real submits POST `/api/subscribe`,
  which needs env keys — don't drive live.
- Animations: sample `getComputedStyle(el).getPropertyValue('d')` /
  `.transform` twice a few seconds apart to prove motion; emulate
  `reducedMotion: 'reduce'` to prove the global freeze rule applies.
- Mobile: 390×844 viewport — copy/CTA must come before the hero art.
