/**
 * Custom window globals shared by the consent scripts:
 *   - BaseLayout.astro's bootstrap writes __handsfulStoredConsent
 *   - Analytics.astro's snippet reads it and defines gtag/dataLayer
 *   - CookieConsentBanner.astro queues consent updates through gtag
 */
interface Window {
  dataLayer?: unknown[];
  /** gtag.js pushes `arguments` objects onto dataLayer — any arg list goes. */
  gtag?: (...args: unknown[]) => void;
  __handsfulStoredConsent?: 'granted' | 'denied' | null;
}
