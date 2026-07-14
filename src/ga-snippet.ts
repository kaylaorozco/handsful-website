/**
 * The GA4 / Consent Mode v2 inline snippet, as the EXACT source text
 * Analytics.astro inlines (via set:html) and astro.config.mjs hashes for the
 * CSP script-src directive. Both consumers must call this with the same gaId
 * (PUBLIC_GA_MEASUREMENT_ID at build time) — any difference breaks the hash
 * and the browser blocks the script.
 */
export function gaConsentSnippet(gaId: string): string {
  return `
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
window.gtag = gtag;
/* Consent Mode v2 — must run before gtag.js, default before update. */
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
});
if (window.__handsfulStoredConsent === 'granted') {
  gtag('consent', 'update', { analytics_storage: 'granted' });
}
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)});
`;
}
