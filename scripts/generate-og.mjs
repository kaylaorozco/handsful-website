/**
 * Generates public/images/og.png (1200×630) from brand assets at build time,
 * so the OG image always matches the brand without a binary checked into git.
 * Runs automatically via `npm run build`; run standalone with `npm run og`.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const wordmark = await readFile(join(root, 'src/assets/wordmark.svg'), 'utf8');
// Strip the outer <svg> so the paths can be placed in our canvas.
const wordmarkInner = wordmark
  .replace(/<svg[^>]*>/, '')
  .replace('</svg>', '');

const W = 1200;
const H = 630;

// Signature gradient (160deg, Sky → Teal-green → Butter) per style guide 1.3.
const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sig" x1="0%" y1="0%" x2="34.2%" y2="94%">
      <stop offset="0%" stop-color="#3EA6C2"/>
      <stop offset="55%" stop-color="#2F7D6B"/>
      <stop offset="100%" stop-color="#FFCB57"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sig)"/>
  <!-- wordmark: source viewBox 1024×406, scaled to ~620px wide, centered -->
  <g transform="translate(290, 130) scale(0.605)">${wordmarkInner}</g>
  <text x="600" y="470" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700"
    fill="#FFFFFF">You've got your hands full. We've got you.</text>
  <text x="600" y="530" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="400"
    fill="#FAF7F2" opacity="0.9">The baby tracker built for twins, triplets &amp; more</text>
</svg>`;

const outDir = join(root, 'public/images');
await mkdir(outDir, { recursive: true });
const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
await writeFile(join(outDir, 'og.png'), png);
console.log(`✓ public/images/og.png generated (${W}×${H}, ${(png.length / 1024).toFixed(0)} kB)`);
