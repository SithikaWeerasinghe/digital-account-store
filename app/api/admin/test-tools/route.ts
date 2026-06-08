import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import { isPaymentTestToolsEnabled } from '@/lib/services/nowpaymentsProcessingService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/test-tools
 * Admin-only. Reports whether payment test tools are enabled (server flag), so
 * the admin UI can show/hide test-only controls. Driven solely by the server
 * env var ENABLE_PAYMENT_TEST_TOOLS — no public/NEXT_PUBLIC flag needed.
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  return NextResponse.json({
    success: true,
    data: { paymentTestTools: isPaymentTestToolsEnabled() },
  });
}
