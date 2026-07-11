/**
 * Site-wide configuration. Everything an editor might need to touch at launch
 * time lives here — CTA mode, store URLs, socials — so no component surgery
 * is needed for the waitlist → app-store transition.
 */

export type CtaMode = 'waitlist' | 'stores';

export const SITE = {
  name: 'Handsful',
  url: 'https://handsful.app',
  tagline: "You've got your hands full. We've got you.",
  title: 'Handsful — Baby Tracker App for Twins, Triplets & Multiples',
  description:
    'The baby tracker built for twins, triplets & more. Log feeds, naps and diapers for every baby in one tap, compare side by side, and share with every caregiver. Join the waitlist.',
  contactEmail: 'hello@handsful.app',
  ogImage: '/images/og.png',
} as const;

/**
 * Role-based inboxes. These must actually exist (or forward) at your mail/domain
 * provider before the pages referencing them go live — most registrars and
 * Google Workspace/Fastmail support alias forwarding to one inbox.
 */
export const EMAILS = {
  hello: 'hello@handsful.app', // general contact (footer)
  privacy: 'privacy@handsful.app', // data/privacy requests (Privacy & Cookie Policy)
  support: 'support@handsful.app', // app support once launched
} as const;

export const CTA = {
  /**
   * 'waitlist' → email capture form (pre-launch).
   * 'stores'   → App Store / Play Store badges. Flip this single value when
   *              Apple Pre-Order / Google Play Pre-Registration go live and
   *              fill in the two URLs below. No other changes needed.
   */
  mode: 'waitlist' as CtaMode,
  appStoreUrl: '', // e.g. https://apps.apple.com/app/handsful/id0000000000
  playStoreUrl: '', // e.g. https://play.google.com/store/apps/details?id=app.handsful
} as const;

/** Social profiles. Empty string = link hidden in the footer until it exists. */
export const SOCIAL = {
  instagram: 'https://www.instagram.com/handsful.app',
  facebook: 'https://www.facebook.com/profile.php?id=61591750317597',
  tiktok: 'https://www.tiktok.com/@handsful.app',
} as const;
