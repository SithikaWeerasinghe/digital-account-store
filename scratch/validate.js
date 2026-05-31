const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/sampleProducts.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Strip TypeScript imports and types, and evaluate the export const sampleProducts
const jsContent = content
  .replace(/import\s+.*?;/g, '')
  .replace(/export\s+const\s+sampleProducts:\s+Product\[\]\s*=/g, 'const sampleProducts =')
  + '\nmodule.exports = sampleProducts;';

// Write to a temporary file
const tempFilePath = path.join(__dirname, 'temp_sample.js');
fs.writeFileSync(tempFilePath, jsContent, 'utf8');

try {
  const sampleProducts = require(tempFilePath);
  console.log('Successfully loaded', sampleProducts.length, 'products.');
  
  let invalidCount = 0;
  sampleProducts.forEach((p, i) => {
    const missing = [];
    if (!p.id) missing.push('id');
    if (!p.name) missing.push('name');
    if (!p.slug) missing.push('slug');
    if (!p.category) missing.push('category');
    if (p.price === undefined) missing.push('price');
    if (p.rating === undefined) missing.push('rating');
    if (p.reviewsCount === undefined) missing.push('reviewsCount');
    if (p.inStock === undefined) missing.push('inStock');
    if (p.isInstantDelivery === undefined) missing.push('isInstantDelivery');
    if (!p.createdAt) missing.push('createdAt');
    
    if (missing.length > 0) {
      console.log(`Product at index ${i} (${p.name || 'No Name'}) is missing fields:`, missing);
      invalidCount++;
    }
  });
  
  console.log('Validation finished. Invalid products:', invalidCount);
} catch (err) {
  console.error('Failed to load/parse sampleProducts:', err.message);
} finally {
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
}
