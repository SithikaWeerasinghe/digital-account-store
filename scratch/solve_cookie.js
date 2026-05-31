const crypto = require('crypto');
const fs = require('fs');

const c = '653EA7B3F9FC5D6AE9C4D2339CFC5838175CA36F';
const n1 = parseInt(c[0], 16); // 6
console.log('n1 is:', n1);

let i = 0;
let solvedCookie = '';
while (true) {
  const hash = crypto.createHash('sha1');
  hash.update(c + i);
  const buf = hash.digest();
  if (buf[n1] === 0xb0 && buf[n1 + 1] === 0x0b) {
    solvedCookie = 'yX3=' + c + i;
    console.log(`Found! i = ${i}, cookie = ${solvedCookie}`);
    break;
  }
  i++;
  if (i > 10000000) {
    console.log("Not found after 10M iterations");
    break;
  }
}

async function fetchPage() {
  const url = 'https://apexfled.mysellauth.com/';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cookie': solvedCookie
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    fs.writeFileSync('scratch/resolved_page.html', html);
    console.log('Saved resolved HTML. Length:', html.length);
  } catch (err) {
    console.error('Error fetching page:', err);
  }
}

fetchPage();
