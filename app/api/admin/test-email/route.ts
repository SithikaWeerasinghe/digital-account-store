import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import { isEmailConfigured, sendEmail } from '@/lib/services/emailService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/admin/test-email
 *
 * Admin-only. Sends a test notification to the configured admin address to
 * verify the Resend email setup. Never exposes RESEND_API_KEY (the key stays in
 * the email service, server-side). Logs the attempt/recipient/result — no keys.
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Email is not configured. Set RESEND_API_KEY in the environment.' },
      { status: 400 }
    );
  }

  // Accept either ADMIN_EMAIL or ADMIN_NOTIFICATION_EMAIL.
  const recipient = (process.env.ADMIN_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || '').trim();
  if (!recipient) {
    return NextResponse.json(
      { success: false, message: 'No admin recipient configured. Set ADMIN_EMAIL (or ADMIN_NOTIFICATION_EMAIL).' },
      { status: 400 }
    );
  }

  const subject = 'ApexFled Test Notification';
  const message =
    'This is a test notification from ApexFled. If you received this email, admin email notifications are working correctly.';
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;color:#0f172a;line-height:1.6;padding:8px 0;">${message}</div>`;

  console.log('[test-email] attempting test email →', recipient);
  const result = await sendEmail({ to: recipient, subject, html });

  if (result.success) {
    console.log('[test-email] success → sent to', recipient, '(id:', result.id, ')');
    return NextResponse.json({ success: true, data: { recipient }, message: `Test email sent to ${recipient}.` });
  }

  console.error('[test-email] failure → recipient', recipient, '—', result.error || (result.skipped ? 'skipped (no API key)' : 'unknown error'));
  return NextResponse.json(
    { success: false, message: result.error || 'Failed to send test email. Check Resend configuration.' },
    { status: 502 }
  );
}
