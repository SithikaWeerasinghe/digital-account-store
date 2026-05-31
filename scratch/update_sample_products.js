const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/sampleProducts.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Transpile typescript file to raw javascript
const jsContent = content
  .replace(/import\s+.*?;/g, '')
  .replace(/export\s+const\s+sampleProducts:\s+Product\[\]\s*=/g, 'const sampleProducts =')
  + '\nmodule.exports = sampleProducts;';

const tempFilePath = path.join(__dirname, 'temp_sample_update.js');
fs.writeFileSync(tempFilePath, jsContent, 'utf8');

const sampleProducts = require(tempFilePath);

// Brand icon mapping
const iconMapping = {
  "netflix-premium": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Netflix_N_Logo.png",
  "minecraft-fullaccess": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Minecraft_block.png",
  "canva-pro": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Canva_icon_2021.svg/512px-Canva_icon_2021.svg.png",
  "gemini-pro-5tb-storage-18-months": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_One_logo.svg/512px-Google_One_logo.svg.png",
  "perplexity-ai-pro": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Perplexity_AI_logo.svg/512px-Perplexity_AI_logo.svg.png",
  "microsoft-office-365-yearly-fa": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Microsoft_365_logo.svg/512px-Microsoft_365_logo.svg.png",
  "claude-ai-pro": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Claude_AI_logo.svg/512px-Claude_AI_logo.svg.png",
  "grok-pro-ai": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Grok_logo.svg/512px-Grok_logo.svg.png",
  "deezer-premium-lifetime-key": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Deezer_logo_2023.svg/512px-Deezer_logo_2023.svg.png",
  "steam-accounts-fa": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png",
  "14x-server-boosts-1-3-month": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Discord_Server_Boost_badge.svg/512px-Discord_Server_Boost_badge.svg.png",
  "amazon-prime-video-fa": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Prime_Video_Logo_2024.svg/512px-Prime_Video_Logo_2024.svg.png",
  "youtube-premium": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/YouTube_Premium_logo.svg/512px-YouTube_Premium_logo.svg.png",
  "nordvpn-lifetime": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/NordVPN_logo.svg/512px-NordVPN_logo.svg.png",
  "capcut-pro": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/CapCut_logo.svg/512px-CapCut_logo.svg.png",
  "ipvanish-vpn-lifetime": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Ipv_logo.svg/512px-Ipv_logo.svg.png",
  "disney-premium-lifetime": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/512px-Disney%2B_logo.svg.png",
  "crunchyroll-premium-lifetime": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Crunchyroll_logo.svg/512px-Crunchyroll_logo.svg.png",
  "spotify-premium-lifetime-key": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png",
  "max": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Max_logo.svg/512px-Max_logo.svg.png",
  "paramount": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Paramount%2B_logo.svg/512px-Paramount%2B_logo.svg.png",
  "nba-lifetime": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/National_Basketball_Association_logo.svg/512px-National_Basketball_Association_logo.svg.png",
  "duolingo-lifetime": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Duolingo_logo_2019.svg/512px-Duolingo_logo_2019.svg.png",
  "dazn-total-lifetime": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/DAZN_logo.svg/512px-DAZN_logo.svg.png",
  "chatgpt-accounts": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png",
  "expressvpn-phone-lifetime": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/ExpressVPN_logo_2021.svg/512px-ExpressVPN_logo_2021.svg.png"
};

// Process each product to update image and remove originalPrice
sampleProducts.forEach(p => {
  if (iconMapping[p.slug]) {
    p.imageUrl = iconMapping[p.slug];
  }
  delete p.originalPrice;
  
  if (p.variants) {
    p.variants.forEach(v => {
      delete v.originalPrice;
    });
  }
});

// Format back to TypeScript code
let outContent = `import { Product } from '../types/product';\n\nexport const sampleProducts: Product[] = ${JSON.stringify(sampleProducts, null, 2)};\n`;

fs.writeFileSync(filePath, outContent, 'utf8');
console.log('Successfully updated data/sampleProducts.ts!');

if (fs.existsSync(tempFilePath)) {
  fs.unlinkSync(tempFilePath);
}
