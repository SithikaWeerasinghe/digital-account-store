'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { signInAdmin } from '@/lib/adminAuth';
import { Radio } from 'lucide-react';
import ApexFledLogo from '@/components/ui/ApexFledLogo';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email || !password) {
        setError('Email and password are required');
        setIsLoading(false);
        return;
      }

      await signInAdmin(email, password);
      router.push(ROUTES.ADMIN.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or not authorized as admin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden font-sans">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Glowing Lobby Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#009ee3]/3 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#fff159]/4 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-8 rounded-2xl border border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.03)] cyber-corners relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#009ee3]/40 to-transparent"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 text-[9px] font-black tracking-widest text-[#009ee3] rounded-full font-mono uppercase mb-4 shadow-inner">
            <Radio className="w-3 h-3 animate-pulse" /> ADMIN CONSOLE
          </div>
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="drop-shadow-[0_0_10px_rgba(59,130,246,0.45)]">
              <ApexFledLogo size={40} id="login" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-widest uppercase font-heading">
              APEX<span className="text-primary font-bold">FLED</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1">Sign in to initialize session</p>
        </div>
        
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-[10px] font-black tracking-widest uppercase text-slate-500 mb-1.5 font-mono">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-slate-55/70 text-slate-800 border border-slate-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/40 focus:outline-none rounded-xl py-3 px-4 text-xs font-mono transition-all focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black tracking-widest uppercase text-slate-500 mb-1.5 font-mono">Access Key / Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-55/70 text-slate-800 border border-slate-200 focus:border-primary/50 focus:ring-1 focus:ring-[#009ee3]/40 focus:outline-none rounded-xl py-3 px-4 text-xs font-mono transition-all focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center justify-between mt-2 font-mono text-[10px] tracking-wider uppercase font-black">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-650 select-none">
              <input 
                type="checkbox" 
                className="rounded bg-slate-50 border-slate-200 text-primary focus:ring-primary focus:ring-offset-white w-3.5 h-3.5" 
              />
              <span>Remember Key</span>
            </label>
            <Link href="#" className="text-primary hover:text-[#008cc9] transition-colors">Forgot Key?</Link>
          </div>
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-[10px] px-4 py-2.5 rounded-xl font-mono">
              SYSTEM_ERROR: {error.toUpperCase()}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full text-center block mt-6 py-3.5 bg-primary hover:bg-[#008cc9] text-white font-black font-heading tracking-widest uppercase rounded-xl shadow-[0_4px_16px_rgba(0,158,227,0.25)] hover:shadow-[0_4px_24px_rgba(0,158,227,0.45)] hover:translate-y-[-1px] active:translate-y-[0px] transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'INITIALIZING...' : 'INITIALIZE SYSTEM'}
          </button>
        </form>
      </div>
    </div>
  );
}
