const fs = require('fs');
const path = require('path');

const parsedPath = path.join(__dirname, 'parsed_products.json');
if (!fs.existsSync(parsedPath)) {
  console.log('parsed_products.json not found!');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(parsedPath, 'utf-8'));
console.log('Parsed products list size:', data.length);
data.slice(0, 10).forEach((p, idx) => {
  console.log(`${idx + 1}: Name: ${p.name}`);
  console.log(`   Image: ${p.image}`);
  console.log(`   Description: ${p.description ? p.description.substring(0, 80) : 'none'}`);
  console.log(`   All keys: ${Object.keys(p).join(', ')}`);
});
