const https = require('https');

const urls = {
  "netflix": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Netflix_N_Logo.png",
  "discord": "https://upload.wikimedia.org/wikipedia/commons/1/11/Discord_Server_Boost_badge.svg",
  "prime-video": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Prime_Video_Logo_2024.svg",
  "youtube": "https://upload.wikimedia.org/wikipedia/commons/d/dd/YouTube_Premium_logo.svg",
  "nordvpn": "https://upload.wikimedia.org/wikipedia/commons/f/f0/NordVPN_logo.svg",
  "disney-plus": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
  "crunchyroll": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Crunchyroll_logo.svg",
  "spotify": "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  "hbo-max": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg",
  "paramount-plus": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount%2B_logo.svg",
  "nba": "https://upload.wikimedia.org/wikipedia/commons/0/03/National_Basketball_Association_logo.svg",
  "dazn": "https://upload.wikimedia.org/wikipedia/commons/d/df/DAZN_logo.svg",
  "chatgpt": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
};

function testGet(url) {
  return new Promise((resolve) => {
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'DigitalAccountStoreBot/1.0 (sithikaweerasinghe@gmail.com) Node.js/16'
      }
    };
    const req = https.get(url, options, (res) => {
      resolve(res.statusCode);
      res.resume();
    });
    req.on('error', (err) => {
      resolve(err.message);
    });
  });
}

async function run() {
  console.log('Testing GET on Wikimedia FULL SVG candidates...');
  for (const [key, url] of Object.entries(urls)) {
    const status = await testGet(url);
    console.log(`${key}: ${status}`);
  }
}

run();
