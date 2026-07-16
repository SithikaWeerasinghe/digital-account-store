'use client';

import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Star, Sparkles, MessageSquare, CheckCircle2, RefreshCw } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { createReview } from '@/lib/api';

// Module scope: stable across renders, so the polling effect needs no dep on them.
const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000; // give up after 3 minutes

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('external_reference');

  // Mercado Pago appends these to the success back_url after a redirect.
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
  const mpStatus = searchParams.get('status') || searchParams.get('collection_status');
  const merchantOrderId = searchParams.get('merchant_order_id');
  const preferenceId = searchParams.get('preference_id');

  // SECURITY: the redirect is NOT trusted to confirm payment — `mpStatus` above
  // is display-only and never drives the status shown. Only the webhook marks an
  // order paid; this page merely READS the server-confirmed state below.
  const orderAmount = searchParams.get('amount') ? `$${searchParams.get('amount')}` : null;

  // Order id only. GET /api/orders/[id] no longer accepts invoice numbers (they
  // were enumerable), and no provider redirect ever supplied invoice_number —
  // every success URL carries order_id (Mercado Pago) or external_reference.
  const lookupId = orderId;

  // Order Details state for verifying review eligibility + live status
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [pollTimedOut, setPollTimedOut] = useState(false);

  // Review Form states
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formComment, setFormComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ── Live order status ──────────────────────────────────────────────────────
  // The webhook that confirms payment often lands AFTER the customer is
  // redirected back here, so a single fetch would leave the page stuck on
  // "pending" forever (which is exactly what it used to hardcode). We poll until
  // the order reaches a terminal state, then stop.
  const paymentStatus: string = orderData?.paymentStatus ?? 'pending';
  const deliveryStatus: string = orderData?.deliveryStatus ?? 'pending';

  // Terminal = nothing further will change on its own, so polling can stop.
  const isSettled =
    (paymentStatus === 'paid' && deliveryStatus === 'delivered') ||
    ['failed', 'refunded', 'cancelled'].includes(paymentStatus);

  const fetchOrderStatus = useCallback(async (): Promise<boolean> => {
    if (!lookupId) return true;
    try {
      const response = await fetch(`/api/orders/${lookupId}`, { cache: 'no-store' });
      const json = await response.json();
      if (json.success && json.data) {
        setOrderData(json.data);
        setStatusError('');
        const settled =
          (json.data.paymentStatus === 'paid' && json.data.deliveryStatus === 'delivered') ||
          ['failed', 'refunded', 'cancelled'].includes(json.data.paymentStatus);
        return settled;
      }
      // A 404 here means the order id is unknown — retrying will not help.
      if (response.status === 404) return true;
      return false;
    } catch {
      // Network blip: keep the last known status, surface a hint, keep polling.
      setStatusError('Could not reach the server. Retrying…');
      return false;
    }
  }, [lookupId]);

  // Stamped inside the effect, never during render (Date.now() is impure).
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    if (!lookupId) {
      setIsLoadingOrder(false);
      return;
    }

    startedAtRef.current = Date.now();
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = async (first = false) => {
      const settled = await fetchOrderStatus();
      if (cancelled) return;
      if (first) setIsLoadingOrder(false);
      if (settled) return; // stop: terminal state reached
      if (Date.now() - startedAtRef.current > POLL_TIMEOUT_MS) {
        setPollTimedOut(true); // stop: avoid polling forever
        return;
      }
      timer = setTimeout(() => tick(), POLL_INTERVAL_MS);
    };

    tick(true);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [lookupId, fetchOrderStatus]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    startedAtRef.current = Date.now(); // a manual check restarts the budget
    setPollTimedOut(false);
    await fetchOrderStatus();
    setIsRefreshing(false);
  };

  const labelOf = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const toneFor = (s: string, good: string) =>
    s === good ? 'text-success' : ['failed', 'refunded', 'cancelled'].includes(s) ? 'text-destructive' : 'text-amber-600';

  const isDelivered = paymentStatus === 'paid' && deliveryStatus === 'delivered';
  const isPaid = paymentStatus === 'paid';

  // Progression: Payment processing → Payment confirmed → Preparing delivery → Delivered
  const headline = !orderData
    ? 'Payment Processing'
    : paymentStatus === 'failed'
      ? 'Payment Failed'
      : paymentStatus === 'refunded'
        ? 'Payment Refunded'
        : isDelivered
          ? 'Delivered'
          : isPaid && deliveryStatus === 'failed'
            ? 'Delivery Needs Attention'
            : isPaid
              ? 'Preparing Delivery'
              : 'Payment Processing';

  const headlineDetail = !orderData
    ? 'Your payment is being confirmed securely by the payment provider. Once confirmed, your access details will be sent to your email automatically.'
    : paymentStatus === 'failed'
      ? 'This payment did not go through. You have not been charged for a failed payment — please try again or contact support.'
      : paymentStatus === 'refunded'
        ? 'This order has been refunded. Contact support if you have any questions.'
        : isDelivered
          ? 'Payment confirmed and your access details have been sent to your email.'
          : isPaid && deliveryStatus === 'failed'
            ? 'Your payment is confirmed, but we hit a problem preparing your delivery. Our team has been notified and will resolve it shortly.'
            : isPaid
              ? 'Payment confirmed. We are preparing your access details and will email them to you momentarily.'
              : 'Your payment is being confirmed securely by the payment provider. This page updates automatically — you can safely leave it open.';

  const orderStatusLabel = !orderData
    ? 'Pending Confirmation'
    : isDelivered
      ? 'Completed'
      : ['failed', 'refunded', 'cancelled'].includes(paymentStatus)
        ? labelOf(paymentStatus)
        : isPaid
          ? 'Paid — Awaiting Delivery'
          : 'Pending Confirmation';

  const orderStatusTone = isDelivered
    ? 'text-success'
    : ['failed', 'refunded', 'cancelled'].includes(paymentStatus)
      ? 'text-destructive'
      : 'text-amber-600';

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData) return;
    if (!formName.trim()) {
      setSubmitError('Name is required');
      return;
    }
    if (!formComment.trim()) {
      setSubmitError('Comment is required');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      // Send NO email and no product id: the server resolves both from the
      // order id, so neither can be spoofed and the order endpoint never has to
      // hand the customer's email to the browser.
      await createReview({
        rating: formRating,
        comment: formComment.trim(),
        display_name: formName.trim(),
        order_id: orderData.id,
      });

      setSubmitSuccess(true);
      setFormName('');
      setFormRating(5);
      setFormComment('');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl w-full relative z-10 items-start">
        {/* Left Side: Order Confirmation Receipt */}
        <div className="lg:col-span-5 bg-card p-6 md:p-8 rounded-3xl shadow-2xl border border-border text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-emerald-500 to-green-600 blur-[1px]"></div>

          <div className="w-16 h-16 bg-green-50 text-success rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
            <CheckCircle size={32} />
          </div>

          <h1 className="text-2xl font-bold font-heading text-text-primary mb-2 uppercase tracking-wide">
            {headline}
          </h1>
          <p className="text-text-secondary mb-8 text-sm leading-relaxed">
            {headlineDetail}
          </p>

          <div className="bg-slate-50 border border-border rounded-xl p-4 mb-6 text-left text-sm font-mono space-y-2">
            {orderId && (
              <div className="flex justify-between gap-3">
                <span className="text-text-secondary/70">Order ID:</span>
                <span className="font-bold text-text-primary truncate max-w-[150px]">{orderId}</span>
              </div>
            )}
            {/* Real server-confirmed state (polled). Never derived from the
                redirect's query params. */}
            <div className="flex justify-between border-t border-border/60 pt-2">
              <span className="text-text-secondary/70">Order Status:</span>
              <span className={`font-bold ${orderStatusTone}`}>{orderStatusLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary/70">Payment Status:</span>
              <span className={`font-bold ${toneFor(paymentStatus, 'paid')}`}>{labelOf(paymentStatus)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary/70">Delivery Status:</span>
              <span className={`font-bold ${toneFor(deliveryStatus, 'delivered')}`}>{labelOf(deliveryStatus)}</span>
            </div>
            {paymentId && (
              <div className="flex justify-between gap-3 border-t border-border/60 pt-2">
                <span className="text-text-secondary/70">Payment ID:</span>
                <span className="font-bold text-text-primary truncate max-w-[150px]">{paymentId}</span>
              </div>
            )}
            {merchantOrderId && (
              <div className="flex justify-between gap-3">
                <span className="text-text-secondary/70">Merchant Order:</span>
                <span className="font-bold text-text-primary truncate max-w-[150px]">{merchantOrderId}</span>
              </div>
            )}
            {preferenceId && (
              <div className="flex justify-between gap-3">
                <span className="text-text-secondary/70">Preference:</span>
                <span className="font-bold text-text-primary truncate max-w-[150px]">{preferenceId}</span>
              </div>
            )}
            {mpStatus && (
              <div className="flex justify-between gap-3">
                <span className="text-text-secondary/70">MP Status:</span>
                <span className="font-bold text-text-primary">{mpStatus}</span>
              </div>
            )}
            {orderAmount && (
              <div className="flex justify-between border-t border-border/60 pt-2">
                <span className="text-text-secondary/70">Total Amount:</span>
                <span className="font-bold text-primary">{orderAmount}</span>
              </div>
            )}
          </div>

          {isDelivered ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-2 text-left">
              <CheckCircle2 className="text-success flex-shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-green-800 leading-relaxed">
                Payment confirmed and your access details have been sent to your email. Check your spam
                folder if you don&apos;t see it within a few minutes.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-2 text-left">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
              {/* Provider-neutral: the active card provider may be OVGC or Mercado
                  Pago (CARD_PAYMENT_PROVIDER), and crypto uses NOWPayments — the
                  browser must not claim which one. */}
              <p className="text-xs text-blue-700 leading-relaxed">
                Payment confirmation is verified securely on our server. This page will not show a paid
                status until your payment is confirmed securely by the payment provider.
              </p>
            </div>
          )}

          {statusError && (
            <p className="text-xs text-amber-600 mb-3 font-medium">{statusError}</p>
          )}
          {pollTimedOut && !isSettled && (
            <p className="text-xs text-text-secondary mb-3 font-medium">
              Still waiting on confirmation. Use Refresh Status to check again — your order is safe and
              you will be emailed as soon as it completes.
            </p>
          )}

          <div className="space-y-3">
            {!isSettled && (
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-slate-50 hover:bg-slate-100 text-xs font-bold tracking-wider uppercase text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Checking…' : 'Refresh Status'}
              </button>
            )}
            <Link href={ROUTES.HOME} className="mp-button-primary w-full inline-block py-3 text-center">
              Browse Products
            </Link>
            <Link href={ROUTES.SUPPORT} className="text-text-secondary hover:text-primary text-xs font-bold tracking-wider uppercase transition-colors block">
              Contact Support
            </Link>
          </div>
        </div>

        {/* Right Side: Verified Customer Review Form */}
        <div className="lg:col-span-7 bg-card p-6 md:p-8 rounded-3xl shadow-2xl border border-border relative overflow-hidden min-h-[480px] flex flex-col justify-center">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          {isLoadingOrder ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-text-secondary font-medium">Verifying order details...</p>
            </div>
          ) : orderData && isPaid ? (
            submitSuccess ? (
              <div className="text-center py-8 px-2 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-success/15 border border-success/30 rounded-2xl flex items-center justify-center mb-6 text-success animate-bounce shadow-md">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black font-heading uppercase tracking-widest text-text-primary mb-2">
                  Review Submitted!
                </h3>
                <p className="text-sm text-text-secondary font-medium mb-6 leading-relaxed max-w-sm mx-auto">
                  Thank you for your feedback! Your review for <strong className="text-text-primary">{orderData.productName}</strong> has been submitted successfully and will appear on the store once approved.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5 mb-6">
                  <h3 className="text-xl sm:text-2xl font-black font-heading uppercase tracking-wider text-text-primary whitespace-nowrap">
                    Review Your Purchase
                  </h3>
                  <Sparkles size={22} className="text-primary shrink-0 animate-pulse" />
                </div>

                <p className="text-sm text-text-secondary mb-6 leading-relaxed font-medium">
                  You purchased <span className="text-text-primary font-bold">{orderData.productName}</span>. 
                  Share your experience with other gamers! Your review will be marked as a <span className="text-emerald-600 font-bold">Verified Purchase</span>.
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black tracking-wider uppercase text-text-secondary mb-2">
                      Your Rating
                    </label>
                    <div className="flex gap-1.5 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFormRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="focus:outline-none transition-all duration-150 transform hover:scale-125 cursor-pointer"
                        >
                          <Star
                            size={24}
                            className={`${
                              star <= (hoverRating ?? formRating)
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                                : 'text-slate-350 fill-transparent'
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider uppercase text-text-secondary mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Gamer123"
                      className="w-full bg-secondary-background border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder-text-secondary/35 focus:outline-none focus:border-primary/50 transition-all font-medium"
                      required
                    />
                  </div>

                  {/* The email is intentionally NOT shown here any more: the
                      public order endpoint no longer returns customer PII. The
                      review is still tied to the order's real email, resolved
                      server-side from the order id in POST /api/reviews. */}
                  <div>
                    <label className="block text-xs font-black tracking-wider uppercase text-text-secondary mb-2">
                      Verified Email
                    </label>
                    <p className="w-full bg-slate-100 border border-slate-200 text-text-secondary/70 rounded-xl px-4 py-3 text-sm font-medium">
                      Tied securely to the email on this order.
                    </p>
                    <span className="text-[10px] text-text-secondary/60 mt-1 block">We never show it publicly.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider uppercase text-text-secondary mb-2">
                      Your Feedback
                    </label>
                    <textarea
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      placeholder="Tell us about the delivery and activation speed..."
                      rows={3}
                      className="w-full bg-secondary-background border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder-text-secondary/35 focus:outline-none focus:border-primary/50 transition-all font-medium resize-none"
                      required
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs font-bold text-rose-500 mt-2">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-black font-heading text-sm tracking-widest uppercase py-3.5 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <MessageSquare size={14} /> Submit Verified Review
                      </>
                    )}
                  </button>
                </form>
              </>
            )
          ) : orderData ? (
            /* Order resolved but not paid yet. Polling keeps orderData fresh, so
               this swaps to the review form automatically on confirmation — the
               customer never has to reload. */
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-md font-bold text-text-primary mb-1">Awaiting Payment Confirmation</h3>
              <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                Your purchase will be verified after payment confirmation. The review form will appear
                here automatically — no need to reload.
              </p>
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center">
              <AlertCircle className="text-text-secondary mb-4" size={32} />
              <h3 className="text-md font-bold text-text-primary mb-1">No Purchase Verified</h3>
              <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                To guarantee genuine reviews, feedback can only be submitted after verifying your purchase order.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
