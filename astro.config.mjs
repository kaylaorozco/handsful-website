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
  integrations: [
    sitemap({
      // Legal pages are excluded while they hold placeholder copy (they are
      // also noindex'd). When final legal copy lands, delete this filter and
      // flip `noindex` off in the three legal pages.
      filter: (page) =>
        !['/privacy-policy', '/cookie-policy', '/terms-of-service'].some((p) =>
          page.includes(p),
        ),
    }),
  ],
});
