/**
 * Generates the morph-target paths for the "Twin Blobs" hero animation
 * (src/components/TwinBlobs.astro).
 *
 * Every variant of a blob is built from the SAME number of anchor points and
 * the SAME command structure (M + 8 C segments + Z), which is what lets CSS
 * `d: path()` keyframes tween between them cleanly — the same constraint
 * Framer Motion / any path interpolator has.
 *
 * Shapes are organic (liquid/metaball, not geometric): points are placed
 * around a circle with per-variant radius + angle jitter, then smoothed with
 * a closed Catmull-Rom → cubic-bezier conversion.
 *
 * Deterministic (seeded PRNG) so re-runs reproduce the committed paths.
 * Usage: node scripts/generate-blobs.mjs  → paste output into TwinBlobs.astro
 */

// mulberry32 — tiny seeded PRNG, deterministic across runs
function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One organic ring of points: even angles with jitter, radius wobble. */
function blobPoints(rand, cx, cy, baseR, points) {
  const pts = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2 + (rand() - 0.5) * 0.42;
    const r = baseR * (0.76 + rand() * 0.32); // 0.76–1.08 × base radius
    pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }
  return pts;
}

/** Closed Catmull-Rom spline → SVG cubic-bezier path string. */
function toPath(pts) {
  const n = pts.length;
  const f = (v) => v.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + ' Z';
}

function blobVariants({ name, seed, cx, cy, baseR, variants = 5, points = 8 }) {
  const rand = prng(seed);
  const paths = Array.from({ length: variants }, () =>
    toPath(blobPoints(rand, cx, cy, baseR, points))
  );
  return { name, paths };
}

// Geometry lives in a 640×520 viewBox; A sits left and larger, B right and
// smaller, slightly overlapping — siblings, not twins.
const blobs = [
  blobVariants({ name: 'A', seed: 11, cx: 235, cy: 250, baseR: 172 }),
  blobVariants({ name: 'B', seed: 47, cx: 448, cy: 288, baseR: 136 }),
];

for (const { name, paths } of blobs) {
  console.log(`/* Blob ${name} morph targets */`);
  paths.forEach((p, i) => console.log(`--blob-${name.toLowerCase()}-${i}: path('${p}');`));
  console.log('');
}
