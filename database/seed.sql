-- Digital Account Store Database Seed Data (Exactly 28 unique products)
-- Generated on 2026-06-01T07:11:27.062Z

-- Seed Products
INSERT INTO products (id, name, slug, category, description, price, image_url, stock_count, is_active, is_instant_delivery, rating, created_at)
VALUES
(
    'a1a8c9b3-4db2-4876-8f3b-d56e729a8341',
    'IPTV',
    'iptv-accounts',
    'Streaming',
    'High-quality live TV channels and movie libraries worldwide.',
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
    'Stream movies and series in Ultra HD 4K on your dedicated profile.',
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
    'Full access Minecraft account with customizable profile settings.',
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
    'Access Canva''s premium tools and templates for professional design.',
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
    'Google Gemini Pro AI with 5TB high-speed Google One Cloud Storage.',
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
    'Advanced AI search with access to Claude 3.5 and GPT-4o.',
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
    'Complete productivity suite including Word, Excel, and OneDrive.',
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
    'High-tier access to Anthropic''s Claude 3.5 Sonnet and projects.',
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
    'Premium access to xAI''s Grok conversational model in real-time.',
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
    'Redeemable key for lifetime Deezer Premium music streaming.',
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
    'Full access Fortnite accounts with guaranteed rare skins.',
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
    'Full access Steam accounts pre-loaded with random game libraries.',
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
    'Level up your Discord server with 14 Server Boosts.',
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
    'Full access to Prime Video movies, series, and Amazon Originals.',
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
    'Enjoy ad-free YouTube videos and offline background playback.',
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
    'Fast, secure, and anonymous internet browsing with NordVPN.',
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
    'Unlock CapCut Pro templates, transitions, and advanced filters.',
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
    'Unmetered device connections with a strict no-logs policy.',
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
    'Stream movies and series from Disney, Pixar, and Marvel.',
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
    'Watch ad-free anime and read digital manga simulcasts.',
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
    'Lifetime Spotify Premium key for ad-free offline music.',
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
    'Access premium Max Originals and movie catalogs on your device.',
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
    'Stream live sports, Paramount+ originals, and movie catalogs.',
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
    'NBA League Pass for live streaming matches and archives.',
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
    'Learn languages ad-free with unlimited hearts on Duolingo Plus.',
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
    'Watch live boxing, sports tournaments, and documentaries.',
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
    'Full access to OpenAI''s ChatGPT Plus and advanced models.',
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
    'Ultra-fast secure mobile VPN proxy access.',
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
    'IPTV-ACCOUNTS-LICENSE-KEY-125050',
    'available'
),
(
    'b2b9d0c4-5ec3-4987-9a4c-e67f830b9452',
    'NETFLIX-PREMIUM-LICENSE-KEY-548240',
    'available'
),
(
    'c3c0e1d5-6fd4-4a98-ab5d-f78f941c0563',
    'MINECRAFT-FULLACCESS-LICENSE-KEY-992647',
    'available'
),
(
    'd4d1f2e6-7ae5-4b09-bc6e-089fa52d1674',
    'CANVA-PRO-LICENSE-KEY-160794',
    'available'
),
(
    'e5e2a3f7-8bf6-4c1a-cd7f-19afb63e2785',
    'GEMINI-PRO-5TB-STORAGE-18-MONTHS-LICENSE-KEY-102901',
    'available'
),
(
    'f6f3b4a8-9cg7-4d2b-de8g-2abfc74f3896',
    'PERPLEXITY-AI-PRO-LICENSE-KEY-543070',
    'available'
),
(
    'g7g4c5b9-0da8-4e3c-ef9h-3bcda85g4907',
    'MICROSOFT-OFFICE-365-FA-LICENSE-KEY-124191',
    'available'
),
(
    'h8h5d6c0-1eb9-4f4d-fa0i-4cdab96h5018',
    'CLAUDE-AI-PRO-LICENSE-KEY-434916',
    'available'
),
(
    'i9i6e7d1-2fc0-4a5e-ab1j-5deba07i6129',
    'GROK-PRO-AI-LICENSE-KEY-614014',
    'available'
),
(
    'j0j7f8e2-3ad1-4b6f-bc2k-6efcb18j7230',
    'DEEZER-PREMIUM-LIFETIME-KEY--LICENSE-KEY-753165',
    'available'
),
(
    'k1k8a9f3-4be2-4c7g-cd3l-7fgdc29k8341',
    'FORTNITE-ACCOUNTS-LICENSE-KEY-333379',
    'available'
),
(
    'l2l9b0g4-5cf3-4d8h-de4m-8ghed30l9452',
    'STEAM-ACCOUNTS-FA-LICENSE-KEY-323249',
    'available'
),
(
    'm3m0c1h5-6dg4-4e9i-ef5n-9hife41m0563',
    '14X-SERVER-BOOSTS-1-MONTH-LICENSE-KEY-135506',
    'available'
),
(
    'n4n1d2i6-7eh5-4f0j-fa6o-0ijgf52n1674',
    'PRIME-VIDEO-FA-LICENSE-KEY-344296',
    'available'
),
(
    'o5o2e3j7-8fi6-4a1k-ab7p-1jkhf63o2785',
    'YOUTUBE-PREMIUM-LICENSE-KEY-948491',
    'available'
),
(
    'p6p3f4k8-9gj7-4b2l-bc8q-2klig74p3896',
    'NORDVPN-LIFETIME-LICENSE-KEY-486456',
    'available'
),
(
    'q7q4a5l9-0hk8-4c3m-cd9r-3lmjh85q4907',
    'CAPCUT-PRO-LICENSE-KEY-449138',
    'available'
),
(
    'r8r5b6m0-1il9-4d4n-da0s-4mnki96r5018',
    'IPVANISH-VPN-LIFETIME-LICENSE-KEY-904707',
    'available'
),
(
    's9s6c7n1-2jm0-4e5o-eb1t-5nolj07s6129',
    'DISNEY-PREMIUM-LIFETIME-LICENSE-KEY-332166',
    'available'
),
(
    't0t7d8o2-3kn1-4f6p-bc2u-6opmk18t7230',
    'CRUNCHYROLL-PREMIUM-LIFETIME-LICENSE-KEY-259676',
    'available'
),
(
    'u1u8e9p3-4lo2-4a7q-cd3v-7pqnl29u8341',
    'SPOTIFY-PREMIUM-LIFETIME-KEY-LICENSE-KEY-284105',
    'available'
),
(
    'v2v9f0q4-5mp3-4b8r-de4w-8qpom30v9452',
    'MAX-LICENSE-KEY-931739',
    'available'
),
(
    'w3w0a1r5-6nq4-4c9s-ef5x-9rqpn41w0563',
    'PARAMOUNT-LICENSE-KEY-720347',
    'available'
),
(
    'x4x1b2s6-7or5-4d0t-fa6y-0srqp52x1674',
    'NBA-LIFETIME-LICENSE-KEY-160115',
    'available'
),
(
    'y5y2c3t7-8ps6-4a1u-ab7z-1tsqp63y2785',
    'DUOLINGO-LIFETIME-LICENSE-KEY-256430',
    'available'
),
(
    'z6z3d4u8-9qt7-4b2v-bc81-2utrq74z3896',
    'DAZN-TOTAL-LIFETIME-LICENSE-KEY-543802',
    'available'
),
(
    'a7a4e5v9-0ru8-4c3w-cd92-3vurq85a4907',
    'CHATGPT-ACCOUNTS-LICENSE-KEY-551919',
    'available'
),
(
    'b8b5f6w0-1sv9-4d4x-da03-4wsur96b5018',
    'EXPRESSVPN-LIFETIME-LICENSE-KEY-446999',
    'available'
)
ON CONFLICT DO NOTHING;
