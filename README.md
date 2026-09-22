# Handsful Website

Production marketing site for [Handsful](https://handsful.app/), a baby tracker built specifically for parents of twins, triplets, and other multiples.

Built with **Astro**, **TypeScript**, and a static-first architecture on **Vercel**, with minimal client-side JavaScript and a single serverless endpoint for email signups.

## What this project demonstrates

- **Design engineering** — translating product and brand decisions into a responsive production experience
- **Static-first architecture** — most of the site renders to HTML with very little JavaScript shipped to the browser
- **Privacy-first analytics** — GA4 only loads after analytics consent is granted
- **Progressive enhancement** — email signup supports both JavaScript and standard form submission paths
- **Security-conscious implementation** — CSP, origin checks, honeypot protection, rate limiting, masked logging, and hardened response headers
- **Accessibility & performance** — reduced-motion support, semantic markup, responsive assets, preloaded fonts, and CLS-conscious layout decisions
- **SEO** — canonical metadata, Open Graph/Twitter cards, sitemap generation, structured data, and build-generated social imagery

## Tech stack

- Astro 5
- TypeScript
- Vanilla CSS with design tokens
- Vercel
- Kit API
- Google Analytics 4 with Consent Mode v2
- Sharp for build-time OG image generation

## Architecture

The site is intentionally lightweight.

Most routes are statically generated. The only server-side endpoint is:

`/api/subscribe`

which handles email signup through Kit.

## Technical highlights

### Consent-gated analytics

GA4 uses Google Consent Mode v2 in basic mode.

The analytics script is not loaded until the visitor grants analytics consent. Declining prevents the request from being made and clears existing `_ga*` cookies.

### Email signup integration

The custom Kit integration includes:

- server-side API handling
- origin checks
- honeypot protection
- basic per-IP rate limiting
- masked email logging
- multiple subscription outcome states
- graceful failure when configuration is unavailable

### CTA architecture

App Store CTA state is managed centrally through shared configuration so badge artwork, button copy, footer wording, and store destinations stay synchronized.

### Accessibility & performance

Notable implementation details include:

- `prefers-reduced-motion` support
- skip navigation
- visually hidden form labels
- responsive image generation
- preloaded font subsets
- reserved dimensions to reduce layout shift
- cache headers with `stale-while-revalidate`

## Local development

For setup, deployment, environment variables, repository structure, and implementation details, see:

[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

## Project status

This is the live production website for Handsful and continues to evolve alongside the product.
