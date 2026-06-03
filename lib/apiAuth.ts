import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

/**
 * Middleware helper for protecting admin API routes.
 * Verifies the Authorization Bearer token and checks admin_users table.
 * Usage: at the top of your API route handler, call:
 *   const adminCheckResult = await requireAdminAuth(request);
 *   if (adminCheckResult) return adminCheckResult;
 *
 * Returns null if authorized, or a NextResponse with 401/403 if not.
 */
export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No bearer token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: 'Authentication service unavailable' },
        { status: 503 }
      );
    }

    // Verify the token using Supabase Admin API
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user?.email) {
      console.error('[apiAuth] Token verification failed:', error);
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if the user is an admin in the admin_users table
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, role')
      .eq('email', data.user.email)
      .eq('role', 'admin')
      .single();

    if (adminError || !adminData) {
      console.warn('[apiAuth] User is not an admin:', data.user.email);
      return NextResponse.json(
        { success: false, message: 'Forbidden: User is not an admin' },
        { status: 403 }
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
