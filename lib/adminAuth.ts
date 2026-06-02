import { supabase } from '@/lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

/**
 * Get the current authenticated admin user from Supabase Auth.
 * Returns the user object if logged in, null otherwise.
 */
export async function getCurrentAuthUser() {
  try {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error: any) {
    console.error('[adminAuth] getCurrentAuthUser error:', error);
    return null;
  }
}

/**
 * Get the current authenticated admin from Supabase Auth + admin_users table.
 * Checks both session AND admin_users authorization.
 * Returns the admin user if authorized, null otherwise.
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return null;

    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, role, created_at')
      .eq('email', user.email)
      .eq('role', 'admin')
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      role: data.role,
      createdAt: data.created_at,
    };
  } catch (error: any) {
    console.error('[adminAuth] getCurrentAdmin error:', error);
    return null;
  }
}

/**
 * Check if a given email is authorized as an admin.
 * Does NOT require an active session.
 */
export async function checkIsAdmin(email: string): Promise<boolean> {
  try {
    if (!supabase || !email) return false;

    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .eq('role', 'admin')
      .single();

    return !error && !!data;
  } catch (error: any) {
    console.error('[adminAuth] checkIsAdmin error:', error);
    return false;
  }
}

/**
 * Sign out the current admin user from Supabase Auth.
 */
export async function signOutAdmin() {
  try {
    if (!supabase) return;
    await supabase.auth.signOut();
  } catch (error: any) {
    console.error('[adminAuth] signOutAdmin error:', error);
  }
}

/**
 * Sign in admin with email and password using Supabase Auth.
 * After successful auth, verify the user is in admin_users table.
 * Returns the admin user if successful, throws error otherwise.
 */
export async function signInAdmin(email: string, password: string): Promise<AdminUser> {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Invalid email or password');
    }

    // Verify the user is authorized as an admin
    const isAdmin = await checkIsAdmin(email);
    if (!isAdmin) {
      // Sign out the user if they're not authorized
      await supabase.auth.signOut();
      throw new Error('You are not authorized as an admin');
    }

    // Get and return the admin record
    const admin = await getCurrentAdmin();
    if (!admin) {
      await supabase.auth.signOut();
      throw new Error('Admin profile not found');
    }

    return admin;
  } catch (error: any) {
    throw error;
  }
}
