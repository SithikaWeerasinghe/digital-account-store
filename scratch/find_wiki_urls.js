const https = require('https');
const crypto = require('crypto');

const brandCandidates = {
  "netflix": [
    "Netflix_2015_logo.svg",
    "Netflix_logo.svg",
    "Netflix_icon.svg"
  ],
  "discord": [
    "Discord_logo.svg",
    "Discord_Logo.svg",
    "Discord_Color_Logo.svg",
    "Discord_icon.svg",
    "Discord_Server_Boost_badge.svg",
    "Discord_Server_Boost_badge.png"
  ],
  "nordvpn": [
    "NordVPN_logo.svg",
    "NordVPN_Logo.svg",
    "Nordvpn_logo.svg",
    "Nordvpn_Logo.svg",
    "NordVPN_icon.svg"
  ],
  "crunchyroll": [
    "Crunchyroll_logo.svg",
    "Crunchyroll_Logo.svg",
    "Crunchyroll_icon.svg"
  ],
  "paramount-plus": [
    "Paramount+_logo.svg",
    "Paramount_Plus_logo.svg",
    "Paramount_Plus_Logo.svg"
  ],
  "nba": [
    "National_Basketball_Association_logo.svg",
    "NBA_logo.svg",
    "NBA_Logo.svg",
    "NBA_logo_logotype.svg"
  ],
  "dazn": [
    "DAZN_logo.svg",
    "DAZN_Logo.svg",
    "Dazn_logo.svg"
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
  console.log('Searching for working Wikimedia Commons URLs with a 2-second delay to avoid rate limit...');
  for (const [brand, filenames] of Object.entries(brandCandidates)) {
    console.log(`\nBrand: ${brand}`);
    for (const filename of filenames) {
      const url = getWikiUrl(filename);
      const status = await testUrl(url);
      if (status === 200) {
        console.log(`  [FOUND] ${filename} -> ${url}`);
      } else {
        console.log(`  [FAIL] ${filename} (${status})`);
      }
      await sleep(2000); // 2 seconds delay
    }
  }
}

run();
