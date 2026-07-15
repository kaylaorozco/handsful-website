/**
 * The cookie-consent storage contract — single source of truth shared by:
 *   - BaseLayout.astro's inline bootstrap (rendered from CONSENT_BOOTSTRAP_SRC
 *     below; an inline pre-gtag script can't import modules, so its read logic
 *     mirrors parseStoredConsent and must stay equivalent)
 *   - CookieConsentBanner.astro (imports everything directly)
 *   - Analytics.astro (consumes window.__handsfulStoredConsent downstream)
 *   - astro.config.mjs (hashes CONSENT_BOOTSTRAP_SRC for the CSP header)
 */

export const CONSENT_KEY = 'handsful_cookie_consent';

/**
 * Dispatched on `document` by CookieConsentBanner when the visitor clicks
 * Accept. The GA loader (src/ga-snippet.ts) listens for it to inject gtag.js
 * — under "basic" Consent Mode the script is never even requested until this
 * event fires or a stored granted choice exists.
 */
export const CONSENT_GRANTED_EVENT = 'handsful:consent-granted';

/**
 * Consent expires after 12 months (~365 days) — the Cookie Policy promises
 * "Up to 12 months, after which we ask again".
 */
export const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export type ConsentValue = 'granted' | 'denied';

/**
 * Parse the raw localStorage value into a consent choice. Unparsable values
 * (e.g. the pre-expiry bare-string format), unknown `value`s, and expired
 * timestamps are all "no choice" (null): the banner shows and Consent Mode's
 * denied default protects the visitor until they choose again.
 */
export function parseStoredConsent(raw: string | null): ConsentValue | null {
  try {
    const parsed = JSON.parse(raw ?? 'null');
    if (
      parsed &&
      (parsed.value === 'granted' || parsed.value === 'denied') &&
      Date.now() - Date.parse(parsed.timestamp) <= CONSENT_TTL_MS
    ) {
      return parsed.value;
    }
  } catch {
    /* fall through to null */
  }
  return null;
}

/**
 * The consent bootstrap, as the EXACT source text BaseLayout inlines into
 * <head> (via set:html) and astro.config.mjs hashes for the CSP script-src
 * directive. Both consumers must use this constant verbatim — any transform
 * on either side breaks the hash and the browser blocks the script.
 *
 * It must run before Analytics.astro's snippet and can't import modules, so
 * it mirrors parseStoredConsent: expired, invalid, or missing → null, i.e.
 * Consent Mode's denied default stands.
 */
export const CONSENT_BOOTSTRAP_SRC = `
try {
  var handsfulConsent = JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}));
  window.__handsfulStoredConsent =
    handsfulConsent &&
    (handsfulConsent.value === 'granted' || handsfulConsent.value === 'denied') &&
    Date.now() - Date.parse(handsfulConsent.timestamp) <= ${CONSENT_TTL_MS}
      ? handsfulConsent.value
      : null;
} catch (e) {
  window.__handsfulStoredConsent = null;
}
`;
