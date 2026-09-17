/**
 * Site-wide configuration. Everything an editor might need to touch at launch
 * time lives here — store URLs, badge wording, socials — so no component
 * surgery is needed for the pre-order → live-app transition.
 */

/**
 * Which official Apple badge the store link wears. Both point at the same
 * App Store page; only the wording differs, and it has to match what the
 * visitor actually gets when they tap it (Apple's marketing guidelines).
 */
export type AppleBadge = 'pre-order' | 'download';

// Tagline/headline live in copy.mjs so the OG-image generator (plain Node)
// can share them — edit them there.
import { TAGLINE_LINES, HEADLINE } from './copy.mjs';
export { TAGLINE_LINES, HEADLINE };

/**
 * Role-based inboxes. These must actually exist (or forward) at your mail/domain
 * provider before the pages referencing them go live — most registrars and
 * Google Workspace/Fastmail support alias forwarding to one inbox.
 */
export const EMAILS = {
  hello: 'hello@handsful.app', // general contact (footer, SITE.contactEmail)
  privacy: 'privacy@handsful.app', // data/privacy requests (Privacy & Cookie Policy)
  support: 'support@handsful.app', // app support once launched
} as const;

export const SITE = {
  name: 'Handsful',
  url: 'https://handsful.app',
  tagline: TAGLINE_LINES.join(' '),
  title: 'Handsful — Baby Tracker App for Twins, Triplets & Multiples',
  // Meta description — keep ≤160 chars (Google truncates ~155–160) with the
  // multiples language and the store CTA up front.
  description:
    'The baby tracker built for twins, triplets & more. Log feeds, naps and diapers for every baby in one tap, and share with every caregiver. Now on the App Store.',
  contactEmail: EMAILS.hello,
  ogImage: '/images/og.png',
} as const;

export const CTA = {
  /**
   * The App Store listing. Pre-orders and the live app share this URL, so
   * launch day only moved `appleBadge` below.
   */
  appStoreUrl: 'https://apps.apple.com/us/app/handsful-baby-tracker/id6797077032',

  /**
   * 'pre-order' → the "Pre-Order on the App Store" badge (pre-launch).
   * 'download'  → the "Download on the App Store" badge, live since the app
   *               shipped. This drives the badge artwork AND the header and
   *               footer link wording (CTA_LABEL below), so the words and the
   *               art can never drift apart.
   */
  appleBadge: 'download' as AppleBadge,

  /**
   * Google Play. Empty = no Play badge renders anywhere (iOS-first launch).
   * Fill this in when Android pre-registration opens and the badge appears
   * beside Apple's automatically.
   */
  playStoreUrl: '', // e.g. https://play.google.com/store/apps/details?id=app.handsful
} as const;

/**
 * The words every App Store link wears, keyed to `CTA.appleBadge` above.
 *
 * Apple's guidelines are about the promise, not just the artwork: a link that
 * says "Download" has to actually lead to a download. Keeping the header
 * button, the footer link and the badge's alt text on one switch means a
 * single config change moves all of them together — no stale "Pre-order"
 * button left behind in a corner of the page on launch day.
 */
const CTA_WORDING = {
  'pre-order': {
    /** Header button — verb only; the nav has no room for the full phrase. */
    short: 'Pre-order',
    /** Footer link and badge alt text. Matches Apple's badge art word for word. */
    long: 'Pre-Order on the App Store',
  },
  download: {
    short: 'Download',
    long: 'Download on the App Store',
  },
} as const;

export const CTA_LABEL = CTA_WORDING[CTA.appleBadge];

/** Social profiles. Empty string = link hidden in the footer until it exists. */
export const SOCIAL = {
  instagram: 'https://www.instagram.com/handsful.app',
  facebook: 'https://www.facebook.com/profile.php?id=61591750317597',
  tiktok: 'https://www.tiktok.com/@handsful.app',
} as const;
