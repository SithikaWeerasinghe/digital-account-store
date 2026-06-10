import { NextRequest, NextResponse } from 'next/server';
import { verifyOvgcSignature } from '@/lib/services/ovgcPaymentService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/webhooks/ovgc — SCAFFOLD
 *
 * Receives OVGC payment notifications. This is intentionally NOT implemented:
 * until OVGC documents the signature scheme and payload, we cannot verify
 * authenticity, so we MUST NOT mark any order paid or deliver anything.
 *
 * When implementing (see docs/ovgc-integration-requirements.md):
 *   1. Read the raw body and the OVGC signature header (TODO: header name).
 *   2. verifyOvgcSignature(rawBody, signature) — reject (401) if invalid.
 *   3. Parse payload; resolve order(s) by checkout_reference / provider_payment_id.
 *   4. mapOvgcStatus(status): on 'paid' → reuse the SAME idempotent paid+deliver
 *      pipeline used by NOWPayments (mark paid, paid_at, deliverOrder, email).
 *      On 'failed'/'expired' → do NOT deliver.
 */
export async function POST(request: NextRequest) {
  // Read raw body for future signature verification (kept verbatim).
  const rawBody = await request.text().catch(() => '');
  // TODO(OVGC): replace 'x-ovgc-signature' with the real header name from docs.
  const signature = request.headers.get('x-ovgc-signature');

  // Signature verification is not implemented yet → always treat as unverified.
  const verified = verifyOvgcSignature(rawBody, signature); // currently always false

  if (!verified) {
    // Never process/mark paid without a verified signature.
    console.warn('[ovgc webhook] Received but OVGC integration is not implemented — ignoring.');
    return NextResponse.json(
      { success: false, code: 'not_implemented', message: 'OVGC webhook is not implemented yet.' },
      { status: 501 }
    );
  }

  // Unreachable until verifyOvgcSignature is implemented. Left as a guard so no
  // path can ever mark an order paid from this placeholder.
  return NextResponse.json(
    { success: false, code: 'not_implemented', message: 'OVGC webhook processing is not implemented yet.' },
    { status: 501 }
  );
}

// OVGC may probe the endpoint — respond OK to GET.
export async function GET() {
  return NextResponse.json({ success: true, service: 'ovgc-webhook', status: 'scaffold' });
}
