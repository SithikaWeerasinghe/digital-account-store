const crypto = require('crypto');
const fs = require('fs');

const rawProducts = JSON.parse(fs.readFileSync('scratch/parsed_products.json', 'utf8'));

// Format products with UUIDs
const formattedProducts = rawProducts.map((p, index) => {
  const daysAgo = Math.floor(Math.random() * 120);
  const date = new Date(Date.now() - daysAgo * 86400000);
  
  return {
    id: crypto.randomUUID(), // Standard UUID for DB compatibility
    name: p.name,
    slug: p.slug,
    category: p.category,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    features: p.features,
    inStock: p.inStock,
    isInstantDelivery: p.isInstantDelivery,
    rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
    reviewsCount: Math.floor(15 + Math.random() * 120),
    createdAt: date.toISOString()
  };
});

// Save intermediate JSON
fs.writeFileSync('scratch/parsed_products_with_uuids.json', JSON.stringify(formattedProducts, null, 2));

// 1. Write data/sampleProducts.ts
const tsContent = `import { Product } from '../types/product';

export const sampleProducts: Product[] = ${JSON.stringify(formattedProducts, null, 2)};
`;
fs.writeFileSync('data/sampleProducts.ts', tsContent);
console.log('Updated data/sampleProducts.ts');

// 2. Write database/seed.sql
let sqlContent = `-- Digital Account Store Database Seed Data (61 Live Products from Apexfled Store)
-- Generated on ${new Date().toISOString()}

-- Seed Products
INSERT INTO products (id, name, slug, category, description, price, image_url, stock_count, is_active, is_instant_delivery, rating, created_at)
VALUES
`;

const productValues = formattedProducts.map(p => {
  const escapeSql = (str) => str ? str.replace(/'/g, "''") : '';
  const origPriceVal = p.originalPrice !== undefined ? p.originalPrice : 'NULL';
  return `(
    '${p.id}',
    '${escapeSql(p.name)}',
    '${escapeSql(p.slug)}',
    '${escapeSql(p.category)}',
    '${escapeSql(p.description)}',
    ${p.price},
    ${p.imageUrl ? `'${escapeSql(p.imageUrl)}'` : 'NULL'},
    ${p.stock_count || 10},
    TRUE,
    ${p.isInstantDelivery ? 'TRUE' : 'FALSE'},
    ${p.rating},
    '${p.createdAt}'
)`;
});

sqlContent += productValues.join(',\n') + '\nON CONFLICT (slug) DO NOTHING;\n\n';

// Seed reviews
sqlContent += `-- Seed Sample Approved Reviews for products\nINSERT INTO reviews (product_id, customer_email, rating, comment, is_approved, created_at)\nVALUES\n`;

const reviewValues = [];
formattedProducts.slice(0, 15).forEach((p, idx) => {
  const comments = [
    "Absolutely excellent package. Delivery was extremely fast!",
    "Works perfectly as described. Excellent service and support.",
    "Very satisfied with my purchase. Will definitely buy again."
  ];
  const email = `customer${idx + 1}@example.com`;
  const rating = idx % 2 === 0 ? 5 : 4;
  const comment = comments[idx % comments.length];
  
  reviewValues.push(`(
    '${p.id}',
    '${email}',
    ${rating},
    '${comment}',
    TRUE,
    NOW()
)`);
});
sqlContent += reviewValues.join(',\n') + '\nON CONFLICT DO NOTHING;\n\n';

// Seed inventory items
sqlContent += `-- Seed Sample Inventory Items (safe mock digital keys for instant delivery)\nINSERT INTO inventory_items (product_id, delivery_content, status)\nVALUES\n`;

const inventoryValues = formattedProducts.map(p => {
  const key = `${p.slug.toUpperCase()}-MOCK-KEY-${Math.floor(100000 + Math.random() * 900000)}`;
  return `(
    '${p.id}',
    '${key}',
    'available'
)`;
});

sqlContent += inventoryValues.join(',\n') + '\nON CONFLICT DO NOTHING;\n';

fs.writeFileSync('database/seed.sql', sqlContent);
console.log('Updated database/seed.sql');
console.log('Done!');
