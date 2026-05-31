const https = require('https');
const fs = require('fs');
const path = require('path');

const candidates = {
  "netflix.svg": [
    "https://www.vectorlogo.zone/logos/netflix/netflix-icon.svg",
    "https://www.vectorlogo.zone/logos/netflix/netflix-ar21.svg"
  ],
  "discord-boost.svg": [
    "https://www.vectorlogo.zone/logos/discordapp/discordapp-icon.svg",
    "https://www.vectorlogo.zone/logos/discord/discord-icon.svg",
    "https://upload.wikimedia.org/wikipedia/commons/1/11/Discord_Server_Boost_badge.svg"
  ],
  "prime-video.svg": [
    "https://www.vectorlogo.zone/logos/amazon_prime/amazon_prime-icon.svg",
    "https://www.vectorlogo.zone/logos/amazon_prime/amazon_prime-ar21.svg",
    "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video_Logo.svg"
  ],
  "youtube.svg": [
    "https://www.vectorlogo.zone/logos/youtube/youtube-icon.svg",
    "https://www.vectorlogo.zone/logos/youtube/youtube-ar21.svg"
  ],
  "nordvpn.svg": [
    "https://www.vectorlogo.zone/logos/nordvpn/nordvpn-icon.svg",
    "https://www.vectorlogo.zone/logos/nordvpn/nordvpn-ar21.svg"
  ],
  "disney-plus.svg": [
    "https://www.vectorlogo.zone/logos/disney/disney-icon.svg",
    "https://www.vectorlogo.zone/logos/disney/disney-ar21.svg",
    "https://www.vectorlogo.zone/logos/disneyplus/disneyplus-icon.svg",
    "https://www.vectorlogo.zone/logos/disneyplus/disneyplus-ar21.svg"
  ],
  "crunchyroll.svg": [
    "https://www.vectorlogo.zone/logos/crunchyroll/crunchyroll-icon.svg",
    "https://www.vectorlogo.zone/logos/crunchyroll/crunchyroll-ar21.svg"
  ],
  "spotify.svg": [
    "https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg",
    "https://www.vectorlogo.zone/logos/spotify/spotify-ar21.svg"
  ],
  "hbo-max.svg": [
    "https://www.vectorlogo.zone/logos/hbomax/hbomax-icon.svg",
    "https://www.vectorlogo.zone/logos/hbomax/hbomax-ar21.svg",
    "https://www.vectorlogo.zone/logos/hbo/hbo-icon.svg"
  ],
  "paramount-plus.svg": [
    "https://www.vectorlogo.zone/logos/paramountplus/paramountplus-icon.svg",
    "https://www.vectorlogo.zone/logos/paramountplus/paramountplus-ar21.svg",
    "https://www.vectorlogo.zone/logos/paramount/paramount-icon.svg"
  ],
  "nba.svg": [
    "https://www.vectorlogo.zone/logos/nba/nba-icon.svg",
    "https://www.vectorlogo.zone/logos/nba/nba-ar21.svg"
  ],
  "dazn.svg": [
    "https://www.vectorlogo.zone/logos/dazn/dazn-icon.svg",
    "https://www.vectorlogo.zone/logos/dazn/dazn-ar21.svg"
  ],
  "chatgpt.svg": [
    "https://www.vectorlogo.zone/logos/openai/openai-icon.svg",
    "https://www.vectorlogo.zone/logos/openai/openai-ar21.svg"
  ]
};

function testUrl(url) {
  return new Promise((resolve) => {
    const options = {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    const req = https.request(url, options, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.end();
  });
}

async function run() {
  console.log('Testing candidates...');
  for (const [key, urls] of Object.entries(candidates)) {
    console.log(`\nProduct: ${key}`);
    let found = false;
    for (const url of urls) {
      const ok = await testUrl(url);
      console.log(`  ${url} -> ${ok ? 'OK' : 'FAIL'}`);
    }
  }
}

run();
