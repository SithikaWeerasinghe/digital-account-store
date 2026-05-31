const fs = require('fs');

const html = fs.readFileSync('scratch/final_page.html', 'utf8');
console.log(html.slice(196700, 198700));
