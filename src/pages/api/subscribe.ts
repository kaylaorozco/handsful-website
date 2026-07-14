/**
 * Waitlist signup endpoint — deployed as a Vercel serverless function.
 *
 * Adds the email to the Kit (ConvertKit) waitlist form via the v4 API. The
 * form has double opt-in enabled in Kit, so Kit sends the confirmation email
 * and flips the subscriber active when they click it — no email logic here.
 * The confirmation link redirects to /waitlist-confirmed (set in Kit's form
 * settings).
 *
 * Flow (both endpoints are required — a subscriber must exist before it can
 * be added to a form):
 *   1. POST /v4/subscribers                 — upsert the subscriber record
 *   2. POST /v4/forms/{id}/subscribers      — 201: added, Kit sends the
 *      double opt-in email · 200: was already on the form (no re-send)
 */
import type { APIRoute } from 'astro';
import { KIT_API_KEY, KIT_FORM_ID } from 'astro:env/server';
import { SITE } from '../../config';

export const prerender = false;

const KIT_API_BASE = 'https://api.kit.com/v4';

/** The slice of Kit's "add subscriber to form" response we actually read. */
interface KitFormSubscriberResponse {
  subscriber?: { state?: string };
}

// Pragmatic email shape check (full RFC validation is a fool's errand).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort rate limit: per-IP timestamps in module scope. Vercel's Fluid
// Compute reuses function instances, so this survives across requests on the
// same instance — enough to blunt naive abuse without a datastore. It resets
// on cold starts and isn't shared across instances; Kit's own 120 req/min API
// key limit is the hard backstop.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) return true;
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic prune so the map can't grow unbounded on a long-lived instance.
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return false;
}

async function kit(path: string, apiKey: string, body: object): Promise<Response> {
  return fetch(`${KIT_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let email = '';
  let source = 'unknown';
  let honeypot = '';

  try {
    const type = request.headers.get('content-type') ?? '';
    if (type.includes('application/json')) {
      const body = (await request.json()) as Record<string, unknown>;
      email = String(body.email ?? '');
      source = String(body.source ?? source);
      honeypot = String(body.nickname ?? '');
    } else {
      // No-JS fallback: plain form POST
      const form = await request.formData();
      email = String(form.get('email') ?? '');
      source = String(form.get('source') ?? source);
      honeypot = String(form.get('nickname') ?? '');
    }
  } catch {
    return json({ ok: false, error: 'Invalid request body' }, 400);
  }

  // Bots fill every field; humans never see the honeypot. Pretend success
  // without ever touching the Kit API.
  if (honeypot) return json({ ok: true, status: 'confirmation_sent' }, 200);

  email = email.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: 'Please enter a valid email address' }, 422);
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || '';
  if (rateLimited(ip)) {
    return json({ ok: false, error: 'Too many attempts — please try again in a few minutes' }, 429);
  }

  const apiKey = KIT_API_KEY;
  const formId = KIT_FORM_ID;
  if (!apiKey || !formId) {
    // Misconfiguration must not fake success — the visitor would wait for a
    // confirmation email that never comes.
    console.error('[waitlist] KIT_API_KEY / KIT_FORM_ID not set; signup rejected:', email);
    return json({ ok: false, error: 'Signups are briefly unavailable — please try again soon' }, 503);
  }

  try {
    const created = await kit('/subscribers', apiKey, { email_address: email });
    if (created.status === 422) {
      return json({ ok: false, error: 'Please enter a valid email address' }, 422);
    }
    if (!created.ok) throw new Error(`Kit create subscriber responded ${created.status}`);

    const added = await kit(`/forms/${formId}/subscribers`, apiKey, {
      email_address: email,
      // Surfaces where on the site they signed up, in Kit's referrer column.
      referrer: `${SITE.url}/?utm_source=handsful-website&utm_content=${encodeURIComponent(source)}`,
    });
    if (!added.ok) throw new Error(`Kit add to form responded ${added.status}`);

    // 201 = newly added (Kit sends the double opt-in email). 200 = already on
    // the form: `state` tells us whether they ever confirmed. Kit does not
    // re-send the confirmation email in the 200 case.
    if (added.status === 201) {
      return json({ ok: true, status: 'confirmation_sent' }, 200);
    }
    const { subscriber } = (await added.json()) as KitFormSubscriberResponse;
    const status = subscriber?.state === 'active' ? 'already_subscribed' : 'already_pending';
    return json({ ok: true, status }, 200);
  } catch (err) {
    console.error('[waitlist] Kit API call failed:', err);
    return json({ ok: false, error: 'Something went wrong — please try again' }, 502);
  }
};

function json(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
