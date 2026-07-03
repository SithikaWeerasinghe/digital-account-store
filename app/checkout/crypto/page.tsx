'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Bitcoin, Copy, Check, AlertCircle, ShieldCheck, LifeBuoy } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { fetchCryptoConfig, CryptoWalletInfo } from '@/lib/api';

function formatEUR(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(n);
}

type CryptoOrderSummary = {
  email: string;
  amountEUR: number;
  primaryRef: string;
  refs: string[];
  items: { name: string; plan: string | null; warranty: string | null; quantity: number; price: number }[];
};

function CryptoInstructionsContent() {
  const searchParams = useSearchParams();
  const urlRef = searchParams.get('ref') || '';

  const [summary, setSummary] = useState<CryptoOrderSummary | null>(null);
  const [wallets, setWallets] = useState<CryptoWalletInfo[]>([]);
  const [supportNote, setSupportNote] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load the order summary saved by checkout (best-effort) and the wallet config.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('cryptoOrder');
      if (raw) setSummary(JSON.parse(raw) as CryptoOrderSummary);
    } catch {
      // ignore — page still works with the URL ref alone
    }
    (async () => {
      const config = await fetchCryptoConfig();
      setWallets(config.wallets);
      setSupportNote(config.supportNote);
    })();
  }, []);

  const reference = summary?.primaryRef || urlRef;

  const handleCopy = async (wallet: CryptoWalletInfo) => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopiedId(wallet.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard blocked — the address is still visible to copy manually
    }
  };

  return (
    <div className="min-h-[70vh] py-12 px-4 relative overflow-hidden bg-background text-text-primary font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>

      <div className="max-w-2xl mx-auto relative z-10 space-y-6">
        {/* Header */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-600 blur-[1px]"></div>
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Bitcoin size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-text-primary mb-2 uppercase tracking-wide">
            Crypto Payment Instructions
          </h1>
          <p className="text-text-secondary text-sm sm:text-base">
            Your order has been received. <span className="font-bold">Payment status: Pending crypto confirmation.</span>
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-xs font-black uppercase tracking-widest">
            <AlertCircle size={14} /> Manual Verification Required
          </div>
        </div>

        {/* 1. Order Summary */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-lg font-black font-heading uppercase tracking-widest text-text-primary mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-3 border-b border-border/60 pb-3">
              <span className="text-text-secondary/80">Order Reference</span>
              <span className="font-bold text-text-primary font-mono break-all text-right">{reference || '—'}</span>
            </div>
            {summary?.items?.map((it, i) => (
              <div key={i} className="flex justify-between gap-3 border-b border-border/60 pb-3">
                <div className="min-w-0">
                  <p className="font-semibold text-text-primary">{it.name}</p>
                  {it.plan && <p className="text-xs text-text-secondary">Product / Plan: {it.plan}</p>}
                  {it.warranty && <p className="text-xs text-text-secondary">Warranty: {it.warranty}</p>}
                </div>
                <span className="font-black text-text-primary whitespace-nowrap">
                  {formatEUR(it.price * it.quantity)}
                </span>
              </div>
            ))}
            {summary?.email && (
              <div className="flex justify-between gap-3 border-b border-border/60 pb-3">
                <span className="text-text-secondary/80">Delivery Email</span>
                <span className="font-semibold text-text-primary break-all text-right">{summary.email}</span>
              </div>
            )}
            <div className="flex justify-between items-center gap-3 pt-1">
              <span className="text-base font-black font-heading uppercase tracking-widest text-text-primary">Amount Due</span>
              <span className="text-2xl font-black text-primary">
                {summary ? formatEUR(summary.amountEUR) : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Wallet Options */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-lg font-black font-heading uppercase tracking-widest text-text-primary mb-2">Wallet Options</h2>
          <p className="text-sm text-text-secondary mb-5">
            Send the payment using one of the wallet options below.
          </p>
          {wallets.length > 0 ? (
            <div className="space-y-3">
              {wallets.map((w) => (
                <div key={w.id} className="border border-border rounded-xl p-4 bg-secondary-background">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm font-black font-heading uppercase tracking-wider text-text-primary">
                      {w.coin} <span className="text-text-secondary/70 font-semibold normal-case">· {w.network}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(w)}
                      className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors"
                    >
                      {copiedId === w.id ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === w.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="font-mono text-xs sm:text-sm text-text-primary break-all bg-white border border-border rounded-lg px-3 py-2">
                    {w.address}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm flex gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              Wallet addresses are not configured yet. Please contact support to complete your crypto payment.
            </div>
          )}
        </div>

        {/* 3. Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-blue-600" size={18} />
            <h2 className="text-base font-black font-heading uppercase tracking-widest text-blue-800">Important Notice</h2>
          </div>
          <ul className="space-y-2 text-sm text-blue-800/90 list-disc pl-5">
            <li>Crypto payments are <span className="font-bold">manually verified</span> by our team.</li>
            <li>Your access details are delivered <span className="font-bold">only after payment confirmation</span>.</li>
            <li>
              After paying, contact support with your <span className="font-bold">order reference</span>
              {' '}({reference || 'your order ID'}) and your <span className="font-bold">transaction hash</span>.
            </li>
          </ul>
          {supportNote && (
            <p className="text-xs text-blue-700/80 mt-4 border-t border-blue-200 pt-3">{supportNote}</p>
          )}
        </div>

        {/* 4. Support CTA */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-3">
          <Link
            href={ROUTES.SUPPORT}
            className="mp-button-primary w-full inline-flex items-center justify-center gap-2 py-3.5"
          >
            <LifeBuoy size={18} /> Contact Support
          </Link>
          <Link
            href={ROUTES.HOME}
            className="block text-text-secondary hover:text-primary text-sm font-bold tracking-wider uppercase transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCryptoPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <CryptoInstructionsContent />
    </Suspense>
  );
}
