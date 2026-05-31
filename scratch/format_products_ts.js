const fs = require('fs');

const rawProducts = JSON.parse(fs.readFileSync('scratch/parsed_products.json', 'utf8'));

const formattedProducts = rawProducts.map((p, index) => {
  // Generate a realistic ISO date within the last year
  const daysAgo = Math.floor(Math.random() * 120);
  const date = new Date(Date.now() - daysAgo * 86400000);
  
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop', // default fallback if empty
    features: p.features,
    inStock: p.inStock,
    isInstantDelivery: p.isInstantDelivery,
    rating: parseFloat(p.rating.toFixed(1)),
    reviewsCount: p.reviews_count,
    createdAt: date.toISOString()
  };
});

const tsContent = `import { Product } from '../types/product';

export const sampleProducts: Product[] = ${JSON.stringify(formattedProducts, null, 2)};
`;

fs.writeFileSync('data/sampleProducts.ts', tsContent);
console.log('Successfully formatted and updated data/sampleProducts.ts with 61 products!');
