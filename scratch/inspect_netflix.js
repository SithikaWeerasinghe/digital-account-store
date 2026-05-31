const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'final_page.html');
if (!fs.existsSync(htmlPath)) {
  console.log('final_page.html not found!');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');

// Find all image URLs near "Netflix" or in the product cards
let idx = 0;
while ((idx = html.indexOf('Netflix', idx)) !== -1) {
  console.log(`--- Netflix match at index ${idx} ---`);
  const chunk = html.substring(Math.max(0, idx - 500), Math.min(html.length, idx + 1500));
  
  // Extract all src="..." URLs
  const srcRegex = /src="([^"]+)"/g;
  let match;
  while ((match = srcRegex.exec(chunk)) !== null) {
    console.log(`Found image: ${match[1]}`);
  }
  
  idx += 100;
}
