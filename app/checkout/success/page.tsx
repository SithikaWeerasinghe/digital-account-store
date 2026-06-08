'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Star, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { createReview } from '@/lib/api';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('external_reference');
  const invoiceNumber = searchParams.get('invoice_number');

  // Mercado Pago appends these to the success back_url after a redirect.
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
  const mpStatus = searchParams.get('status') || searchParams.get('collection_status');
  const merchantOrderId = searchParams.get('merchant_order_id');
  const preferenceId = searchParams.get('preference_id');

  // SECURITY: the redirect is NOT trusted to confirm payment. Only the webhook
  // marks an order paid. We always show "pending confirmation" here, even if
  // Mercado Pago reports status=approved in the URL.
  const orderAmount = searchParams.get('amount') ? `$${searchParams.get('amount')}` : null;

  const lookupId = orderId || invoiceNumber;

  // Order Details state for verifying review eligibility
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  // Review Form states
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formComment, setFormComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!lookupId) {
      setIsLoadingOrder(false);
      return;
    }
    const loadOrder = async () => {
      try {
        setIsLoadingOrder(true);
        const response = await fetch(`/api/orders/${lookupId}`);
        const json = await response.json();
        if (json.success && json.data) {
          setOrderData(json.data);
        }
      } catch (err) {
        console.error('Failed to load order details for review:', err);
      } finally {
        setIsLoadingOrder(false);
      }
    };
    loadOrder();
  }, [lookupId]);

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
      const emailVal = orderData.customerEmail;
      const formattedEmail = `${emailVal}|${formName.trim()}`;

      await createReview({
        rating: formRating,
        comment: formComment.trim(),
        customer_email: formattedEmail,
        product_id: orderData.productId,
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
            Payment Processing
          </h1>
          <p className="text-text-secondary mb-8 text-sm leading-relaxed">
            Your payment is being confirmed. Once the payment is confirmed, your access details will be
            sent to your email automatically.
          </p>

          <div className="bg-slate-50 border border-border rounded-xl p-4 mb-6 text-left text-sm font-mono space-y-2">
            {(orderId || invoiceNumber) && (
              <div className="flex justify-between gap-3">
                <span className="text-text-secondary/70">Order ID:</span>
                <span className="font-bold text-text-primary truncate max-w-[150px]">{orderId || invoiceNumber}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border/60 pt-2">
              <span className="text-text-secondary/70">Order Status:</span>
              <span className="font-bold text-amber-600">Pending Confirmation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary/70">Payment Status:</span>
              <span className="font-bold text-amber-600">Pending</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary/70">Delivery Status:</span>
              <span className="font-bold text-amber-600">Pending</span>
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-2 text-left">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-blue-700 leading-relaxed">
              Payment confirmation is verified securely on our server. This page will not show a paid
              status until Mercado Pago confirms the payment.
            </p>
          </div>

          <div className="space-y-3">
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
          ) : orderData ? (
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

                  <div>
                    <label className="block text-xs font-black tracking-wider uppercase text-text-secondary mb-2">
                      Verified Email
                    </label>
                    <input
                      type="email"
                      value={orderData.customerEmail || ''}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 text-text-secondary/70 rounded-xl px-4 py-3 text-sm font-medium cursor-not-allowed select-none"
                    />
                    <span className="text-[10px] text-text-secondary/60 mt-1 block">Tied securely to your purchase order.</span>
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
