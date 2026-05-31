const fs = require('fs');
const path = require('path');

const parsedPath = path.join(__dirname, 'parsed_products.json');
if (fs.existsSync(parsedPath)) {
  const products = JSON.parse(fs.readFileSync(parsedPath, 'utf8'));
  console.log('--- parsed_products.json ---');
  products.forEach(p => {
    if (p.name.match(/netflix|boost|prime|youtube|nord|disney|crunchy|spotify|max|paramount|nba|dazn|chatgpt/i)) {
      console.log(`Name: ${p.name}`);
      console.log(`Slug: ${p.slug}`);
      console.log(`Image: ${p.imageUrl}`);
      console.log('---');
    }
  });
}
