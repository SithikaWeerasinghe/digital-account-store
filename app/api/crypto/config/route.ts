import { NextResponse } from 'next/server';
import { getCryptoConfig } from '@/lib/cryptoConfig';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crypto/config
 *
 * Public — returns ONLY the store's receiving wallet addresses and support note
 * so the crypto instructions page can render them. Wallet addresses are public
 * by nature; no private keys or order data are ever exposed here.
 */
export async function GET() {
  try {
    const config = getCryptoConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    // Never break the instructions page — report an empty config on error.
    console.error('[api/crypto/config] Failed:', error?.message || error);
    return NextResponse.json({
      success: true,
      data: { wallets: [], supportNote: '', enabled: false },
    });
  }
}
