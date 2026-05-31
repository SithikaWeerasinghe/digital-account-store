const fs = require('fs');

const html = fs.readFileSync('scratch/final_page.html', 'utf8');

// Find IPTV images
let idx = 0;
while ((idx = html.indexOf('IPTV Accounts', idx)) !== -1) {
  const segment = html.slice(idx, idx + 1000);
  const imgMatch = segment.match(/<img\s+[^>]*src="([^"]+)"/);
  if (imgMatch) {
    console.log('IPTV Image found:', imgMatch[1]);
  }
  idx += 10;
}

// Find Fortnite images
idx = 0;
while ((idx = html.indexOf('Fortnite Account', idx)) !== -1) {
  const segment = html.slice(idx, idx + 1000);
  const imgMatch = segment.match(/<img\s+[^>]*src="([^"]+)"/);
  if (imgMatch) {
    console.log('Fortnite Image found:', imgMatch[1]);
  }
  idx += 15;
}
