// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://handsful.app',
  // Static-first: every page is prerendered HTML. Only /api/subscribe
  // opts into on-demand rendering (see `export const prerender = false` there),
  // which the Vercel adapter deploys as a serverless function.
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
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
  // Privacy Policy copy cites https://www.handsful.app/cookies verbatim.
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
