import { sampleProducts } from '@/data/sampleProducts';
import { formatCurrency } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

export default function OrderSummary() {
  // Mock cart items using sample data
  const cartItems = [
    { product: sampleProducts[0], quantity: 1 },
    { product: sampleProducts[2], quantity: 2 },
  ];
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax mock
  const total = subtotal + tax;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-border sticky top-24">
      <h2 className="text-xl font-bold text-text-primary mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {cartItems.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain p-2" />
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-text-primary line-clamp-2">{item.product.name}</h3>
              <p className="text-xs text-text-muted mt-1">Qty: {item.quantity}</p>
            </div>
            <div className="text-right font-semibold text-text-primary">
              {formatCurrency(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex justify-between text-sm text-text-secondary">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-text-secondary">
          <span>Estimated Tax (8%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>
      
      <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
        <span className="font-bold text-text-primary">Total</span>
        <span className="text-2xl font-bold text-text-primary">{formatCurrency(total)}</span>
      </div>
      
      <div className="mt-6 bg-green-50 text-success p-3 rounded-md text-sm flex items-start gap-2">
        <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
        <p>Your purchase is secured with 256-bit encryption. Delivery will be instant upon payment confirmation.</p>
      </div>
    </div>
  );
}
