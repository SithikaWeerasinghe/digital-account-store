const fs = require('fs');

const html = fs.readFileSync('scratch/final_page.html', 'utf8');

const regex = /<img\s+[^>]*src="([^"]+)"/g;
let match;
const images = new Set();
while ((match = regex.exec(html)) !== null) {
  images.add(match[1]);
}

console.log('List of all images found in HTML:');
images.forEach(img => console.log(img));
