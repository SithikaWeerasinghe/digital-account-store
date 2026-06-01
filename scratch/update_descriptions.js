const fs = require('fs');
const path = require('path');

const simplifiedDescriptions = {
  "iptv-accounts": "High-quality live TV channels and movie libraries worldwide.",
  "netflix-premium": "Stream movies and series in Ultra HD 4K on your dedicated profile.",
  "minecraft-fullaccess": "Full access Minecraft account with customizable profile settings.",
  "canva-pro": "Access Canva's premium tools and templates for professional design.",
  "gemini-pro-5tb-storage-18-months": "Google Gemini Pro AI with 5TB high-speed Google One Cloud Storage.",
  "perplexity-ai-pro": "Advanced AI search with access to Claude 3.5 and GPT-4o.",
  "microsoft-office-365-fa": "Complete productivity suite including Word, Excel, and OneDrive.",
  "claude-ai-pro": "High-tier access to Anthropic's Claude 3.5 Sonnet and projects.",
  "grok-pro-ai": "Premium access to xAI's Grok conversational model in real-time.",
  "deezer-premium-lifetime-key-": "Redeemable key for lifetime Deezer Premium music streaming.",
  "fortnite-accounts": "Full access Fortnite accounts with guaranteed rare skins.",
  "steam-accounts-fa": "Full access Steam accounts pre-loaded with random game libraries.",
  "14x-server-boosts-1-month": "Level up your Discord server with 14 Server Boosts.",
  "prime-video-fa": "Full access to Prime Video movies, series, and Amazon Originals.",
  "youtube-premium": "Enjoy ad-free YouTube videos and offline background playback.",
  "nordvpn-lifetime": "Fast, secure, and anonymous internet browsing with NordVPN.",
  "capcut-pro": "Unlock CapCut Pro templates, transitions, and advanced filters.",
  "ipvanish-vpn-lifetime": "Unmetered device connections with a strict no-logs policy.",
  "disney-premium-lifetime": "Stream movies and series from Disney, Pixar, and Marvel.",
  "crunchyroll-premium-lifetime": "Watch ad-free anime and read digital manga simulcasts.",
  "spotify-premium-lifetime-key": "Lifetime Spotify Premium key for ad-free offline music.",
  "max": "Access premium Max Originals and movie catalogs on your device.",
  "paramount": "Stream live sports, Paramount+ originals, and movie catalogs.",
  "nba-lifetime": "NBA League Pass for live streaming matches and archives.",
  "duolingo-lifetime": "Learn languages ad-free with unlimited hearts on Duolingo Plus.",
  "dazn-total-lifetime": "Watch live boxing, sports tournaments, and documentaries.",
  "chatgpt-accounts": "Full access to OpenAI's ChatGPT Plus and advanced models.",
  "expressvpn-lifetime": "Ultra-fast secure mobile VPN proxy access."
};

// 1. Update data/sampleProducts.ts
const tsPath = path.join(__dirname, '../data/sampleProducts.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

// Parse, update, and stringify back
// Since sampleProducts is an array in typescript, let's use regex to find descriptions or write a JS parser
const tempFile = path.join(__dirname, 'temp_desc.js');
fs.writeFileSync(tempFile, tsContent.replace(/import\s+.*?;/g, '').replace(/export\s+const\s+sampleProducts:\s+Product\[\]\s*=/g, 'module.exports =') + '\n');
const sampleProducts = require(tempFile);

let tsUpdated = 0;
sampleProducts.forEach(p => {
  const newDesc = simplifiedDescriptions[p.slug];
  if (newDesc) {
    p.description = newDesc;
    tsUpdated++;
  }
});

const outTsContent = `import { Product } from '../types/product';\n\nexport const sampleProducts: Product[] = ${JSON.stringify(sampleProducts, null, 2)};\n`;
fs.writeFileSync(tsPath, outTsContent, 'utf8');
fs.unlinkSync(tempFile);
console.log(`Updated ${tsUpdated} product descriptions in data/sampleProducts.ts!`);

// 2. Update database/seed.sql
const sqlPath = path.join(__dirname, '../database/seed.sql');
let sqlContent = fs.readFileSync(sqlPath, 'utf8');

// For seed.sql, let's run a line-by-line replacement or regex to find description fields.
// Since seed.sql is generated, let's also update build_deduped_products.js first and then run it to recreate seed.sql cleanly!
// Let's do that! That is much cleaner and avoids parsing SQL values manually.

// 3. Update scratch/build_deduped_products.js
const buildPath = path.join(__dirname, '../scratch/build_deduped_products.js');
let buildContent = fs.readFileSync(buildPath, 'utf8');

let buildUpdated = 0;
for (const [slug, desc] of Object.entries(simplifiedDescriptions)) {
  // Regex to match description field for specific slug
  // We look for a block like slug: "netflix-premium", ..., description: "..."
  const regex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?description:\\s*")[^"]+(")`, 'g');
  if (buildContent.match(regex)) {
    buildContent = buildContent.replace(regex, `$1${desc}$2`);
    buildUpdated++;
  }
}
fs.writeFileSync(buildPath, buildContent, 'utf8');
console.log(`Updated ${buildUpdated} product descriptions in scratch/build_deduped_products.js!`);
