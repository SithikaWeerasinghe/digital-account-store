const fs = require('fs');
const path = require('path');
const https = require('https');

const logosDir = path.join(__dirname, '../public/images/logos');

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const logoUrls = {
  "netflix.svg": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "discord.svg": "https://upload.wikimedia.org/wikipedia/en/9/98/Discord_logo.svg",
  "prime-video.svg": "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg",
  "youtube.svg": "https://upload.wikimedia.org/wikipedia/commons/d/dd/YouTube_Premium_logo.svg",
  "nordvpn.svg": "https://upload.wikimedia.org/wikipedia/commons/4/48/NordVPN_logo.svg",
  "disney-plus.svg": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
  "crunchyroll.svg": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Crunchyroll_Logo.svg",
  "spotify.svg": "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  "hbo-max.svg": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg",
  "paramount-plus.svg": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Paramount+_logo.svg",
  "nba.svg": "https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg",
  "dazn.svg": "https://upload.wikimedia.org/wikipedia/commons/7/71/DAZN_logo.svg",
  "chatgpt.svg": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'DigitalAccountStoreLogoDownloaderBot/1.0 (sithikaweerasinghe@gmail.com) Node.js/16'
      }
    };
    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, options, (res2) => {
          res2.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      } else if (response.statusCode !== 200) {
        fs.unlink(dest, () => {});
        reject(new Error(`Failed to get '${url}' (status code: ${response.statusCode})`));
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Downloading official brand SVGs to public/images/logos/...');
  for (const [filename, url] of Object.entries(logoUrls)) {
    const dest = path.join(logosDir, filename);
    try {
      await download(url, dest);
      console.log(`Successfully downloaded ${filename}`);
    } catch (err) {
      console.error(`Error downloading ${filename}:`, err.message);
    }
    await sleep(2000); // Wait 2s to prevent Wikimedia rate limiting
  }
  console.log('Finished downloading all logos!');
}

run();
