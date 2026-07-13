// @ts-check
import { defineConfig } from 'astro/config';
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
      // /waitlist-confirmed stays excluded permanently — it's only reachable
      // from the double opt-in email link and is noindex'd.
      filter: (page) =>
        !['/privacy', '/cookie-policy', '/cookies', '/terms', '/waitlist-confirmed'].some((p) =>
          page.includes(p),
        ),
    }),
  ],
});
