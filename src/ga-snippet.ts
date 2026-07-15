import { CONSENT_GRANTED_EVENT } from './consent';

/**
 * The consent-gated GA4 loader, as the EXACT source text Analytics.astro
 * inlines (via set:html) and astro.config.mjs hashes for the CSP script-src
 * directive. Both consumers must call this with the same gaId
 * (PUBLIC_GA_MEASUREMENT_ID at build time) — any difference breaks the hash
 * and the browser blocks the script.
 *
 * "Basic" Consent Mode: gtag.js is not requested from the network at all
 * until analytics consent is granted — either a stored prior Accept
 * (window.__handsfulStoredConsent, set by the BaseLayout bootstrap) or a live
 * Accept click (the banner dispatches CONSENT_GRANTED_EVENT). Until then
 * Google receives nothing: no cookies, no cookieless pings, no IP/user-agent.
 * The Consent Mode v2 signals are still set before gtag.js executes so ad
 * signals stay denied and only analytics_storage is ever granted.
 */
export function gaConsentSnippet(gaId: string): string {
  return `
(function () {
  var injected = false;
  function loadGa() {
    if (injected) return;
    injected = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    /* Consent Mode v2 — set before gtag.js runs; ad signals stay denied. */
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', ${JSON.stringify(gaId)});
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${JSON.stringify(gaId)};
    document.head.appendChild(s);
  }
  if (window.__handsfulStoredConsent === 'granted') {
    loadGa();
  } else {
    document.addEventListener(${JSON.stringify(CONSENT_GRANTED_EVENT)}, loadGa);
  }
})();
`;
}
