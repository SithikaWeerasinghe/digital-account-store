const https = require('https');
const crypto = require('crypto');

const candidates = {
  "discord": [
    "Discord_logo_2021.svg",
    "Discord_Logo_2021.svg",
    "Discord_logo_(2021).svg",
    "Discord_Logo_(2021).svg",
    "Discord_logo_wordmark_2021.svg",
    "Discord_Logo_Wordmark_2021.svg",
    "Discord_logo_without_text.svg"
  ],
  "nba": [
    "National_Basketball_Association_logo.png",
    "National_Basketball_Association.svg",
    "National_Basketball_Association.png",
    "NBA_logo_2017.svg",
    "NBA_logo_2017.png",
    "NBA_logo.png",
    "NBA_Logo.png",
    "NBA_logo_logotype.png"
  ]
};

function getWikiUrl(filename) {
  const cleanName = filename.split(' ').join('_');
  const md5 = crypto.createHash('md5').update(cleanName).digest('hex');
  const a = md5[0];
  const ab = md5.slice(0, 2);
  return `https://upload.wikimedia.org/wikipedia/commons/${a}/${ab}/${cleanName}`;
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
  console.log('Testing more candidates...');
  for (const [brand, filenames] of Object.entries(candidates)) {
    console.log(`\nBrand: ${brand}`);
    for (const filename of filenames) {
      const url = getWikiUrl(filename);
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
