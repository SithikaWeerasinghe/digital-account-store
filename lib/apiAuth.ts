import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminAuth';

/**
 * Middleware helper for protecting admin API routes.
 * Usage: at the top of your API route handler, call:
 *   const adminCheckResult = await requireAdminAuth();
 *   if (adminCheckResult) return adminCheckResult;
 *
 * Returns null if authorized, or a NextResponse with 401/403 if not.
 */
export async function requireAdminAuth(): Promise<NextResponse | null> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }
    return null; // Authorized
  } catch (error: any) {
    console.error('[apiAuth] requireAdminAuth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication check failed' },
      { status: 401 }
    );
  }
}
