/**
 * The cookie-consent storage contract — single source of truth shared by:
 *   - BaseLayout.astro's inline bootstrap (gets the constants via define:vars;
 *     its read logic mirrors parseStoredConsent and must stay equivalent,
 *     since an inline pre-gtag script can't import modules)
 *   - CookieConsentBanner.astro (imports everything directly)
 *   - Analytics.astro (consumes window.__handsfulStoredConsent downstream)
 */

export const CONSENT_KEY = 'handsful_cookie_consent';

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
