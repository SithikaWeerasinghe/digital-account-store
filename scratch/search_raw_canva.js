const fs = require('fs');

const html = fs.readFileSync('scratch/final_page.html', 'utf8');

let idx = 0;
let count = 0;
while ((idx = html.indexOf('Canva', idx)) !== -1) {
  count++;
  console.log(`\n--- Match ${count} at ${idx} ---`);
  console.log(html.slice(Math.max(0, idx - 100), Math.min(html.length, idx + 400)));
  idx += 5;
}
