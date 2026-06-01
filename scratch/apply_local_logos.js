const fs = require('fs');
const path = require('path');

const replacementMap = {
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/fcecd9ea-80ff-4205-777c-bcd25639a500/public": "/images/logos/netflix.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/95a6f830-a478-4ce8-f13c-0ab488193400/public": "/images/logos/discord.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/eb00b6e0-3469-4bef-0670-0a998dcb6b00/public": "/images/logos/prime-video.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/d89fdce5-0d38-4e8f-6eac-05718caed600/public": "/images/logos/youtube.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/7eb48f59-5308-4d48-0a9c-a22a3638b000/public": "/images/logos/nordvpn.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/35d5f0ed-5bfe-4865-05b3-5655479f6100/public": "/images/logos/disney-plus.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/09793c50-9b8f-47d9-9eeb-bd9d5a40f900/public": "/images/logos/crunchyroll.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/79e88273-0f52-46a3-acca-958d9ded4500/public": "/images/logos/spotify.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/e1bb54ba-f900-49ea-1d1d-2c10e7fd1600/public": "/images/logos/hbo-max.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/3803fce7-c56e-45ed-cb6b-61223a11ae00/public": "/images/logos/paramount-plus.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/535dd82e-47fb-404a-1430-917b55773f00/public": "/images/logos/nba.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/39dfadbe-c313-4336-06db-9522820d1800/public": "/images/logos/dazn.svg",
  "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/27379712-c8e1-4b33-4582-504034b66b00/public": "/images/logos/chatgpt.svg"
};

// 1. Update data/sampleProducts.ts
const tsPath = path.join(__dirname, '../data/sampleProducts.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

let tsUpdated = 0;
for (const [orig, local] of Object.entries(replacementMap)) {
  if (tsContent.includes(orig)) {
    tsContent = tsContent.split(orig).join(local);
    tsUpdated++;
  }
}
fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log(`Updated ${tsUpdated} image links to local SVG URLs in data/sampleProducts.ts!`);

// 2. Update database/seed.sql
const sqlPath = path.join(__dirname, '../database/seed.sql');
let sqlContent = fs.readFileSync(sqlPath, 'utf8');

let sqlUpdated = 0;
for (const [orig, local] of Object.entries(replacementMap)) {
  if (sqlContent.includes(orig)) {
    sqlContent = sqlContent.split(orig).join(local);
    sqlUpdated++;
  }
}
fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log(`Updated ${sqlUpdated} image links to local SVG URLs in database/seed.sql!`);
