// @ts-check
import { createHash } from 'node:crypto';
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { loadEnv } from 'vite';
import { CONSENT_BOOTSTRAP_SRC } from './src/consent.ts';
import { gaConsentSnippet } from './src/ga-snippet.ts';

const cspHash = (/** @type {string} */ src) =>
  /** @type {const} */ (`sha256-${createHash('sha256').update(src).digest('base64')}`);

// Same value Analytics.astro sees at prerender time (pages are static, so
// build-time env is the only env). When unset, GA renders nothing and the CSP
// stays Google-free.
const { PUBLIC_GA_MEASUREMENT_ID: gaId = '' } = loadEnv(
  process.env.NODE_ENV ?? 'production',
  process.cwd(),
  '',
);

// https://astro.build/config
export default defineConfig({
  site: 'https://handsful.app',
  // Static-first: every page is prerendered HTML. Only /api/subscribe
  // opts into on-demand rendering (see `export const prerender = false` there),
  // which the Vercel adapter deploys as a serverless function.
  output: 'static',
  // experimentalStaticHeaders turns the experimental.csp policy below into
  // real per-page response headers in the Vercel build output (instead of
  // <meta> tags). The non-CSP security headers live in vercel.json.
  adapter: vercel({ experimentalStaticHeaders: true }),
  trailingSlash: 'never',
  experimental: {
    // Hash-based CSP: Astro hashes every script/style it processes itself;
    // the two is:inline scripts it can't see (consent bootstrap, GA snippet)
    // are rendered from exported strings and hashed here from those same
    // strings, so script and hash cannot drift apart.
    csp: {
      scriptDirective: {
        resources: ["'self'", ...(gaId ? ['https://www.googletagmanager.com'] : [])],
        hashes: [
          cspHash(CONSENT_BOOTSTRAP_SRC),
          ...(gaId ? [cspHash(gaConsentSnippet(gaId))] : []),
        ],
      },
      directives: [
        "default-src 'self'",
        // gtag.js sends hits via fetch/sendBeacon (connect-src) with an image
        // fallback (img-src); regional GA endpoints live on both domains.
        `connect-src 'self'${gaId ? ' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com' : ''}`,
        `img-src 'self' data:${gaId ? ' https://*.google-analytics.com https://*.googletagmanager.com' : ''}`,
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
      ],
    },
  },
  env: {
    // Typed access for /api/subscribe via astro:env/server. Both stay
    // `optional` on purpose: local dev and previews run without Kit, and the
    // route answers 503 (never a fake success) when they're missing — the
    // schema still catches type drift and documents the contract.
    schema: {
      KIT_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      KIT_FORM_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  // Short aliases: /privacy is the route referenced in launch tickets, and the
  // Privacy Policy copy cites https://handsful.app/cookies verbatim.
  redirects: {
    '/privacy': '/privacy-policy',
    '/cookies': '/cookie-policy',
    '/terms': '/terms-of-service',
  },
  integrations: [
    sitemap({
      // Legal pages are excluded until the indexing ticket ships (they are
      // also noindex'd — the Privacy Policy and Terms of Service have final
      // copy but stay noindex'd deliberately). /privacy, /cookies, and /terms
      // are redirect stubs; the '/privacy' entry also matches '/privacy-policy',
      // and '/terms' also matches '/terms-of-service'.
      // The /waitlist-* pages stay excluded permanently — they're only
      // reachable from the double opt-in email link (/waitlist-confirmed) or
      // /api/subscribe's no-JS 303 redirects (-thanks, -error), and all are
      // noindex'd. '/waitlist-' matches all three.
      filter: (page) =>
        !['/privacy', '/cookie-policy', '/cookies', '/terms', '/waitlist-'].some((p) =>
          page.includes(p),
        ),
    }),
  ],
});
