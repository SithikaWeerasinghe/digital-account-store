'use client';

import { useCart } from '@/lib/contexts/CartContext';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading tracking-wide uppercase mb-2">
            Shopping Cart
          </h1>
          <p className="text-sm sm:text-base text-slate-600">Review your items and proceed to checkout</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart size={64} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-black text-slate-800 mb-4 font-heading">Your cart is empty</h2>
            <p className="text-slate-600 mb-8">Add some products to get started</p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center py-3 px-8 bg-primary text-white rounded-xl text-sm font-black font-heading tracking-widest uppercase hover:bg-primary-hover transition-all duration-200 shadow-md"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {items.map((item) => {
                  const itemPrice = item.selectedGuarantee?.total_price
                    ?? item.selectedOption?.price
                    ?? item.selectedVariant?.price
                    ?? item.product.price;
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="border-b border-slate-100 last:border-b-0 p-4 sm:p-6 hover:bg-slate-50/50 transition-colors duration-200"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-lg overflow-hidden">
                          {item.product.imageUrl?.startsWith('http') ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                              <span className="text-2xl">📦</span>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="block text-base sm:text-lg font-black text-slate-900 hover:text-primary transition-colors font-heading line-clamp-2"
                          >
                            {item.product.name}
                          </Link>

                          {item.selectedOption && (
                            <p className="text-xs text-slate-600 mt-1">
                              Product Option: <span className="font-semibold">{item.selectedOption.label}</span>
                            </p>
                          )}

                          {item.selectedGuarantee && (
                            <p className="text-xs text-slate-600 mt-1">
                              Guarantee: <span className="font-semibold">{item.selectedGuarantee.label}</span>
                              {item.selectedGuarantee.monthly_price && ` · €${item.selectedGuarantee.monthly_price.toFixed(2)}/mo`}
                            </p>
                          )}

                          {item.selectedVariant && !item.selectedOption && (
                            <p className="text-xs text-slate-600 mt-1">
                              Product Option: <span className="font-semibold">{item.selectedVariant.label}</span>
                            </p>
                          )}

                          <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">{item.product.category}</p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-3 sm:mt-4">
                            {/* Price */}
                            <div className="text-lg sm:text-xl font-black text-primary mr-auto">
                              €{itemTotal.toFixed(2)}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-white rounded transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} className="text-slate-600" />
                              </button>
                              <span className="w-8 text-center font-semibold text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-white rounded transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} className="text-slate-600" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove from cart"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => clearCart()}
                  className="text-sm text-slate-600 hover:text-red-500 font-semibold transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-black text-slate-900 mb-6 font-heading uppercase">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Items ({items.length})</span>
                    <span className="text-slate-900 font-semibold">
                      {items.reduce((sum, item) => sum + item.quantity, 0)} pcs
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="text-slate-900 font-semibold">€{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-black text-slate-900 font-heading">Total</span>
                  <span className="text-2xl font-black text-primary">€{cartTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-premium-shine py-3 bg-primary text-white rounded-xl text-sm font-black font-heading tracking-widest uppercase hover:bg-primary-hover shadow-md transition-all duration-200 mb-3"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="block w-full text-center py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-black font-heading tracking-widest uppercase hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
