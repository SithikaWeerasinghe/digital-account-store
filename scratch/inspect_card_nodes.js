const fs = require('fs');

const html = fs.readFileSync('scratch/final_page.html', 'utf8');

const regex = /<div\s+[^>]*data-name="([^"]+)"[\s\S]*?<a class="block[^"]*" href="([^"]+)"[\s\S]*?<h3 class="text-lg font-bold truncate">([\s\S]*?)<\/h3>/g;

let match;
const cards = [];
while ((match = regex.exec(html)) !== null) {
  cards.push({
    dataName: match[1].trim(),
    href: match[2].trim(),
    title: match[3].trim()
  });
}

console.log(`Total card elements found in HTML: ${cards.length}`);
cards.slice(0, 30).forEach((c, idx) => {
  console.log(`${idx + 1}. Title: "${c.title}" | href: "${c.href}" | data-name: "${c.dataName}"`);
});
