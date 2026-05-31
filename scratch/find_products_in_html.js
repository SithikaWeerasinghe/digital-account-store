const fs = require('fs');

const html = fs.readFileSync('scratch/final_page.html', 'utf8');

const keywords = ['Netflix', 'Spotify', 'ChatGPT', 'Claude', 'Office', 'VPN', 'Minecraft', 'Fortnite', 'Steam'];
console.log('Searching for keywords...');

keywords.forEach(keyword => {
  let idx = 0;
  let count = 0;
  while ((idx = html.indexOf(keyword, idx)) !== -1) {
    count++;
    if (count === 1) {
      console.log(`\nFound "${keyword}" at position ${idx}:`);
      console.log(html.slice(Math.max(0, idx - 150), Math.min(html.length, idx + 250)));
    }
    idx += keyword.length;
  }
  console.log(`Total matches for "${keyword}": ${count}`);
});
