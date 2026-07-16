import { Order, OrderItem, CreateOrderInput } from '@/types/order';
import { sampleProducts } from '@/data/sampleProducts';
import { supabase as anonClient, supabaseAdmin } from '@/lib/supabase';
import { getRedeemableCoupon, incrementCouponUsage } from '@/lib/services/discountService';
import { getInventoryStockStatus, getStockBreakdown } from '@/lib/services/inventoryService';
import { getProductById } from '@/lib/services/productService';

// Orders are only ever accessed server-side (API routes / webhooks). Prefer the
// service-role client so all reads/writes bypass Row-Level Security; fall back to
// the anon client (and then in-memory) only when no Supabase env is configured.
const supabase = supabaseAdmin || anonClient;
import { isPaymentMethodActive } from '@/lib/services/paymentMethodService';

export interface DatabaseOrderRow {
  id: string;
  invoice_number: string;
  customer_email: string;
  product_id: string;
  quantity: number;
  amount: number;
  payment_method: 'card' | 'crypto' | 'manual';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_status: 'pending' | 'delivered' | 'failed';
  created_at: string;
  // Coupon / discount fields
  discount_code?: string | null;
  discount_amount?: number | null;
  original_amount?: number | null;
  final_amount?: number | null;
  // Stripe integration fields (DEPRECATED — kept but unused)
  stripe_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  paid_at?: string | null;
  // Mercado Pago integration fields (ACTIVE gateway)
  mercadopago_preference_id?: string | null;
  mercadopago_payment_id?: string | null;
  mercadopago_merchant_order_id?: string | null;
  mercadopago_status?: string | null;
  // Generic payment provider fields (NOWPayments automatic crypto)
  payment_provider?: string | null;
  provider_payment_id?: string | null;
  checkout_reference?: string | null;
  // Product options and guarantee metadata
  order_metadata?: {
    product_option?: {
      id: string;
      label: string;
      price?: number;
    };
    guarantee?: {
      id: string;
      label: string;
      months?: number;
      total_price?: number;
      monthly_price?: number;
    };
    [key: string]: unknown;
  } | null;
}

// In-memory fallback used when Supabase is not configured
const inMemoryOrders: DatabaseOrderRow[] = [
  {
    id: 'e39c4d92-284f-464a-a92c-15ba8051db21',
    invoice_number: 'INV-20260525-2849',
    customer_email: 'customer1@example.com',
    product_id: 'prod-1',
    quantity: 1,
    amount: 19.99,
    payment_method: 'card',
    payment_status: 'paid',
    delivery_status: 'delivered',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'f49c5e03-395f-575b-b03d-26cb9162ec32',
    invoice_number: 'INV-20260525-9102',
    customer_email: 'customer2@example.com',
    product_id: 'prod-3',
    quantity: 2,
    amount: 49.98,
    payment_method: 'crypto',
    payment_status: 'paid',
    delivery_status: 'delivered',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'a59c6f14-406f-686c-c14e-37dc0273fd43',
    invoice_number: 'INV-20260525-4122',
    customer_email: 'customer3@example.com',
    product_id: 'prod-5',
    quantity: 1,
    amount: 14.99,
    payment_method: 'manual',
    payment_status: 'pending',
    delivery_status: 'pending',
    created_at: new Date().toISOString(),
  },
];

export function mapDatabaseOrder(row: DatabaseOrderRow): Order {
  const matchedProduct = sampleProducts.find((p) => p.id === row.product_id);
  // Prefer the name stored at order time, then any sample match. Real DB
  // products aren't in sampleProducts, so without the stored name the UI/email
  // fell back to the raw product id. getOrders/getOrderById enrich this from the
  // products table for older orders that have no stored name.
  const storedName = (row.order_metadata as any)?.product_name as string | undefined;
  const productName = storedName || matchedProduct?.name || null;
  const items: OrderItem[] = [
    {
      id: `item-${row.id}`,
      orderId: row.id,
      productId: row.product_id,
      price: Number((row.amount / (row.quantity || 1)).toFixed(2)),
      quantity: row.quantity,
      product: matchedProduct,
    },
  ];

  let frontendStatus: 'pending' | 'completed' | 'failed' | 'refunded' = 'pending';
  if (row.payment_status === 'paid') frontendStatus = 'completed';
  else if (row.payment_status === 'failed') frontendStatus = 'failed';
  else if (row.payment_status === 'refunded') frontendStatus = 'refunded';

  return {
    id: row.id,
    userId: row.customer_email,
    items,
    totalAmount: Number(row.amount),
    status: frontendStatus,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    updatedAt: row.created_at,
    invoice_number: row.invoice_number,
    customer_email: row.customer_email,
    product_id: row.product_id,
    product_name: productName,
    quantity: row.quantity,
    amount: row.amount,
    payment_method: row.payment_method,
    payment_status: row.payment_status,
    delivery_status: row.delivery_status,
    created_at: row.created_at,
    stripe_session_id: row.stripe_session_id || null,
    stripe_payment_intent_id: row.stripe_payment_intent_id || null,
    paid_at: row.paid_at || null,
    mercadopago_preference_id: row.mercadopago_preference_id || null,
    mercadopago_payment_id: row.mercadopago_payment_id || null,
    mercadopago_merchant_order_id: row.mercadopago_merchant_order_id || null,
    mercadopago_status: row.mercadopago_status || null,
    payment_provider: row.payment_provider || null,
    provider_payment_id: row.provider_payment_id || null,
    checkout_reference: row.checkout_reference || null,
    order_metadata: row.order_metadata || null,
    discount_code: row.discount_code ?? null,
    discount_amount: row.discount_amount != null ? Number(row.discount_amount) : 0,
    original_amount: row.original_amount != null ? Number(row.original_amount) : null,
    final_amount: row.final_amount != null ? Number(row.final_amount) : null,
  };
}

function generateInvoiceNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `INV-${dateStr}-${randSuffix}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const customerEmail = input.customerEmail || input.customer_email;
  const productId = input.productId || input.product_id;
  const paymentMethod = input.paymentMethod || input.payment_method;
  const quantity = input.quantity;

  if (!customerEmail || !customerEmail.includes('@')) throw new Error('A valid customer email is required');
  if (!productId) throw new Error('Product ID is required');
  if (!quantity || Number(quantity) < 1) throw new Error('Quantity must be at least 1');
  if (!paymentMethod || !['card', 'crypto', 'manual'].includes(paymentMethod)) throw new Error('Payment method must be card, crypto, or manual');

  // Maintenance guard: never create an order for a method an admin has disabled.
  // Fail-open inside isPaymentMethodActive keeps existing flows working if the
  // payment_methods table isn't seeded yet. Cannot be bypassed from the frontend.
  if (!(await isPaymentMethodActive(paymentMethod))) {
    const labels: Record<string, string> = {
      card: 'Card payment',
      crypto: 'Crypto payment',
      manual: 'Manual payment',
    };
    throw new Error(
      `${labels[paymentMethod] || 'This payment method'} is temporarily unavailable. Please choose another payment method.`
    );
  }

  // Look the product up from the DATABASE (with sample fallback), not the static
  // sampleProducts array — admin-created products are not in sampleProducts, so
  // the old lookup threw "Product not found" at checkout for every real product.
  const product = await getProductById(productId);
  if (!product) {
    console.warn(
      `[createOrder] Product lookup FAILED — productId="${productId}" ` +
        `option="${input.selectedOptionLabel ?? '—'}"(${input.selectedOptionId ?? 'null'}) ` +
        `guarantee="${input.selectedGuaranteeLabel ?? '—'}"(${input.selectedGuaranteeId ?? 'null'}) ` +
        `reason="no product row for this id"`
    );
    throw new Error(
      'This product is no longer available (it may have been removed or hidden). Please remove it from your cart and add it again.'
    );
  }

  // ── Stock protection (server-side, authoritative) ──
  // Never let an order be created for more units than the exact selected
  // variant currently has available. Every payment method (card/crypto/manual)
  // creates its order here first, so this gate cannot be bypassed from the
  // frontend or by calling the API directly. Inventory-untracked products are
  // not affected (getInventoryStockStatus returns tracked=false for them).
  const requestedQty = Number(quantity);
  const selectedOptionId = input.selectedOptionId || null;
  const selectedOptionLabel = input.selectedOptionLabel || null;
  const selectedGuaranteeId = input.selectedGuaranteeId || null;
  const selectedGuaranteeLabel = input.selectedGuaranteeLabel || null;
  // Stock is checked for the EXACT product + plan + warranty combination, so an
  // order for one warranty can never be created against another warranty's stock.
  const stock = await getInventoryStockStatus(productId, selectedOptionId, selectedGuaranteeId);
  // Diagnostic log: shows exactly what combination was looked up and what was
  // found, so a "0 available" is traceable to an option/guarantee mismatch.
  console.log(
    `[stock-check] product="${product.name}" (${productId}) option="${selectedOptionLabel ?? '—'}"(${selectedOptionId ?? 'null'}) ` +
      `guarantee="${selectedGuaranteeLabel ?? '—'}"(${selectedGuaranteeId ?? 'null'}) ` +
      `→ tracked=${stock.tracked} available=${stock.available} requested=${requestedQty}`
  );
  if (stock.tracked && stock.available < requestedQty) {
    // Surface what IS in stock for this product so the mismatch is obvious.
    try {
      const breakdown = await getStockBreakdown(productId);
      console.warn(
        `[stock-check] INSUFFICIENT for product="${product.name}" (${productId}). Available stock by combination:`,
        breakdown.length
          ? breakdown.map((b) => `[option=${b.product_option_label ?? b.product_option_id ?? 'null'} warranty=${b.guarantee_label ?? b.guarantee_id ?? 'null'} → ${b.available}]`).join(' ')
          : '(none)'
      );
    } catch {
      /* logging only — never block the order path on a diagnostic */
    }
    const planSuffix = selectedOptionLabel ? ` — ${selectedOptionLabel}` : '';
    const warrantySuffix = selectedGuaranteeLabel ? ` (${selectedGuaranteeLabel})` : '';
    throw new Error(
      `Only ${stock.available} account(s) available for ${product.name}${planSuffix}${warrantySuffix}. Please update your cart.`
    );
  }

  // Pre-discount amount for this order line.
  const originalAmount =
    input.originalAmount !== undefined
      ? Number(input.originalAmount)
      : input.amount !== undefined
        ? Number(input.amount)
        : Number((product.price * Number(quantity)).toFixed(2));
  if (originalAmount <= 0) throw new Error('Amount must be greater than 0');

  // Coupon handling. The discount share is computed on the checkout client
  // (proportionally across cart-item orders), but we re-validate the coupon
  // server-side here so a tampered/expired/fake code never reduces the charge.
  let discountCode: string | null = null;
  let discountAmount = 0;
  if (input.discountCode) {
    const coupon = await getRedeemableCoupon(input.discountCode);
    if (coupon) {
      discountCode = coupon.code;
      // Trust the per-order share from checkout but clamp it to this line's range.
      const requested = Number(input.discountAmount ?? 0);
      discountAmount = Math.min(Math.max(0, Number.isFinite(requested) ? requested : 0), originalAmount);
      discountAmount = Number(discountAmount.toFixed(2));
    }
  }

  const finalAmount = Number(Math.max(0, originalAmount - discountAmount).toFixed(2));
  // `amount` reflects what is actually charged (the discounted total).
  const orderAmount = finalAmount;

  // Build order metadata from selected product option and guarantee.
  // Persist the human-readable product NAME so every later view (admin order
  // detail, customer emails, payment page) shows the name instead of the raw
  // product id (e.g. "prod-qnzgzzdzk").
  const orderMetadata: DatabaseOrderRow['order_metadata'] = { product_name: product.name };

  if (input.selectedOptionId || input.selectedOptionLabel) {
    orderMetadata.product_option = {
      id: input.selectedOptionId || '',
      label: input.selectedOptionLabel || '',
      price: input.selectedOptionPrice,
    };
  }

  if (input.selectedGuaranteeId || input.selectedGuaranteeLabel) {
    orderMetadata.guarantee = {
      id: input.selectedGuaranteeId || '',
      label: input.selectedGuaranteeLabel || '',
      months: input.selectedGuaranteeMonths,
      total_price: input.selectedGuaranteeTotalPrice,
      monthly_price: input.selectedGuaranteeMonthlyPrice,
    };
  }

  const newRow: DatabaseOrderRow = {
    id: `ord-${Math.random().toString(36).substring(2, 11)}`,
    invoice_number: generateInvoiceNumber(),
    customer_email: customerEmail,
    product_id: productId,
    quantity: Number(quantity),
    amount: orderAmount,
    payment_method: paymentMethod as 'card' | 'crypto' | 'manual',
    payment_status: 'pending',
    delivery_status: 'pending',
    created_at: new Date().toISOString(),
    order_metadata: Object.keys(orderMetadata).length > 0 ? orderMetadata : null,
    discount_code: discountCode,
    discount_amount: discountAmount,
    original_amount: originalAmount,
    final_amount: finalAmount,
  };

  // Increment coupon usage once per checkout (the checkout flags only the first
  // order of a multi-item cart). Best-effort — never blocks order creation.
  const shouldIncrementCoupon = !!discountCode && input.incrementCoupon === true;

  if (supabase) {
    const { data, error } = await supabase.from('orders').insert(newRow).select().single();
    if (error) {
      throw new Error(`Failed to save order to database: ${error.message}`);
    }
    if (data) {
      if (shouldIncrementCoupon) await incrementCouponUsage(discountCode!);
      return mapDatabaseOrder(data as DatabaseOrderRow);
    }
  }

  inMemoryOrders.push(newRow);
  if (shouldIncrementCoupon) await incrementCouponUsage(discountCode!);
  return mapDatabaseOrder(newRow);
}

/**
 * Fills in product_name for orders that don't carry one (older orders created
 * before the name was stored, whose product isn't in sampleProducts). One batch
 * query — no N+1. Best-effort: on any error the orders are returned unchanged.
 */
async function attachProductNames(orders: Order[]): Promise<Order[]> {
  if (!supabase || orders.length === 0) return orders;
  const missing = orders.filter((o) => !o.product_name && o.product_id);
  if (missing.length === 0) return orders;
  const ids = Array.from(new Set(missing.map((o) => o.product_id as string)));
  const { data, error } = await supabase.from('products').select('id, name').in('id', ids);
  if (error || !data) return orders;
  const nameById = new Map<string, string>((data as any[]).map((r) => [r.id, r.name]));
  for (const o of orders) {
    if (!o.product_name && o.product_id) {
      const name = nameById.get(o.product_id);
      if (name) o.product_name = name;
    }
  }
  return orders;
}

export async function getOrders(): Promise<Order[]> {
  if (!supabase) return inMemoryOrders.map(mapDatabaseOrder);
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return inMemoryOrders.map(mapDatabaseOrder);
  return attachProductNames(data.map((row) => mapDatabaseOrder(row as DatabaseOrderRow)));
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!supabase) {
    const row = inMemoryOrders.find((o) => o.id === id);
    return row ? mapDatabaseOrder(row) : null;
  }
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
  if (error || !data) return null;
  const order = mapDatabaseOrder(data as DatabaseOrderRow);
  const [enriched] = await attachProductNames([order]);
  return enriched;
}

// NOTE: getOrderByInvoiceNumber was removed deliberately. Invoice numbers are
// INV-<date>-<1000..9999> (see generateInvoiceNumber) — only 9000 combinations
// per day — so allowing a lookup by invoice number made the public order
// endpoint trivially enumerable. Do NOT reintroduce a by-invoice-number lookup
// on any unauthenticated route. Webhooks resolve orders by checkout_reference or
// provider payment id (below), never by invoice number.

/** All orders sharing a checkout reference (one NOWPayments invoice → many orders). */
export async function getOrdersByCheckoutReference(reference: string): Promise<Order[]> {
  if (!reference) return [];
  if (!supabase) {
    return inMemoryOrders.filter((o) => o.checkout_reference === reference).map(mapDatabaseOrder);
  }
  const { data, error } = await supabase.from('orders').select('*').eq('checkout_reference', reference);
  if (error || !data) return [];
  return data.map((row) => mapDatabaseOrder(row as DatabaseOrderRow));
}

/** All orders sharing a provider payment/invoice id. */
export async function getOrdersByProviderPaymentId(providerPaymentId: string): Promise<Order[]> {
  if (!providerPaymentId) return [];
  if (!supabase) {
    return inMemoryOrders.filter((o) => o.provider_payment_id === providerPaymentId).map(mapDatabaseOrder);
  }
  const { data, error } = await supabase.from('orders').select('*').eq('provider_payment_id', providerPaymentId);
  if (error || !data) return [];
  return data.map((row) => mapDatabaseOrder(row as DatabaseOrderRow));
}

// ============================================================
// ADMIN: UPDATE ORDER STATUS
// ============================================================

export interface OrderStatusUpdate {
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_status?: 'pending' | 'delivered' | 'failed';
}

export async function updateOrderStatus(
  id: string,
  update: OrderStatusUpdate
): Promise<Order | null> {
  const allowedPayment = ['pending', 'paid', 'failed', 'refunded'];
  const allowedDelivery = ['pending', 'delivered', 'failed'];

  if (update.payment_status && !allowedPayment.includes(update.payment_status)) {
    throw new Error('Invalid payment status');
  }
  if (update.delivery_status && !allowedDelivery.includes(update.delivery_status)) {
    throw new Error('Invalid delivery status');
  }

  const patch: Record<string, any> = {};
  if (update.payment_status) patch.payment_status = update.payment_status;
  if (update.delivery_status) patch.delivery_status = update.delivery_status;
  if (Object.keys(patch).length === 0) throw new Error('No status fields provided');

  // Stamp paid_at when an admin marks an order paid (e.g. confirming a manual
  // crypto/bank payment). Mirrors what the Mercado Pago webhook records.
  if (update.payment_status === 'paid') {
    patch.paid_at = new Date().toISOString();
  }

  if (!supabase) {
    const row = inMemoryOrders.find((o) => o.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return mapDatabaseOrder(row);
  }

  const { data, error } = await supabase
    .from('orders')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error || !data) {
    throw new Error(error?.message || 'Failed to update order');
  }
  return mapDatabaseOrder(data as DatabaseOrderRow);
}

// ============================================================
// PAYMENT GATEWAY: UPDATE PAYMENT / PROVIDER FIELDS
// Used by the Mercado Pago checkout route (save preference id) and the
// Mercado Pago webhook (save payment id, status, paid_at, mark paid/failed).
// Separate from the admin updateOrderStatus so gateway writes never depend on
// the admin-facing validation rules.
// ============================================================

export interface OrderPaymentFieldsUpdate {
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_status?: 'pending' | 'delivered' | 'failed';
  paid_at?: string | null;
  mercadopago_preference_id?: string | null;
  mercadopago_payment_id?: string | null;
  mercadopago_merchant_order_id?: string | null;
  mercadopago_status?: string | null;
  payment_provider?: string | null;
  provider_payment_id?: string | null;
  checkout_reference?: string | null;
}

export async function updateOrderPaymentFields(
  id: string,
  update: OrderPaymentFieldsUpdate
): Promise<Order | null> {
  // Only write keys that were explicitly provided (allows null to clear a field).
  const patch: Record<string, any> = {};
  for (const [key, value] of Object.entries(update)) {
    if (value !== undefined) patch[key] = value;
  }
  if (Object.keys(patch).length === 0) return getOrderById(id);

  if (!supabase) {
    const row = inMemoryOrders.find((o) => o.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return mapDatabaseOrder(row);
  }

  const { data, error } = await supabase
    .from('orders')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error || !data) {
    throw new Error(error?.message || 'Failed to update order payment fields');
  }
  return mapDatabaseOrder(data as DatabaseOrderRow);
}
