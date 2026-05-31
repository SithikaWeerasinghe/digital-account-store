const fs = require('fs');
const path = require('path');

// Read the original scraped backup
const backupPath = path.join(__dirname, 'unique_products.json');
if (!fs.existsSync(backupPath)) {
  console.log('unique_products.json backup not found!');
  process.exit(1);
}

const backupProducts = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

// Build mapping of name or slug to original imageUrl
const imageMap = {};
backupProducts.forEach(p => {
  imageMap[p.slug] = p.imageUrl;
});

// Update sampleProducts.ts
const tsFilePath = path.join(__dirname, '../data/sampleProducts.ts');
const tsContent = fs.readFileSync(tsFilePath, 'utf8');

// Transpile ts file to raw js
const jsContent = tsContent
  .replace(/import\s+.*?;/g, '')
  .replace(/export\s+const\s+sampleProducts:\s+Product\[\]\s*=/g, 'const sampleProducts =')
  + '\nmodule.exports = sampleProducts;';

const tempFilePath = path.join(__dirname, 'temp_restore_sample.js');
fs.writeFileSync(tempFilePath, jsContent, 'utf8');

const sampleProducts = require(tempFilePath);

let sampleUpdatedCount = 0;
sampleProducts.forEach(p => {
  const origImage = imageMap[p.slug];
  if (origImage) {
    p.imageUrl = origImage;
    sampleUpdatedCount++;
  }
});

// Format back to TypeScript code
let outContent = `import { Product } from '../types/product';\n\nexport const sampleProducts: Product[] = ${JSON.stringify(sampleProducts, null, 2)};\n`;
fs.writeFileSync(tsFilePath, outContent, 'utf8');
console.log(`Successfully restored ${sampleUpdatedCount} image URLs in data/sampleProducts.ts!`);

if (fs.existsSync(tempFilePath)) {
  fs.unlinkSync(tempFilePath);
}

// Update seed.sql
const sqlPath = path.join(__dirname, '../database/seed.sql');
let sqlContent = fs.readFileSync(sqlPath, 'utf8');

let sqlUpdatedCount = 0;
// We have the old wiki image URLs and we want to replace them back with the original ones
const wikiToOrigMap = {
  "https://upload.wikimedia.org/wikipedia/commons/c/c5/Netflix_N_Logo.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/fcecd9ea-80ff-4205-777c-bcd25639a500/public",
  "https://upload.wikimedia.org/wikipedia/commons/c/c2/Minecraft_block.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/118c22e2-2388-493b-8ee7-4d026a1b1300/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Canva_icon_2021.svg/512px-Canva_icon_2021.svg.png": "https://static.mysellauth.com/storage/images/732547.webp",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_One_logo.svg/512px-Google_One_logo.svg.png": "https://static.mysellauth.com/storage/images/676023.webp",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Perplexity_AI_logo.svg/512px-Perplexity_AI_logo.svg.png": "https://static.mysellauth.com/storage/images/799438.webp",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Microsoft_365_logo.svg/512px-Microsoft_365_logo.svg.png": "https://static.mysellauth.com/storage/images/799443.webp",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Claude_AI_logo.svg/512px-Claude_AI_logo.svg.png": "https://static.mysellauth.com/storage/images/846874.webp",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Grok_logo.svg/512px-Grok_logo.svg.png": "https://static.mysellauth.com/storage/images/873807.webp",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Deezer_logo_2023.svg/512px-Deezer_logo_2023.svg.png": "https://static.mysellauth.com/storage/images/900650.webp",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/76829d53-b9fc-4f06-af57-6ea4b2367d00/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Discord_Server_Boost_badge.svg/512px-Discord_Server_Boost_badge.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/95a6f830-a478-4ce8-f13c-0ab488193400/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Prime_Video_Logo_2024.svg/512px-Prime_Video_Logo_2024.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/eb00b6e0-3469-4bef-0670-0a998dcb6b00/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/YouTube_Premium_logo.svg/512px-YouTube_Premium_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/d89fdce5-0d38-4e8f-6eac-05718caed600/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/NordVPN_logo.svg/512px-NordVPN_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/7eb48f59-5308-4d48-0a9c-a22a3638b000/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/CapCut_logo.svg/512px-CapCut_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/99275149-9196-4206-0aa2-29b59f857d00/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Ipv_logo.svg/512px-Ipv_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/a2e0e6b1-6348-412b-298b-939b86d1bb00/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/512px-Disney%2B_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/35d5f0ed-5bfe-4865-05b3-5655479f6100/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Crunchyroll_logo.svg/512px-Crunchyroll_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/09793c50-9b8f-47d9-9eeb-bd9d5a40f900/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/79e88273-0f52-46a3-acca-958d9ded4500/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Max_logo.svg/512px-Max_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/e1bb54ba-f900-49ea-1d1d-2c10e7fd1600/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Paramount%2B_logo.svg/512px-Paramount%2B_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/3803fce7-c56e-45ed-cb6b-61223a11ae00/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/National_Basketball_Association_logo.svg/512px-National_Basketball_Association_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/535dd82e-47fb-404a-1430-917b55773f00/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Duolingo_logo_2019.svg/512px-Duolingo_logo_2019.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/4581f2fb-8c88-40b4-0263-510ee09ef200/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/DAZN_logo.svg/512px-DAZN_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/39dfadbe-c313-4336-06db-9522820d1800/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png": "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/27379712-c8e1-4b33-4582-504034b66b00/public",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/ExpressVPN_logo_2021.svg/512px-ExpressVPN_logo_2021.svg.png": "https://static.mysellauth.com/storage/images/942209.webp"
};

for (const [wikiUrl, origUrl] of Object.entries(wikiToOrigMap)) {
  if (sqlContent.includes(wikiUrl)) {
    sqlContent = sqlContent.split(wikiUrl).join(origUrl);
    sqlUpdatedCount++;
  }
}

fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log(`Successfully restored ${sqlUpdatedCount} image URLs in database/seed.sql!`);
