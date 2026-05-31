const fs = require('fs');

const html = fs.readFileSync('scratch/final_page.html', 'utf8');

// Find all matches for data-name blocks
const regex = /<div\s+[^>]*data-name="([^"]+)"[\s\S]*?<a class="block[^"]*" href="([^"]+)"[\s\S]*?<h3 class="text-lg font-bold truncate">([\s\S]*?)<\/h3>([\s\S]*?)<\/a>/g;

let match;
const products = [];

while ((match = regex.exec(html)) !== null) {
  const dataName = match[1].trim();
  const href = match[2].trim();
  const title = match[3].trim();
  const innerHtml = match[4];

  // Extract image
  const imgMatch = innerHtml.match(/<img\s+[^>]*src="([^"]+)"/);
  const imageUrl = imgMatch ? imgMatch[1].trim() : '';

  // Extract price (look for the first price, which is active price)
  const priceMatch = innerHtml.match(/appCurrency\.format\(([\d.]+),\s*'([A-Z]{3})'\)/);
  const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
  const currency = priceMatch ? priceMatch[2] : 'EUR';

  // Extract original price if present
  let originalPrice = undefined;
  const restHtml = innerHtml.slice(innerHtml.indexOf('appCurrency.format'));
  const origPriceMatch = restHtml.slice(50).match(/appCurrency\.format\(([\d.]+),\s*'([A-Z]{3})'\)/);
  if (origPriceMatch) {
    originalPrice = parseFloat(origPriceMatch[1]);
  }

  // Extract stock
  const stockMatch = innerHtml.match(/(\d+|Unlimited)\s+In\s+Stock/i);
  const stockStr = stockMatch ? stockMatch[1].trim() : '0';
  const inStock = stockStr.toLowerCase() === 'unlimited' ? true : parseInt(stockStr) > 0;
  const stockCount = stockStr.toLowerCase() === 'unlimited' ? 999 : parseInt(stockStr);

  // Extract badges/categories (or defaults)
  const badges = [];
  const badgeRegex = /<div class="[^"]*bg-accent-500[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
  let badgeMatch;
  while ((badgeMatch = badgeRegex.exec(innerHtml)) !== null) {
    badges.push(badgeMatch[1].trim());
  }

  // Determine category based on title or badges
  let category = 'Digital Goods';
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('netflix') || lowerTitle.includes('spotify') || lowerTitle.includes('disney') || lowerTitle.includes('youtube') || lowerTitle.includes('crunchyroll') || lowerTitle.includes('hulu') || lowerTitle.includes('paramount') || lowerTitle.includes('hbo')) {
    category = 'Streaming';
  } else if (lowerTitle.includes('chatgpt') || lowerTitle.includes('claude') || lowerTitle.includes('perplexity') || lowerTitle.includes('office') || lowerTitle.includes('canva') || lowerTitle.includes('vpn') || lowerTitle.includes('nordvpn') || lowerTitle.includes('windscribe')) {
    category = 'Productivity';
  } else if (lowerTitle.includes('fortnite') || lowerTitle.includes('minecraft') || lowerTitle.includes('steam') || lowerTitle.includes('valorant') || lowerTitle.includes('gta') || lowerTitle.includes('origin') || lowerTitle.includes('ubisoft') || lowerTitle.includes('epic')) {
    category = 'Gaming';
  }

  // Extract slug from href
  const slugParts = href.split('/');
  const slug = slugParts[slugParts.length - 1] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Set description
  const description = `Premium access to ${title}. Fully working digital account/key delivered instantly to your email.`;

  products.push({
    id: `prod-${products.length + 1}`,
    name: title,
    slug,
    category,
    description,
    price,
    originalPrice,
    imageUrl,
    features: ['Instant email delivery', 'Working subscription', 'Customer support access', 'Secure warranty'],
    inStock,
    stock_count: stockCount,
    isInstantDelivery: innerHtml.includes('Instant Delivery') || innerHtml.includes('Instant'),
    rating: 4.8 + Math.random() * 0.2, // Mock premium rating
    reviews_count: Math.floor(10 + Math.random() * 40)
  });
}

console.log(`Extracted ${products.length} products!`);
fs.writeFileSync('scratch/parsed_products.json', JSON.stringify(products, null, 2));
console.log('Saved product list to scratch/parsed_products.json');
