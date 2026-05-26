import { Order, OrderItem, CreateOrderInput } from '@/types/order';
import { sampleProducts } from '@/data/sampleProducts';

// Interface representing the database row structure for the orders table
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
}

// Module-scoped in-memory database store for mock data
let inMemoryOrders: DatabaseOrderRow[] = [
  {
    id: 'e39c4d92-284f-464a-a92c-15ba8051db21',
    invoice_number: 'INV-20260525-2849',
    customer_email: 'customer1@example.com',
    product_id: 'prod-1', // Streaming Entertainment Pack
    quantity: 1,
    amount: 19.99,
    payment_method: 'card',
    payment_status: 'paid',
    delivery_status: 'delivered',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'f49c5e03-395f-575b-b03d-26cb9162ec32',
    invoice_number: 'INV-20260525-9102',
    customer_email: 'customer2@example.com',
    product_id: 'prod-3', // AI Productivity Access
    quantity: 2,
    amount: 49.98,
    payment_method: 'crypto',
    payment_status: 'paid',
    delivery_status: 'delivered',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'a59c6f14-406f-686c-c14e-37dc0273fd43',
    invoice_number: 'INV-20260525-4122',
    customer_email: 'customer3@example.com',
    product_id: 'prod-5', // Gaming Digital Bundle
    quantity: 1,
    amount: 14.99,
    payment_method: 'manual',
    payment_status: 'pending',
    delivery_status: 'pending',
    created_at: new Date().toISOString()
  }
];

/**
 * Maps a database order row + matched product metadata to the frontend camelCase 'Order' type.
 */
export function mapDatabaseOrder(row: DatabaseOrderRow): Order {
  const matchedProduct = sampleProducts.find(p => p.id === row.product_id);
  
  const items: OrderItem[] = [
    {
      id: `item-${row.id}`,
      orderId: row.id,
      productId: row.product_id,
      price: Number((row.amount / (row.quantity || 1)).toFixed(2)),
      quantity: row.quantity,
      product: matchedProduct
    }
  ];

  // Map database payment_status to frontend order status type:
  // 'pending' | 'completed' | 'failed' | 'refunded'
  let frontendStatus: 'pending' | 'completed' | 'failed' | 'refunded' = 'pending';
  if (row.payment_status === 'paid') {
    frontendStatus = 'completed';
  } else if (row.payment_status === 'failed') {
    frontendStatus = 'failed';
  } else if (row.payment_status === 'refunded') {
    frontendStatus = 'refunded';
  }

  return {
    id: row.id,
    userId: row.customer_email, // Map email as userId for layout rendering
    items,
    totalAmount: Number(row.amount),
    status: frontendStatus,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    updatedAt: row.created_at,
    // Database-style/snake_case compatibility
    invoice_number: row.invoice_number,
    customer_email: row.customer_email,
    product_id: row.product_id,
    quantity: row.quantity,
    amount: row.amount,
    payment_method: row.payment_method,
    payment_status: row.payment_status,
    delivery_status: row.delivery_status,
    created_at: row.created_at
  };
}

/**
 * Generates a unique, standardized invoice number like INV-YYYYMMDD-RANDOM.
 */
function generateInvoiceNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randSuffix = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit random string
  return `INV-${dateStr}-${randSuffix}`;
}

/**
 * Creates a new order mock-saved in-memory.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const customerEmail = input.customerEmail || input.customer_email;
  const productId = input.productId || input.product_id;
  const paymentMethod = input.paymentMethod || input.payment_method;
  const quantity = input.quantity;

  if (!customerEmail || !customerEmail.includes('@')) {
    throw new Error('A valid customer email is required');
  }

  if (!productId) {
    throw new Error('Product ID is required');
  }

  if (quantity === undefined || quantity === null || Number(quantity) < 1) {
    throw new Error('Quantity must be at least 1');
  }

  const product = sampleProducts.find((p) => p.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const orderAmount = input.amount !== undefined ? Number(input.amount) : Number((product.price * Number(quantity)).toFixed(2));
  
  if (orderAmount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (!paymentMethod || !['card', 'crypto', 'manual'].includes(paymentMethod)) {
    throw new Error('Payment method must be card, crypto, or manual');
  }

  const newRow: DatabaseOrderRow = {
    id: `ord-${Math.random().toString(36).substring(2, 11)}`,
    invoice_number: generateInvoiceNumber(),
    customer_email: customerEmail,
    product_id: productId,
    quantity: Number(quantity),
    amount: orderAmount,
    payment_method: paymentMethod,
    payment_status: 'pending',
    delivery_status: 'pending',
    created_at: new Date().toISOString()
  };

  inMemoryOrders.push(newRow);
  return mapDatabaseOrder(newRow);
}

/**
 * Fetches all orders.
 */
export async function getOrders(): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return inMemoryOrders.map(mapDatabaseOrder);
}

/**
 * Fetches a single order by its unique ID.
 */
export async function getOrderById(id: string): Promise<Order | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const row = inMemoryOrders.find((o) => o.id === id);
  return row ? mapDatabaseOrder(row) : null;
}

/**
 * Fetches an order by its invoice number.
 */
export async function getOrderByInvoiceNumber(invoiceNumber: string): Promise<Order | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const row = inMemoryOrders.find((o) => o.invoice_number === invoiceNumber);
  return row ? mapDatabaseOrder(row) : null;
}
