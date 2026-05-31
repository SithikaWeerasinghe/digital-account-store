const fs = require('fs');

const rawProducts = JSON.parse(fs.readFileSync('scratch/parsed_products.json', 'utf8'));

const uniqueProducts = [];
const seenSlugs = new Set();

rawProducts.forEach(p => {
  if (!seenSlugs.has(p.slug)) {
    seenSlugs.add(p.slug);
    uniqueProducts.push(p);
  }
});

console.log('Total raw parsed products:', rawProducts.length);
console.log('Total unique products:', uniqueProducts.length);
console.log('Unique product titles:');
uniqueProducts.forEach((p, idx) => {
  console.log(`${idx + 1}. ${p.name} (${p.price} EUR)`);
});

fs.writeFileSync('scratch/unique_products.json', JSON.stringify(uniqueProducts, null, 2));
