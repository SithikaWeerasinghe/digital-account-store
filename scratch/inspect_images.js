const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/sampleProducts.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Transpile typescript file to raw javascript
const jsContent = content
  .replace(/import\s+.*?;/g, '')
  .replace(/export\s+const\s+sampleProducts:\s+Product\[\]\s*=/g, 'const sampleProducts =')
  + '\nmodule.exports = sampleProducts;';

const tempFilePath = path.join(__dirname, 'temp_inspect_images.js');
fs.writeFileSync(tempFilePath, jsContent, 'utf8');

try {
  const sampleProducts = require(tempFilePath);
  sampleProducts.forEach((p, idx) => {
    console.log(`${String(idx + 1).padStart(2)}: ${p.name.padEnd(45)} -> ${p.imageUrl}`);
  });
} catch (err) {
  console.error('Error:', err.message);
} finally {
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
}
