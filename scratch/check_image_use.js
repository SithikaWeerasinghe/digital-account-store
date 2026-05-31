const fs = require('fs');

const html = fs.readFileSync('scratch/final_page.html', 'utf8');

const target = '708006';
const idx = html.indexOf(target);
if (idx !== -1) {
  console.log(html.slice(Math.max(0, idx - 400), Math.min(html.length, idx + 600)));
} else {
  console.log('Image not found in HTML!');
}
