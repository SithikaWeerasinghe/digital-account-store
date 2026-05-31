const fs = require('fs');

async function run() {
  const url = 'https://apexfled.mysellauth.com/';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    fs.writeFileSync('scratch/page.html', html);
    console.log('Saved html to scratch/page.html. Length:', html.length);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
