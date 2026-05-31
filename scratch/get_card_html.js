const fs = require('fs');

const html = fs.readFileSync('scratch/final_page.html', 'utf8');

const target = 'Netflix Premium [Lifetime]';
const idx = html.indexOf(target);
if (idx !== -1) {
  // Let us print 2000 characters before and 2000 characters after the keyword
  console.log(html.slice(Math.max(0, idx - 800), Math.min(html.length, idx + 1800)));
} else {
  console.log('Target not found!');
}
