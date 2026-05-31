const fs = require('fs');

// Define stable UUIDs for the 28 products to ensure database consistency
const productsData = [
  {
    id: "a1a8c9b3-4db2-4876-8f3b-d56e729a8341",
    name: "IPTV",
    slug: "iptv-accounts",
    category: "Streaming",
    description: "Premium access to high-quality live TV channels, movie libraries, and sports networks globally. Instant activation and multi-device compatibility.",
    price: 9.00,
    imageUrl: "https://static.mysellauth.com/storage/images/708006.webp",
    features: ["4K & HD quality streams", "Over 15,000+ channels", "Works on Smart TVs, Firestick, Phones", "Instant activation"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.9,
    reviewsCount: 84,
    variants: [
      { id: "iptv-v1", label: "1 Month Subscription", price: 9.00 },
      { id: "iptv-v2", label: "3 Months Subscription", price: 17.99 },
      { id: "iptv-v3", label: "6 Months Subscription", price: 28.99 },
      { id: "iptv-v4", label: "12 Months Subscription", price: 38.99 }
    ]
  },
  {
    id: "b2b9d0c4-5ec3-4987-9a4c-e67f830b9452",
    name: "Netflix Premium",
    slug: "netflix-premium",
    category: "Streaming",
    description: "Watch Netflix movies, series, and documentaries in Ultra HD 4K. Stream on multiple screens with a personalized dedicated profile.",
    price: 1.00,
    originalPrice: 25.01,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/fcecd9ea-80ff-4205-777c-bcd25639a500/public",
    features: ["Ultra HD 4K resolution", "Shared profile access", "Ad-free experience", "Instant setup guide"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.8,
    reviewsCount: 142,
    variants: [
      { id: "netflix-v1", label: "Netflix Premium [Lifetime]", price: 1.00, originalPrice: 25.01 },
      { id: "netflix-v2", label: "Netflix Premium FA [4k Plan]", price: 7.70 }
    ]
  },
  {
    id: "c3c0e1d5-6fd4-4a98-ab5d-f78f941c0563",
    name: "Minecraft Account (Full Access)",
    slug: "minecraft-fullaccess",
    category: "Gaming",
    description: "Unrestricted Full Access Minecraft account. Customize your profile email, password, security questions, and skins completely.",
    price: 7.00,
    originalPrice: 29.99,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/118c22e2-2388-493b-8ee7-4d026a1b1300/public",
    features: ["Change email and password", "Full security configuration", "Personal skin customization", "Lifetime account ownership"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.7,
    reviewsCount: 39
  },
  {
    id: "d4d1f2e6-7ae5-4b09-bc6e-089fa52d1674",
    name: "Canva Pro",
    slug: "canva-pro",
    category: "Productivity",
    description: "Unlock Canva's premium toolset. Design professional graphics, branding materials, templates, and slide decks using AI-powered automation.",
    price: 1.90,
    originalPrice: 3.00,
    imageUrl: "https://static.mysellauth.com/storage/images/732547.webp",
    features: ["Access to millions of premium assets", "One-click background remover", "Brand kit management", "AI writing & magic design tools"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.9,
    reviewsCount: 56,
    variants: [
      { id: "canva-v1", label: "1 Year Access", price: 1.90, originalPrice: 3.00 },
      { id: "canva-v2", label: "Lifetime Access", price: 3.00 }
    ]
  },
  {
    id: "e5e2a3f7-8bf6-4c1a-cd7f-19afb63e2785",
    name: "Gemini Pro + 5TB Storage – 18 months",
    slug: "gemini-pro-5tb-storage-18-months",
    category: "AI Tools",
    description: "Google Gemini Pro AI assistant paired with 5TB high-speed Google One Cloud Storage for a period of 18 months.",
    price: 9.00,
    imageUrl: "https://static.mysellauth.com/storage/images/676023.webp",
    features: ["Gemini Advanced features", "5TB shared Google cloud storage", "Priority AI response speeds", "18 months continuous warranty"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.9,
    reviewsCount: 18
  },
  {
    id: "f6f3b4a8-9cg7-4d2b-de8g-2abfc74f3896",
    name: "PERPLEXITY AI PRO [FA]",
    slug: "perplexity-ai-pro",
    category: "AI Tools",
    description: "Experience advanced search queries, select from state-of-the-art models like Claude 3.5 or GPT-4o, and request endless file uploads.",
    price: 4.00,
    originalPrice: 15.00,
    imageUrl: "https://static.mysellauth.com/storage/images/799438.webp",
    features: ["Copilot advanced research mode", "Choose models (GPT-4o, Claude 3.5)", "Unlimited query searches", "PDF and image analysis"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.9,
    reviewsCount: 29,
    variants: [
      { id: "perplexity-v1", label: "1 Month Access", price: 4.00 },
      { id: "perplexity-v2", label: "Lifetime Access", price: 15.00 }
    ]
  },
  {
    id: "g7g4c5b9-0da8-4e3c-ef9h-3bcda85g4907",
    name: "Microsoft Office 365 [YEARLY] [FA]",
    slug: "microsoft-office-365-fa",
    category: "Software",
    description: "Complete productivity toolkit including Microsoft Word, Excel, PowerPoint, Outlook, and OneDrive secure file storage. 1-year coverage.",
    price: 7.00,
    originalPrice: 10.00,
    imageUrl: "https://static.mysellauth.com/storage/images/799443.webp",
    features: ["Full Office Suite downloads", "1TB OneDrive Cloud storage", "Usage across 5 devices simultaneously", "1-year digital warranty"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.8,
    reviewsCount: 45
  },
  {
    id: "h8h5d6c0-1eb9-4f4d-fa0i-4cdab96h5018",
    name: "Claude AI Pro",
    slug: "claude-ai-pro",
    category: "AI Tools",
    description: "High-tier access to Anthropic's Claude 3.5 Sonnet, Opus, and Haiku models. Elevate coding pipelines, mathematical processes, and context capacity.",
    price: 10.99,
    originalPrice: 48.99,
    imageUrl: "https://static.mysellauth.com/storage/images/846874.webp",
    features: ["Claude 3.5 Sonnet advanced context", "Claude Projects capability", "5x higher message limit than free tier", "Early access to feature drops"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.9,
    reviewsCount: 31,
    variants: [
      { id: "claude-v1", label: "1 Month Access", price: 10.99 },
      { id: "claude-v2", label: "12 Months Access", price: 48.99 }
    ]
  },
  {
    id: "i9i6e7d1-2fc0-4a5e-ab1j-5deba07i6129",
    name: "Grok Pro AI",
    slug: "grok-pro-ai",
    category: "AI Tools",
    description: "Premium access to xAI's real-time conversational model Grok. Seamlessly integrated with X.com metrics and queries.",
    price: 3.50,
    originalPrice: 5.00,
    imageUrl: "https://static.mysellauth.com/storage/images/873807.webp",
    features: ["Real-time source data access", "Humor and standard toggle modes", "High processing capacities", "Fast prompt response times"],
    inStock: false,
    isInstantDelivery: false,
    rating: 4.6,
    reviewsCount: 12,
    variants: [
      { id: "grok-v1", label: "1 Month Access", price: 3.50 },
      { id: "grok-v2", label: "Lifetime Access", price: 5.00 }
    ]
  },
  {
    id: "j0j7f8e2-3ad1-4b6f-bc2k-6efcb18j7230",
    name: "Deezer Premium LIFETIME [ KEY ]",
    slug: "deezer-premium-lifetime-key-",
    category: "Streaming",
    description: "Redeemable key for lifetime Deezer Premium music access. Play high-fidelity audio streams ad-free on any device.",
    price: 7.00,
    imageUrl: "https://static.mysellauth.com/storage/images/900650.webp",
    features: ["Ad-free music stream", "High Fidelity CD quality sound", "Offline playback lists", "Universal platform key compatibility"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.9,
    reviewsCount: 42
  },
  {
    id: "k1k8a9f3-4be2-4c7g-cd3l-7fgdc29k8341",
    name: "Fortnite Accounts [Full Access]",
    slug: "fortnite-accounts",
    category: "Gaming",
    description: "Premium Fortnite accounts featuring guaranteed random collections of rare cosmetics, battle pass emotes, skins, and v-bucks.",
    price: 4.80,
    originalPrice: 59.99,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/a0cd570e-9727-42bf-067f-e642bfc0cc00/public",
    features: ["Guaranteed skin count tiers", "Universal platform support (PC/Console)", "Full account email access", "Lifetime account warranty"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.8,
    reviewsCount: 110,
    variants: [
      { id: "fn-v1", label: "+20 Skins Bundle", price: 4.80 },
      { id: "fn-v2", label: "+50 Skins Bundle", price: 9.00 },
      { id: "fn-v3", label: "+100 Skins Bundle", price: 15.99 },
      { id: "fn-v4", label: "+200 Skins Bundle", price: 34.99 },
      { id: "fn-v5", label: "+300 Skins Bundle", price: 59.99 }
    ]
  },
  {
    id: "l2l9b0g4-5cf3-4d8h-de4m-8ghed30l9452",
    name: "Steam Accounts [FA]",
    slug: "steam-accounts-fa",
    category: "Gaming",
    description: "Full Access Steam account loaded with random library titles. Change email, credentials, and settings completely.",
    price: 0.10,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/76829d53-b9fc-4f06-af57-6ea4b2367d00/public",
    features: ["Instant login details", "Random pre-loaded games", "Clean status with no bans", "Change email configuration"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.7,
    reviewsCount: 228
  },
  {
    id: "m3m0c1h5-6dg4-4e9i-ef5n-9hife41m0563",
    name: "14x Server Boosts (1/3 month)",
    slug: "14x-server-boosts-1-month",
    category: "Software",
    description: "Immediately level up your Discord server to Level 3. Provides 14 distinct Nitro boosts for 1 or 3 months.",
    price: 5.00,
    originalPrice: 10.00,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/95a6f830-a478-4ce8-f13c-0ab488193400/public",
    features: ["Custom server URL banner access", "1080p 60fps streaming", "100MB+ upload file limits", "Level 3 unlocked status"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.9,
    reviewsCount: 65,
    variants: [
      { id: "boost-v1", label: "1 Month Coverage", price: 5.00 },
      { id: "boost-v2", label: "3 Months Coverage", price: 10.00 }
    ]
  },
  {
    id: "n4n1d2i6-7eh5-4f0j-fa6o-0ijgf52n1674",
    name: "Amazon Prime Video [FA]",
    slug: "prime-video-fa",
    category: "Streaming",
    description: "Full access profile to Amazon Prime Video. Stream exclusive series, popular movies, and Amazon Originals.",
    price: 2.00,
    originalPrice: 6.00,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/eb00b6e0-3469-4bef-0670-0a998dcb6b00/public",
    features: ["Ultra HD streaming support", "Watch offline via download", "Multi-profile customization", "Warranty during subscription"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.8,
    reviewsCount: 24,
    variants: [
      { id: "prime-v1", label: "1 Month Access", price: 2.00 },
      { id: "prime-v2", label: "12 Months Access", price: 6.00 }
    ]
  },
  {
    id: "o5o2e3j7-8fi6-4a1k-ab7p-1jkhf63o2785",
    name: "YouTube Premium",
    slug: "youtube-premium",
    category: "Streaming",
    description: "Enjoy ad-free YouTube videos and YouTube Music. Supports background play on mobile and offline video downloads.",
    price: 2.35,
    originalPrice: 4.50,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/d89fdce5-0d38-4e8f-6eac-05718caed600/public",
    features: ["Zero ads on video/music", "Background play support", "Offline video downloading", "YouTube Music Premium included"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.9,
    reviewsCount: 97,
    variants: [
      { id: "yt-v1", label: "3 Months Subscription", price: 2.35 },
      { id: "yt-v2", label: "6 Months Subscription", price: 4.50 }
    ]
  },
  {
    id: "p6p3f4k8-9gj7-4b2l-bc8q-2klig74p3896",
    name: "NordVPN [LIFETIME]",
    slug: "nordvpn-lifetime",
    category: "Productivity",
    description: "Encrypted, fast, and anonymous internet browsing with NordVPN. Protect multiple devices with a single account.",
    price: 2.50,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/7eb48f59-5308-4d48-0a9c-a22a3638b000/public",
    features: ["Military-grade encryption", "No logs database architecture", "5400+ servers worldwide", "Lifetime login support warranty"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.8,
    reviewsCount: 38
  },
  {
    id: "q7q4a5l9-0hk8-4c3m-cd9r-3lmjh85q4907",
    name: "Capcut [Pro] [Lifetime]",
    slug: "capcut-pro",
    category: "Software",
    description: "Unlock CapCut Pro templates, transition effects, keyframe tools, and advanced filters to publish premium video content.",
    price: 1.20,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/99275149-9196-4206-0aa2-29b59f857d00/public",
    features: ["Premium templates unlocked", "Advanced filters and effects", "4K high bitrate video export", "Ad-free editor workspace"],
    inStock: false,
    isInstantDelivery: false,
    rating: 4.7,
    reviewsCount: 14
  },
  {
    id: "r8r5b6m0-1il9-4d4n-da0s-4mnki96r5018",
    name: "IPVanish VPN (LIFETIME)",
    slug: "ipvanish-vpn-lifetime",
    category: "Productivity",
    description: "Unmetered device connections and zero logs policy with IPVanish VPN. Browse websites securely and privately.",
    price: 1.20,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/a2e0e6b1-6348-412b-298b-939b86d1bb00/public",
    features: ["Unmetered simultaneous setups", "Strict no-logs tracking", "IP masking capabilities", "Secure digital download details"],
    inStock: false,
    isInstantDelivery: false,
    rating: 4.8,
    reviewsCount: 52
  },
  {
    id: "s9s6c7n1-2jm0-4e5o-eb1t-5nolj07s6129",
    name: "Disney+ Premium [Lifetime]",
    slug: "disney-premium-lifetime",
    category: "Streaming",
    description: "Stream Disney, Pixar, Marvel, Star Wars, and National Geographic movies and series. Ad-free profile setup.",
    price: 1.00,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/35d5f0ed-5bfe-4865-05b3-5655479f6100/public",
    features: ["Full HD streaming capacity", "GroupWatch compatible", "Profiles for family setup", "Instant delivery email details"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.8,
    reviewsCount: 139
  },
  {
    id: "t0t7d8o2-3kn1-4f6p-bc2u-6opmk18t7230",
    name: "Crunchyroll Premium [Lifetime]",
    slug: "crunchyroll-premium-lifetime",
    category: "Streaming",
    description: "Unlock ad-free anime streams, including simulcast episodes direct from Japan. Read digital manga volumes.",
    price: 1.00,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/09793c50-9b8f-47d9-9eeb-bd9d5a40f900/public",
    features: ["No ads on stream catalogs", "Simulcast episodes release access", "Stream on 4 devices at once", "Offline download support"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.9,
    reviewsCount: 112
  },
  {
    id: "u1u8e9p3-4lo2-4a7q-cd3v-7pqnl29u8341",
    name: "Spotify Premium [Lifetime Key]",
    slug: "spotify-premium-lifetime-key",
    category: "Streaming",
    description: "Activate lifetime Premium benefits on Spotify. Play any song, enjoy ad-free playback, and download tracks offline.",
    price: 7.60,
    originalPrice: 41.70,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/79e88273-0f52-46a3-acca-958d9ded4500/public",
    features: ["Ad-free music player", "Download music offline", "High-fidelity audio stream quality", "Lifetime activation key"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.9,
    reviewsCount: 304
  },
  {
    id: "v2v9f0q4-5mp3-4b8r-de4w-8qpom30v9452",
    name: "HBO Max [Lifetime]",
    slug: "max",
    category: "Streaming",
    description: "Access premium Max Originals, Warner Bros. films, and sports channels on your Smart TV or mobile profile.",
    price: 1.00,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/e1bb54ba-f900-49ea-1d1d-2c10e7fd1600/public",
    features: ["Access to HBO library", "High definition streams", "Personalized user profile", "Lifetime warranty coverage"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.7,
    reviewsCount: 48
  },
  {
    id: "w3w0a1r5-6nq4-4c9s-ef5x-9rqpn41w0563",
    name: "Paramount+ [Lifetime]",
    slug: "paramount",
    category: "Streaming",
    description: "Stream thousands of movie titles, UEFA Champions League live feeds, and CBS news channels.",
    price: 1.00,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/3803fce7-c56e-45ed-cb6b-61223a11ae00/public",
    features: ["Live sports streaming feed", "Paramount+ originals unlocked", "Offline downloads", "Instant login details"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.8,
    reviewsCount: 29
  },
  {
    id: "x4x1b2s6-7or5-4d0t-fa6y-0srqp52x1674",
    name: "Nba [LIFETIME]",
    slug: "nba-lifetime",
    category: "Streaming",
    description: "NBA League Pass lifetime access. Stream live matches, classic games, and pre-season metrics in HD.",
    price: 1.00,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/535dd82e-47fb-404a-1430-917b55773f00/public",
    features: ["Live game streaming feed", "Classic games and archives", "Multiple language audio", "Lifetime warranty support"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.8,
    reviewsCount: 31
  },
  {
    id: "y5y2c3t7-8ps6-4a1u-ab7z-1tsqp63y2785",
    name: "Duolingo [LIFETIME]",
    slug: "duolingo-lifetime",
    category: "Productivity",
    description: "Unlock Duolingo Plus features. Learn languages ad-free with unlimited hearts and structured progress tests.",
    price: 1.00,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/4581f2fb-8c88-40b4-0263-510ee09ef200/public",
    features: ["No advertisements on lesson plans", "Unlimited practice hearts", "Personalized review sessions", "Offline lesson compatibility"],
    inStock: true,
    isInstantDelivery: true,
    rating: 4.9,
    reviewsCount: 84
  },
  {
    id: "z6z3d4u8-9qt7-4b2v-bc81-2utrq74z3896",
    name: "Dazn [Lifetime]",
    slug: "dazn-total-lifetime",
    category: "Streaming",
    description: "Watch live boxing matches, UEFA women's champions league feeds, and sports documentaries with DAZN.",
    price: 1.00,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/39dfadbe-c313-4336-06db-9522820d1800/public",
    features: ["Live sports channel feeds", "On-demand recordings and clips", "Universal streaming compatibility", "Warranty during use"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.7,
    reviewsCount: 41,
    variants: [
      { id: "dazn-v1", label: "Standard Plan", price: 1.00 },
      { id: "dazn-v2", label: "Premium Plan", price: 1.65 }
    ]
  },
  {
    id: "a7a4e5v9-0ru8-4c3w-cd92-3vurq85a4907",
    name: "ChatGPT+ Accounts [FA]",
    slug: "chatgpt-accounts",
    category: "AI Tools",
    description: "Get full access to OpenAI's ChatGPT Plus. Experience GPT-4o, DALL-E, advanced voice mode, and coding assistants.",
    price: 3.50,
    originalPrice: 15.99,
    imageUrl: "https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/27379712-c8e1-4b33-4582-504034b66b00/public",
    features: ["Access to GPT-4o and advanced models", "Create custom GPT instances", "Fast prompt response times", "DALL-E magic graphic generation"],
    inStock: true,
    isInstantDelivery: false,
    rating: 4.9,
    reviewsCount: 154,
    variants: [
      { id: "gpt-v1", label: "1 Month Access", price: 3.50 },
      { id: "gpt-v2", label: "Lifetime Access", price: 15.99 }
    ]
  },
  {
    id: "b8b5f6w0-1sv9-4d4x-da03-4wsur96b5018",
    name: "ExpressVPN (Phone) [LIFETIME]",
    slug: "expressvpn-lifetime",
    category: "Productivity",
    description: "Ultra-fast VPN access on your mobile device. Unlock regional content libraries safely and securely.",
    price: 1.35,
    imageUrl: "https://static.mysellauth.com/storage/images/942209.webp",
    features: ["Fast server connections", "Encryption protocol suite", "Phone specific layout UI", "Instant credentials delivery"],
    inStock: false,
    isInstantDelivery: false,
    rating: 4.8,
    reviewsCount: 19
  }
];

// Add createdAt field to match the Product interface
const formattedProducts = productsData.map(p => ({
  ...p,
  createdAt: new Date().toISOString()
}));

// Write to data/sampleProducts.ts
const tsContent = `import { Product } from '../types/product';

export const sampleProducts: Product[] = ${JSON.stringify(formattedProducts, null, 2)};
`;
fs.writeFileSync('data/sampleProducts.ts', tsContent);
console.log('Successfully written data/sampleProducts.ts with exactly 28 products!');

// Write to database/seed.sql
let sqlContent = `-- Digital Account Store Database Seed Data (Exactly 28 unique products)
-- Generated on ${new Date().toISOString()}

-- Seed Products
INSERT INTO products (id, name, slug, category, description, price, image_url, stock_count, is_active, is_instant_delivery, rating, created_at)
VALUES
`;

const productValues = productsData.map(p => {
  const escapeSql = (str) => str ? str.replace(/'/g, "''") : '';
  const origPriceVal = p.originalPrice !== undefined ? p.originalPrice : 'NULL';
  const stockVal = p.inStock ? 20 : 0;
  return `(
    '${p.id}',
    '${escapeSql(p.name)}',
    '${escapeSql(p.slug)}',
    '${escapeSql(p.category)}',
    '${escapeSql(p.description)}',
    ${p.price},
    ${p.imageUrl ? `'${escapeSql(p.imageUrl)}'` : 'NULL'},
    ${stockVal},
    TRUE,
    ${p.isInstantDelivery ? 'TRUE' : 'FALSE'},
    ${p.rating},
    NOW()
)`;
});

sqlContent += productValues.join(',\n') + '\nON CONFLICT (slug) DO NOTHING;\n\n';

// Seed reviews
sqlContent += `-- Seed Sample Approved Reviews for products\nINSERT INTO reviews (product_id, customer_email, rating, comment, is_approved, created_at)\nVALUES\n`;

const reviewValues = [];
productsData.slice(0, 10).forEach((p, idx) => {
  const comments = [
    "Perfect service. Instructions are clear, account setup took seconds.",
    "Very helpful customer support. Works exactly as described.",
    "Amazing and reliable. Will definitely order from here again."
  ];
  const email = `buyer${idx + 1}@example.com`;
  const rating = idx % 2 === 0 ? 5 : 4;
  const comment = comments[idx % comments.length];
  
  reviewValues.push(`(
    '${p.id}',
    '${email}',
    ${rating},
    '${comment}',
    TRUE,
    NOW()
)`);
});
sqlContent += reviewValues.join(',\n') + '\nON CONFLICT DO NOTHING;\n\n';

// Seed inventory items
sqlContent += `-- Seed Sample Inventory Items\nINSERT INTO inventory_items (product_id, delivery_content, status)\nVALUES\n`;

const inventoryValues = productsData.map(p => {
  const key = `${p.slug.toUpperCase()}-LICENSE-KEY-${Math.floor(100000 + Math.random() * 900000)}`;
  return `(
    '${p.id}',
    '${key}',
    'available'
)`;
});

sqlContent += inventoryValues.join(',\n') + '\nON CONFLICT DO NOTHING;\n';

fs.writeFileSync('database/seed.sql', sqlContent);
console.log('Successfully written database/seed.sql!');
