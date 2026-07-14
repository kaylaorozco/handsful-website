/**
 * Shared marketing copy used by BOTH the site (through src/config.ts) and the
 * OG-image generator (scripts/generate-og.mjs). Plain .mjs, not .ts, because
 * the generator runs under Node directly and can't import TypeScript.
 */

/**
 * The tagline's two sentences. `SITE.tagline` joins them with a space for
 * meta/schema text; the hero renders them on separate lines.
 */
export const TAGLINE_LINES = ["You've got your hands full.", "We've got you."];

/**
 * Headline — the hero <h1> and the OG image's subtitle. The non-breaking
 * spaces ( ) keep "triplets & more" from wrapping mid-phrase.
 */
export const HEADLINE = 'The baby tracker built for twins, triplets & more';
