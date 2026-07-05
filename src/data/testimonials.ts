/**
 * Social proof content. Both arrays are intentionally EMPTY pre-launch —
 * the SocialProof section renders nothing until at least one entry exists,
 * so the live page never shows fake or placeholder quotes.
 *
 * To go live: add entries here. No markup changes needed.
 */

export interface Testimonial {
  quote: string;
  name: string; // e.g. "Jess M."
  detail: string; // e.g. "mom of twins, Austin TX"
}

export interface PressMention {
  outlet: string;
  quote: string;
  url: string;
  /** Path under /public to an outlet logo (SVG preferred), e.g. "/images/press/techcrunch.svg" */
  logo?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  // { quote: '…', name: '…', detail: '…' },
];

export const PRESS: PressMention[] = [
  // { outlet: '…', quote: '…', url: '…' },
];
