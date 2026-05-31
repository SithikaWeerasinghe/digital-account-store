const https = require('https');
const crypto = require('crypto');

const candidates = {
  "discord": [
    "Discord_logo.svg",
    "Discord_Logo.svg",
    "Discord_logo_with_wordmark.svg",
    "Discord_logo_2021.svg",
    "Discord_Logo_2021.svg"
  ],
  "nba": [
    "National_Basketball_Association_logo.svg",
    "NBA_logo.svg",
    "NBA_Logo.svg",
    "National_Basketball_Association_logo.png"
  ]
};

function getWikiEnUrl(filename) {
  const cleanName = filename.split(' ').join('_');
  const md5 = crypto.createHash('md5').update(cleanName).digest('hex');
  const a = md5[0];
  const ab = md5.slice(0, 2);
  return `https://upload.wikimedia.org/wikipedia/en/${a}/${ab}/${cleanName}`;
}

function testUrl(url) {
  return new Promise((resolve) => {
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'DigitalAccountStoreLogoDownloaderBot/1.0 (sithikaweerasinghe@gmail.com) Node.js/16'
      }
    };
    const req = https.get(url, options, (res) => {
      resolve(res.statusCode);
      res.resume();
    });
    req.on('error', () => {
      resolve(500);
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Testing GET on Wikipedia English (/wikipedia/en/) candidates...');
  for (const [brand, filenames] of Object.entries(candidates)) {
    console.log(`\nBrand: ${brand}`);
    for (const filename of filenames) {
      const url = getWikiEnUrl(filename);
      const status = await testUrl(url);
      if (status === 200) {
        console.log(`  [FOUND] ${filename} -> ${url}`);
      } else {
        console.log(`  [FAIL] ${filename} (${status})`);
      }
      await sleep(2000);
    }
  }
}

run();
