/**
 * Platform detection for /card (src/pages/card.astro), as a script that runs
 * before the page's content is laid out — so a phone gets its own store's
 * badge first from the very first paint, with no reshuffle afterwards.
 *
 * Like the consent bootstrap in consent.ts it is an is:inline script Astro
 * can't hash by itself, so it lives here as a string: card.astro renders it
 * verbatim and astro.config.mjs hashes the same string into the CSP, and the
 * two cannot drift apart.
 *
 * It sets data-platform ('ios' | 'android' | 'desktop') on its parent
 * element. That is used for emphasis and analytics only; it never hides a
 * badge or sends anyone anywhere.
 */
export const CARD_PLATFORM_SRC = `
(function () {
  var ua = navigator.userAgent;
  var platform = 'desktop';
  if (/android/i.test(ua)) platform = 'android';
  else if (/iPhone|iPad|iPod/.test(ua)) platform = 'ios';
  // iPadOS Safari calls itself a Mac; a touchscreen gives it away.
  else if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) platform = 'ios';
  document.currentScript.parentElement.dataset.platform = platform;
})();
`;
