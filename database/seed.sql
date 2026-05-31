-- Digital Account Store Database Seed Data (Exactly 28 unique products)
-- Generated on 2026-05-31T13:07:22.981Z

-- Seed Products
INSERT INTO products (id, name, slug, category, description, price, image_url, stock_count, is_active, is_instant_delivery, rating, created_at)
VALUES
(
    'a1a8c9b3-4db2-4876-8f3b-d56e729a8341',
    'IPTV',
    'iptv-accounts',
    'Streaming',
    'Premium access to high-quality live TV channels, movie libraries, and sports networks globally. Instant activation and multi-device compatibility.',
    9,
    'https://static.mysellauth.com/storage/images/708006.webp',
    20,
    TRUE,
    TRUE,
    4.9,
    NOW()
),
(
    'b2b9d0c4-5ec3-4987-9a4c-e67f830b9452',
    'Netflix Premium',
    'netflix-premium',
    'Streaming',
    'Watch Netflix movies, series, and documentaries in Ultra HD 4K. Stream on multiple screens with a personalized dedicated profile.',
    1,
    '/images/logos/netflix.svg',
    20,
    TRUE,
    TRUE,
    4.8,
    NOW()
),
(
    'c3c0e1d5-6fd4-4a98-ab5d-f78f941c0563',
    'Minecraft Account (Full Access)',
    'minecraft-fullaccess',
    'Gaming',
    'Unrestricted Full Access Minecraft account. Customize your profile email, password, security questions, and skins completely.',
    7,
    'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/118c22e2-2388-493b-8ee7-4d026a1b1300/public',
    20,
    TRUE,
    TRUE,
    4.7,
    NOW()
),
(
    'd4d1f2e6-7ae5-4b09-bc6e-089fa52d1674',
    'Canva Pro',
    'canva-pro',
    'Productivity',
    'Unlock Canva''s premium toolset. Design professional graphics, branding materials, templates, and slide decks using AI-powered automation.',
    1.9,
    'https://static.mysellauth.com/storage/images/732547.webp',
    20,
    TRUE,
    TRUE,
    4.9,
    NOW()
),
(
    'e5e2a3f7-8bf6-4c1a-cd7f-19afb63e2785',
    'Gemini Pro + 5TB Storage – 18 months',
    'gemini-pro-5tb-storage-18-months',
    'AI Tools',
    'Google Gemini Pro AI assistant paired with 5TB high-speed Google One Cloud Storage for a period of 18 months.',
    9,
    'https://static.mysellauth.com/storage/images/676023.webp',
    20,
    TRUE,
    FALSE,
    4.9,
    NOW()
),
(
    'f6f3b4a8-9cg7-4d2b-de8g-2abfc74f3896',
    'PERPLEXITY AI PRO [FA]',
    'perplexity-ai-pro',
    'AI Tools',
    'Experience advanced search queries, select from state-of-the-art models like Claude 3.5 or GPT-4o, and request endless file uploads.',
    4,
    'https://static.mysellauth.com/storage/images/799438.webp',
    20,
    TRUE,
    FALSE,
    4.9,
    NOW()
),
(
    'g7g4c5b9-0da8-4e3c-ef9h-3bcda85g4907',
    'Microsoft Office 365 [YEARLY] [FA]',
    'microsoft-office-365-fa',
    'Software',
    'Complete productivity toolkit including Microsoft Word, Excel, PowerPoint, Outlook, and OneDrive secure file storage. 1-year coverage.',
    7,
    'https://static.mysellauth.com/storage/images/799443.webp',
    20,
    TRUE,
    FALSE,
    4.8,
    NOW()
),
(
    'h8h5d6c0-1eb9-4f4d-fa0i-4cdab96h5018',
    'Claude AI Pro',
    'claude-ai-pro',
    'AI Tools',
    'High-tier access to Anthropic''s Claude 3.5 Sonnet, Opus, and Haiku models. Elevate coding pipelines, mathematical processes, and context capacity.',
    10.99,
    'https://static.mysellauth.com/storage/images/846874.webp',
    20,
    TRUE,
    FALSE,
    4.9,
    NOW()
),
(
    'i9i6e7d1-2fc0-4a5e-ab1j-5deba07i6129',
    'Grok Pro AI',
    'grok-pro-ai',
    'AI Tools',
    'Premium access to xAI''s real-time conversational model Grok. Seamlessly integrated with X.com metrics and queries.',
    3.5,
    'https://static.mysellauth.com/storage/images/873807.webp',
    0,
    TRUE,
    FALSE,
    4.6,
    NOW()
),
(
    'j0j7f8e2-3ad1-4b6f-bc2k-6efcb18j7230',
    'Deezer Premium LIFETIME [ KEY ]',
    'deezer-premium-lifetime-key-',
    'Streaming',
    'Redeemable key for lifetime Deezer Premium music access. Play high-fidelity audio streams ad-free on any device.',
    7,
    'https://static.mysellauth.com/storage/images/900650.webp',
    20,
    TRUE,
    FALSE,
    4.9,
    NOW()
),
(
    'k1k8a9f3-4be2-4c7g-cd3l-7fgdc29k8341',
    'Fortnite Accounts [Full Access]',
    'fortnite-accounts',
    'Gaming',
    'Premium Fortnite accounts featuring guaranteed random collections of rare cosmetics, battle pass emotes, skins, and v-bucks.',
    4.8,
    'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/a0cd570e-9727-42bf-067f-e642bfc0cc00/public',
    20,
    TRUE,
    FALSE,
    4.8,
    NOW()
),
(
    'l2l9b0g4-5cf3-4d8h-de4m-8ghed30l9452',
    'Steam Accounts [FA]',
    'steam-accounts-fa',
    'Gaming',
    'Full Access Steam account loaded with random library titles. Change email, credentials, and settings completely.',
    0.1,
    'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/76829d53-b9fc-4f06-af57-6ea4b2367d00/public',
    20,
    TRUE,
    FALSE,
    4.7,
    NOW()
),
(
    'm3m0c1h5-6dg4-4e9i-ef5n-9hife41m0563',
    '14x Server Boosts (1/3 month)',
    '14x-server-boosts-1-month',
    'Software',
    'Immediately level up your Discord server to Level 3. Provides 14 distinct Nitro boosts for 1 or 3 months.',
    5,
    '/images/logos/discord.svg',
    20,
    TRUE,
    FALSE,
    4.9,
    NOW()
),
(
    'n4n1d2i6-7eh5-4f0j-fa6o-0ijgf52n1674',
    'Amazon Prime Video [FA]',
    'prime-video-fa',
    'Streaming',
    'Full access profile to Amazon Prime Video. Stream exclusive series, popular movies, and Amazon Originals.',
    2,
    '/images/logos/prime-video.svg',
    20,
    TRUE,
    FALSE,
    4.8,
    NOW()
),
(
    'o5o2e3j7-8fi6-4a1k-ab7p-1jkhf63o2785',
    'YouTube Premium',
    'youtube-premium',
    'Streaming',
    'Enjoy ad-free YouTube videos and YouTube Music. Supports background play on mobile and offline video downloads.',
    2.35,
    '/images/logos/youtube.svg',
    20,
    TRUE,
    FALSE,
    4.9,
    NOW()
),
(
    'p6p3f4k8-9gj7-4b2l-bc8q-2klig74p3896',
    'NordVPN [LIFETIME]',
    'nordvpn-lifetime',
    'Productivity',
    'Encrypted, fast, and anonymous internet browsing with NordVPN. Protect multiple devices with a single account.',
    2.5,
    '/images/logos/nordvpn.svg',
    20,
    TRUE,
    FALSE,
    4.8,
    NOW()
),
(
    'q7q4a5l9-0hk8-4c3m-cd9r-3lmjh85q4907',
    'Capcut [Pro] [Lifetime]',
    'capcut-pro',
    'Software',
    'Unlock CapCut Pro templates, transition effects, keyframe tools, and advanced filters to publish premium video content.',
    1.2,
    'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/99275149-9196-4206-0aa2-29b59f857d00/public',
    0,
    TRUE,
    FALSE,
    4.7,
    NOW()
),
(
    'r8r5b6m0-1il9-4d4n-da0s-4mnki96r5018',
    'IPVanish VPN (LIFETIME)',
    'ipvanish-vpn-lifetime',
    'Productivity',
    'Unmetered device connections and zero logs policy with IPVanish VPN. Browse websites securely and privately.',
    1.2,
    'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/a2e0e6b1-6348-412b-298b-939b86d1bb00/public',
    0,
    TRUE,
    FALSE,
    4.8,
    NOW()
),
(
    's9s6c7n1-2jm0-4e5o-eb1t-5nolj07s6129',
    'Disney+ Premium [Lifetime]',
    'disney-premium-lifetime',
    'Streaming',
    'Stream Disney, Pixar, Marvel, Star Wars, and National Geographic movies and series. Ad-free profile setup.',
    1,
    '/images/logos/disney-plus.svg',
    20,
    TRUE,
    TRUE,
    4.8,
    NOW()
),
(
    't0t7d8o2-3kn1-4f6p-bc2u-6opmk18t7230',
    'Crunchyroll Premium [Lifetime]',
    'crunchyroll-premium-lifetime',
    'Streaming',
    'Unlock ad-free anime streams, including simulcast episodes direct from Japan. Read digital manga volumes.',
    1,
    '/images/logos/crunchyroll.svg',
    20,
    TRUE,
    TRUE,
    4.9,
    NOW()
),
(
    'u1u8e9p3-4lo2-4a7q-cd3v-7pqnl29u8341',
    'Spotify Premium [Lifetime Key]',
    'spotify-premium-lifetime-key',
    'Streaming',
    'Activate lifetime Premium benefits on Spotify. Play any song, enjoy ad-free playback, and download tracks offline.',
    7.6,
    '/images/logos/spotify.svg',
    20,
    TRUE,
    TRUE,
    4.9,
    NOW()
),
(
    'v2v9f0q4-5mp3-4b8r-de4w-8qpom30v9452',
    'HBO Max [Lifetime]',
    'max',
    'Streaming',
    'Access premium Max Originals, Warner Bros. films, and sports channels on your Smart TV or mobile profile.',
    1,
    '/images/logos/hbo-max.svg',
    20,
    TRUE,
    TRUE,
    4.7,
    NOW()
),
(
    'w3w0a1r5-6nq4-4c9s-ef5x-9rqpn41w0563',
    'Paramount+ [Lifetime]',
    'paramount',
    'Streaming',
    'Stream thousands of movie titles, UEFA Champions League live feeds, and CBS news channels.',
    1,
    '/images/logos/paramount-plus.svg',
    20,
    TRUE,
    TRUE,
    4.8,
    NOW()
),
(
    'x4x1b2s6-7or5-4d0t-fa6y-0srqp52x1674',
    'Nba [LIFETIME]',
    'nba-lifetime',
    'Streaming',
    'NBA League Pass lifetime access. Stream live matches, classic games, and pre-season metrics in HD.',
    1,
    '/images/logos/nba.svg',
    20,
    TRUE,
    TRUE,
    4.8,
    NOW()
),
(
    'y5y2c3t7-8ps6-4a1u-ab7z-1tsqp63y2785',
    'Duolingo [LIFETIME]',
    'duolingo-lifetime',
    'Productivity',
    'Unlock Duolingo Plus features. Learn languages ad-free with unlimited hearts and structured progress tests.',
    1,
    'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/4581f2fb-8c88-40b4-0263-510ee09ef200/public',
    20,
    TRUE,
    TRUE,
    4.9,
    NOW()
),
(
    'z6z3d4u8-9qt7-4b2v-bc81-2utrq74z3896',
    'Dazn [Lifetime]',
    'dazn-total-lifetime',
    'Streaming',
    'Watch live boxing matches, UEFA women''s champions league feeds, and sports documentaries with DAZN.',
    1,
    '/images/logos/dazn.svg',
    20,
    TRUE,
    FALSE,
    4.7,
    NOW()
),
(
    'a7a4e5v9-0ru8-4c3w-cd92-3vurq85a4907',
    'ChatGPT+ Accounts [FA]',
    'chatgpt-accounts',
    'AI Tools',
    'Get full access to OpenAI''s ChatGPT Plus. Experience GPT-4o, DALL-E, advanced voice mode, and coding assistants.',
    3.5,
    '/images/logos/chatgpt.svg',
    20,
    TRUE,
    FALSE,
    4.9,
    NOW()
),
(
    'b8b5f6w0-1sv9-4d4x-da03-4wsur96b5018',
    'ExpressVPN (Phone) [LIFETIME]',
    'expressvpn-lifetime',
    'Productivity',
    'Ultra-fast VPN access on your mobile device. Unlock regional content libraries safely and securely.',
    1.35,
    'https://static.mysellauth.com/storage/images/942209.webp',
    0,
    TRUE,
    FALSE,
    4.8,
    NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Approved Reviews for products
INSERT INTO reviews (product_id, customer_email, rating, comment, is_approved, created_at)
VALUES
(
    'a1a8c9b3-4db2-4876-8f3b-d56e729a8341',
    'buyer1@example.com',
    5,
    'Perfect service. Instructions are clear, account setup took seconds.',
    TRUE,
    NOW()
),
(
    'b2b9d0c4-5ec3-4987-9a4c-e67f830b9452',
    'buyer2@example.com',
    4,
    'Very helpful customer support. Works exactly as described.',
    TRUE,
    NOW()
),
(
    'c3c0e1d5-6fd4-4a98-ab5d-f78f941c0563',
    'buyer3@example.com',
    5,
    'Amazing and reliable. Will definitely order from here again.',
    TRUE,
    NOW()
),
(
    'd4d1f2e6-7ae5-4b09-bc6e-089fa52d1674',
    'buyer4@example.com',
    4,
    'Perfect service. Instructions are clear, account setup took seconds.',
    TRUE,
    NOW()
),
(
    'e5e2a3f7-8bf6-4c1a-cd7f-19afb63e2785',
    'buyer5@example.com',
    5,
    'Very helpful customer support. Works exactly as described.',
    TRUE,
    NOW()
),
(
    'f6f3b4a8-9cg7-4d2b-de8g-2abfc74f3896',
    'buyer6@example.com',
    4,
    'Amazing and reliable. Will definitely order from here again.',
    TRUE,
    NOW()
),
(
    'g7g4c5b9-0da8-4e3c-ef9h-3bcda85g4907',
    'buyer7@example.com',
    5,
    'Perfect service. Instructions are clear, account setup took seconds.',
    TRUE,
    NOW()
),
(
    'h8h5d6c0-1eb9-4f4d-fa0i-4cdab96h5018',
    'buyer8@example.com',
    4,
    'Very helpful customer support. Works exactly as described.',
    TRUE,
    NOW()
),
(
    'i9i6e7d1-2fc0-4a5e-ab1j-5deba07i6129',
    'buyer9@example.com',
    5,
    'Amazing and reliable. Will definitely order from here again.',
    TRUE,
    NOW()
),
(
    'j0j7f8e2-3ad1-4b6f-bc2k-6efcb18j7230',
    'buyer10@example.com',
    4,
    'Perfect service. Instructions are clear, account setup took seconds.',
    TRUE,
    NOW()
)
ON CONFLICT DO NOTHING;

-- Seed Sample Inventory Items
INSERT INTO inventory_items (product_id, delivery_content, status)
VALUES
(
    'a1a8c9b3-4db2-4876-8f3b-d56e729a8341',
    'IPTV-ACCOUNTS-LICENSE-KEY-491467',
    'available'
),
(
    'b2b9d0c4-5ec3-4987-9a4c-e67f830b9452',
    'NETFLIX-PREMIUM-LICENSE-KEY-192043',
    'available'
),
(
    'c3c0e1d5-6fd4-4a98-ab5d-f78f941c0563',
    'MINECRAFT-FULLACCESS-LICENSE-KEY-962909',
    'available'
),
(
    'd4d1f2e6-7ae5-4b09-bc6e-089fa52d1674',
    'CANVA-PRO-LICENSE-KEY-516488',
    'available'
),
(
    'e5e2a3f7-8bf6-4c1a-cd7f-19afb63e2785',
    'GEMINI-PRO-5TB-STORAGE-18-MONTHS-LICENSE-KEY-642023',
    'available'
),
(
    'f6f3b4a8-9cg7-4d2b-de8g-2abfc74f3896',
    'PERPLEXITY-AI-PRO-LICENSE-KEY-544345',
    'available'
),
(
    'g7g4c5b9-0da8-4e3c-ef9h-3bcda85g4907',
    'MICROSOFT-OFFICE-365-FA-LICENSE-KEY-109779',
    'available'
),
(
    'h8h5d6c0-1eb9-4f4d-fa0i-4cdab96h5018',
    'CLAUDE-AI-PRO-LICENSE-KEY-465146',
    'available'
),
(
    'i9i6e7d1-2fc0-4a5e-ab1j-5deba07i6129',
    'GROK-PRO-AI-LICENSE-KEY-395513',
    'available'
),
(
    'j0j7f8e2-3ad1-4b6f-bc2k-6efcb18j7230',
    'DEEZER-PREMIUM-LIFETIME-KEY--LICENSE-KEY-338022',
    'available'
),
(
    'k1k8a9f3-4be2-4c7g-cd3l-7fgdc29k8341',
    'FORTNITE-ACCOUNTS-LICENSE-KEY-505471',
    'available'
),
(
    'l2l9b0g4-5cf3-4d8h-de4m-8ghed30l9452',
    'STEAM-ACCOUNTS-FA-LICENSE-KEY-876417',
    'available'
),
(
    'm3m0c1h5-6dg4-4e9i-ef5n-9hife41m0563',
    '14X-SERVER-BOOSTS-1-MONTH-LICENSE-KEY-837566',
    'available'
),
(
    'n4n1d2i6-7eh5-4f0j-fa6o-0ijgf52n1674',
    'PRIME-VIDEO-FA-LICENSE-KEY-609024',
    'available'
),
(
    'o5o2e3j7-8fi6-4a1k-ab7p-1jkhf63o2785',
    'YOUTUBE-PREMIUM-LICENSE-KEY-779491',
    'available'
),
(
    'p6p3f4k8-9gj7-4b2l-bc8q-2klig74p3896',
    'NORDVPN-LIFETIME-LICENSE-KEY-974776',
    'available'
),
(
    'q7q4a5l9-0hk8-4c3m-cd9r-3lmjh85q4907',
    'CAPCUT-PRO-LICENSE-KEY-680555',
    'available'
),
(
    'r8r5b6m0-1il9-4d4n-da0s-4mnki96r5018',
    'IPVANISH-VPN-LIFETIME-LICENSE-KEY-766248',
    'available'
),
(
    's9s6c7n1-2jm0-4e5o-eb1t-5nolj07s6129',
    'DISNEY-PREMIUM-LIFETIME-LICENSE-KEY-243023',
    'available'
),
(
    't0t7d8o2-3kn1-4f6p-bc2u-6opmk18t7230',
    'CRUNCHYROLL-PREMIUM-LIFETIME-LICENSE-KEY-312544',
    'available'
),
(
    'u1u8e9p3-4lo2-4a7q-cd3v-7pqnl29u8341',
    'SPOTIFY-PREMIUM-LIFETIME-KEY-LICENSE-KEY-891405',
    'available'
),
(
    'v2v9f0q4-5mp3-4b8r-de4w-8qpom30v9452',
    'MAX-LICENSE-KEY-143407',
    'available'
),
(
    'w3w0a1r5-6nq4-4c9s-ef5x-9rqpn41w0563',
    'PARAMOUNT-LICENSE-KEY-233926',
    'available'
),
(
    'x4x1b2s6-7or5-4d0t-fa6y-0srqp52x1674',
    'NBA-LIFETIME-LICENSE-KEY-261243',
    'available'
),
(
    'y5y2c3t7-8ps6-4a1u-ab7z-1tsqp63y2785',
    'DUOLINGO-LIFETIME-LICENSE-KEY-934339',
    'available'
),
(
    'z6z3d4u8-9qt7-4b2v-bc81-2utrq74z3896',
    'DAZN-TOTAL-LIFETIME-LICENSE-KEY-785852',
    'available'
),
(
    'a7a4e5v9-0ru8-4c3w-cd92-3vurq85a4907',
    'CHATGPT-ACCOUNTS-LICENSE-KEY-953280',
    'available'
),
(
    'b8b5f6w0-1sv9-4d4x-da03-4wsur96b5018',
    'EXPRESSVPN-LIFETIME-LICENSE-KEY-419857',
    'available'
)
ON CONFLICT DO NOTHING;
