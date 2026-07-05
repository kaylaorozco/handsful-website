/**
 * Waitlist signup endpoint — deployed as a Vercel serverless function.
 *
 * Provider-agnostic by design: it validates the email and forwards the signup
 * as JSON to whatever WAITLIST_WEBHOOK_URL points at (Zapier, Make, a Google
 * Apps Script, or later a Mailchimp/ConvertKit/Supabase adapter). Swapping
 * providers means changing an env var — or, for a native integration, editing
 * only the `forward()` function below.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

// Pragmatic email shape check (full RFC validation is a fool's errand).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Signup {
  email: string;
  source: string;
  timestamp: string;
}

async function forward(signup: Signup): Promise<boolean> {
  const webhookUrl = import.meta.env.WAITLIST_WEBHOOK_URL;
  if (!webhookUrl) {
    // No provider wired up yet — log so signups are at least visible in
    // Vercel function logs, and keep the UX working.
    console.warn('[waitlist] WAITLIST_WEBHOOK_URL not set; signup not stored:', signup.email);
    return false;
  }
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signup),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  let email = '';
  let source = 'unknown';
  let honeypot = '';

  try {
    const type = request.headers.get('content-type') ?? '';
    if (type.includes('application/json')) {
      const body = await request.json();
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

  // Bots fill every field; humans never see the honeypot. Pretend success.
  if (honeypot) return json({ ok: true }, 200);

  email = email.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: 'Please enter a valid email address' }, 422);
  }

  try {
    const stored = await forward({ email, source, timestamp: new Date().toISOString() });
    return json({ ok: true, stored }, 200);
  } catch (err) {
    console.error('[waitlist] forward failed:', err);
    return json({ ok: false, error: 'Something went wrong — please try again' }, 502);
  }
};

function json(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
