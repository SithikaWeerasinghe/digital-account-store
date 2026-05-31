const fs = require('fs');
const path = require('path');
const https = require('https');

const logosDir = path.join(__dirname, '../public/images/logos');

// Create directory if it doesn't exist
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const logoUrls = {
  "netflix.png": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Netflix_N_Logo.png",
  "discord-boost.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Discord_Server_Boost_badge.svg/512px-Discord_Server_Boost_badge.svg.png",
  "prime-video.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Prime_Video_Logo_2024.svg/512px-Prime_Video_Logo_2024.svg.png",
  "youtube.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/YouTube_Premium_logo.svg/512px-YouTube_Premium_logo.svg.png",
  "nordvpn.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/NordVPN_logo.svg/512px-NordVPN_logo.svg.png",
  "disney-plus.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/512px-Disney%2B_logo.svg.png",
  "crunchyroll.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Crunchyroll_logo.svg/512px-Crunchyroll_logo.svg.png",
  "spotify.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png",
  "hbo-max.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Max_logo.svg/512px-Max_logo.svg.png",
  "paramount-plus.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Paramount%2B_logo.svg/512px-Paramount%2B_logo.svg.png",
  "nba.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/National_Basketball_Association_logo.svg/512px-National_Basketball_Association_logo.svg.png",
  "dazn.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/DAZN_logo.svg/512px-DAZN_logo.svg.png",
  "chatgpt.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png"
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
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

async function run() {
  console.log('Downloading brand logos to public/images/logos/...');
  for (const [filename, url] of Object.entries(logoUrls)) {
    const dest = path.join(logosDir, filename);
    try {
      await download(url, dest);
      console.log(`Successfully downloaded ${filename}`);
    } catch (err) {
      console.error(`Error downloading ${filename}:`, err.message);
    }
  }
  console.log('Done!');
}

run();
