import Link from 'next/link';
import { ROUTES, APP_NAME } from '@/lib/constants';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">{APP_NAME} Admin</h1>
          <p className="text-text-secondary">Sign in to manage your store</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-white border border-input rounded-md py-2 px-3 focus:ring-2 focus:ring-primary focus:outline-none"
              defaultValue="admin@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-white border border-input rounded-md py-2 px-3 focus:ring-2 focus:ring-primary focus:outline-none"
              defaultValue="password123"
            />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-primary focus:ring-primary" />
              <span className="text-sm text-text-secondary">Remember me</span>
            </label>
            <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
          </div>
          
          <Link href={ROUTES.ADMIN.DASHBOARD} className="mp-button-primary w-full text-center block mt-6 py-2.5">
            Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}
