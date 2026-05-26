'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { adminLogin } from '@/lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await adminLogin({ email, password });
      router.push(ROUTES.ADMIN.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">{APP_NAME} Admin</h1>
          <p className="text-text-secondary">Sign in to manage your store</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-white border border-input rounded-md py-2 px-3 focus:ring-2 focus:ring-primary focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-white border border-input rounded-md py-2 px-3 focus:ring-2 focus:ring-primary focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-primary focus:ring-primary" />
              <span className="text-sm text-text-secondary">Remember me</span>
            </label>
            <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
          </div>
          
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <button type="submit" disabled={isLoading} className="mp-button-primary w-full text-center block mt-6 py-2.5 disabled:opacity-50">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
