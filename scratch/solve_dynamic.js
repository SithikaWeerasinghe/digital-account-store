const crypto = require('crypto');
const fs = require('fs');

async function run() {
  const url = 'https://apexfled.mysellauth.com/';
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  console.log('Step 1: Fetching challenge page...');
  const res = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    }
  });

  const html = await res.text();
  console.log('Challenge HTML length:', html.length);

  // Extract the hex code (value of c) using regex
  const match = html.match(/a0_0x2a54=\['([A-F0-9]{40})'/);
  if (!match) {
    console.error('Could not find challenge hex code in HTML!');
    fs.writeFileSync('scratch/failed_page.html', html);
    return;
  }

  const c = match[1];
  console.log('Extracted challenge c:', c);

  // Solve the puzzle
  const n1 = parseInt(c[0], 16);
  let i = 0;
  let solvedCookie = '';
  while (true) {
    const hash = crypto.createHash('sha1');
    hash.update(c + i);
    const buf = hash.digest();
    if (buf[n1] === 0xb0 && buf[n1 + 1] === 0x0b) {
      solvedCookie = 'yX3=' + c + i;
      break;
    }
    i++;
  }
  console.log(`Solved cookie: ${solvedCookie} (after ${i} iterations)`);

  console.log('Step 2: Fetching final page with solved cookie...');
  const finalRes = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cookie': solvedCookie
    }
  });

  console.log('Final Status:', finalRes.status);
  const finalHtml = await finalRes.text();
  fs.writeFileSync('scratch/final_page.html', finalHtml);
  console.log('Saved final page. Length:', finalHtml.length);
}

run();
