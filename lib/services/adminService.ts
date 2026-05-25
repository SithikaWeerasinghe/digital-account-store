/**
 * Mock Admin Authentication Service.
 * Used strictly for safe dashboard administration verification in development environments.
 */

export interface MockAdminSession {
  success: boolean;
  email: string;
  role: string;
  token: string;
  message?: string;
}

/**
 * Validates admin login challenges against development-only mock credentials.
 * Does not expose or persist password hashes or plaintext values.
 */
export async function mockAdminLogin(email: string, password: string): Promise<MockAdminSession> {
  // Artificial wait to prevent brute force testing
  await new Promise((resolve) => setTimeout(resolve, 300));

  const cleanEmail = email?.trim().toLowerCase();

  // Development mock validation checks matching app/api/admin/login/route.ts credentials
  if (cleanEmail === 'admin@example.com' && password === 'password123') {
    return {
      success: true,
      email: cleanEmail,
      role: 'admin',
      token: 'mock-session-token-decrypted-development',
      message: 'Login successful'
    };
  }

  return {
    success: false,
    email: email || '',
    role: '',
    token: '',
    message: 'Invalid credentials. Access Denied.'
  };
}
