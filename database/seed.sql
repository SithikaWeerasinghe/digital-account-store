-- =============================================================
-- ApexFled Digital Store — Complete Seed (matches schema.sql)
-- 28 products with features, variants, reviews
-- Run in Supabase SQL Editor
-- =============================================================

-- Fix reviews table: add auto-generated ID default if missing
ALTER TABLE reviews ALTER COLUMN id SET DEFAULT 'rev-' || substr(md5(random()::text), 1, 9);

-- =============================================================
-- PRODUCTS (upsert — safe to re-run)
-- =============================================================
INSERT INTO products (id, name, slug, category, description, price, original_price, image_url, features, stock_count, is_instant_delivery, rating, reviews_count, variants)
VALUES

-- 1. IPTV
('a1a8c9b3-4db2-4876-8f3b-d56e729a8341','IPTV','iptv-accounts','Streaming','High-quality live TV channels and movie libraries worldwide.',9,NULL,'https://static.mysellauth.com/storage/images/708006.webp','["4K & HD quality streams","Over 15,000+ channels","Works on Smart TVs, Firestick, Phones","Instant activation"]'::jsonb,20,true,4.9,84,'[{"id":"iptv-v1","label":"1 Month Subscription","price":9},{"id":"iptv-v2","label":"3 Months Subscription","price":17.99},{"id":"iptv-v3","label":"6 Months Subscription","price":28.99},{"id":"iptv-v4","label":"12 Months Subscription","price":38.99}]'::jsonb),

-- 2. Netflix Premium
('b2b9d0c4-5ec3-4987-9a4c-e67f830b9452','Netflix Premium','netflix-premium','Streaming','Stream movies and series in Ultra HD 4K on your dedicated profile.',1,25.01,'/images/logos/netflix.svg','["Ultra HD 4K resolution","Shared profile access","Ad-free experience","Instant setup guide"]'::jsonb,20,true,4.8,142,'[{"id":"netflix-v1","label":"Netflix Premium [Lifetime]","price":1,"original_price":25.01},{"id":"netflix-v2","label":"Netflix Premium FA [4k Plan]","price":7.7}]'::jsonb),

-- 3. Minecraft
('c3c0e1d5-6fd4-4a98-ab5d-f78f941c0563','Minecraft Account (Full Access)','minecraft-fullaccess','Gaming','Full access Minecraft account with customizable profile settings.',7,29.99,'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/118c22e2-2388-493b-8ee7-4d026a1b1300/public','["Change email and password","Full security configuration","Personal skin customization","Lifetime account ownership"]'::jsonb,20,true,4.7,39,NULL),

-- 4. Canva Pro
('d4d1f2e6-7ae5-4b09-bc6e-089fa52d1674','Canva Pro','canva-pro','Productivity','Access Canva''s premium tools and templates for professional design.',1.9,3,'https://static.mysellauth.com/storage/images/732547.webp','["Access to millions of premium assets","One-click background remover","Brand kit management","AI writing & magic design tools"]'::jsonb,20,true,4.9,56,'[{"id":"canva-v1","label":"1 Year Access","price":1.9,"original_price":3},{"id":"canva-v2","label":"Lifetime Access","price":3}]'::jsonb),

-- 5. Gemini Pro + 5TB Storage
('e5e2a3f7-8bf6-4c1a-cd7f-19afb63e2785','Gemini Pro + 5TB Storage – 18 months','gemini-pro-5tb-storage-18-months','AI Tools','Google Gemini Pro AI with 5TB high-speed Google One Cloud Storage.',9,NULL,'https://static.mysellauth.com/storage/images/676023.webp','["Gemini Advanced features","5TB shared Google cloud storage","Priority AI response speeds","18 months continuous warranty"]'::jsonb,20,false,4.9,18,NULL),

-- 6. Perplexity AI Pro
('f6f3b4a8-9cg7-4d2b-de8g-2abfc74f3896','PERPLEXITY AI PRO [FA]','perplexity-ai-pro','AI Tools','Advanced AI search with access to Claude 3.5 and GPT-4o.',4,15,'https://static.mysellauth.com/storage/images/799438.webp','["Copilot advanced research mode","Choose models (GPT-4o, Claude 3.5)","Unlimited query searches","PDF and image analysis"]'::jsonb,20,false,4.9,29,'[{"id":"perplexity-v1","label":"1 Month Access","price":4},{"id":"perplexity-v2","label":"Lifetime Access","price":15}]'::jsonb),

-- 7. Microsoft Office 365
('g7g4c5b9-0da8-4e3c-ef9h-3bcda85g4907','Microsoft Office 365 [YEARLY] [FA]','microsoft-office-365-fa','Software','Complete productivity suite including Word, Excel, and OneDrive.',7,10,'https://static.mysellauth.com/storage/images/799443.webp','["Full Office Suite downloads","1TB OneDrive Cloud storage","Usage across 5 devices simultaneously","1-year digital warranty"]'::jsonb,20,false,4.8,45,NULL),

-- 8. Claude AI Pro
('h8h5d6c0-1eb9-4f4d-fa0i-4cdab96h5018','Claude AI Pro','claude-ai-pro','AI Tools','High-tier access to Anthropic''s Claude 3.5 Sonnet and projects.',10.99,48.99,'https://static.mysellauth.com/storage/images/846874.webp','["Claude 3.5 Sonnet advanced context","Claude Projects capability","5x higher message limit than free tier","Early access to feature drops"]'::jsonb,20,false,4.9,31,'[{"id":"claude-v1","label":"1 Month Access","price":10.99},{"id":"claude-v2","label":"12 Months Access","price":48.99}]'::jsonb),

-- 9. Grok Pro AI (out of stock)
('i9i6e7d1-2fc0-4a5e-ab1j-5deba07i6129','Grok Pro AI','grok-pro-ai','AI Tools','Premium access to xAI''s Grok conversational model in real-time.',3.5,5,'https://static.mysellauth.com/storage/images/873807.webp','["Real-time source data access","Humor and standard toggle modes","High processing capacities","Fast prompt response times"]'::jsonb,0,false,4.6,12,'[{"id":"grok-v1","label":"1 Month Access","price":3.5},{"id":"grok-v2","label":"Lifetime Access","price":5}]'::jsonb),

-- 10. Deezer Premium
('j0j7f8e2-3ad1-4b6f-bc2k-6efcb18j7230','Deezer Premium LIFETIME [ KEY ]','deezer-premium-lifetime-key-','Streaming','Redeemable key for lifetime Deezer Premium music streaming.',7,NULL,'https://static.mysellauth.com/storage/images/900650.webp','["Ad-free music stream","High Fidelity CD quality sound","Offline playback lists","Universal platform key compatibility"]'::jsonb,20,false,4.9,42,NULL),

-- 11. Fortnite Accounts
('k1k8a9f3-4be2-4c7g-cd3l-7fgdc29k8341','Fortnite Accounts [Full Access]','fortnite-accounts','Gaming','Full access Fortnite accounts with guaranteed rare skins.',4.8,59.99,'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/a0cd570e-9727-42bf-067f-e642bfc0cc00/public','["Guaranteed skin count tiers","Universal platform support (PC/Console)","Full account email access","Lifetime account warranty"]'::jsonb,20,false,4.8,110,'[{"id":"fn-v1","label":"+20 Skins Bundle","price":4.8},{"id":"fn-v2","label":"+50 Skins Bundle","price":9},{"id":"fn-v3","label":"+100 Skins Bundle","price":15.99},{"id":"fn-v4","label":"+200 Skins Bundle","price":34.99},{"id":"fn-v5","label":"+300 Skins Bundle","price":59.99}]'::jsonb),

-- 12. Steam Accounts
('l2l9b0g4-5cf3-4d8h-de4m-8ghed30l9452','Steam Accounts [FA]','steam-accounts-fa','Gaming','Full access Steam accounts pre-loaded with random game libraries.',0.1,NULL,'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/76829d53-b9fc-4f06-af57-6ea4b2367d00/public','["Instant login details","Random pre-loaded games","Clean status with no bans","Change email configuration"]'::jsonb,20,false,4.7,228,NULL),

-- 13. Discord Server Boosts
('m3m0c1h5-6dg4-4e9i-ef5n-9hife41m0563','14x Server Boosts (1/3 month)','14x-server-boosts-1-month','Software','Level up your Discord server with 14 Server Boosts.',5,10,'/images/logos/discord.svg','["Custom server URL banner access","1080p 60fps streaming","100MB+ upload file limits","Level 3 unlocked status"]'::jsonb,20,false,4.9,65,'[{"id":"boost-v1","label":"1 Month Coverage","price":5},{"id":"boost-v2","label":"3 Months Coverage","price":10}]'::jsonb),

-- 14. Amazon Prime Video
('n4n1d2i6-7eh5-4f0j-fa6o-0ijgf52n1674','Amazon Prime Video [FA]','prime-video-fa','Streaming','Full access to Prime Video movies, series, and Amazon Originals.',2,6,'/images/logos/prime-video.svg','["Ultra HD streaming support","Watch offline via download","Multi-profile customization","Warranty during subscription"]'::jsonb,20,false,4.8,24,'[{"id":"prime-v1","label":"1 Month Access","price":2},{"id":"prime-v2","label":"12 Months Access","price":6}]'::jsonb),

-- 15. YouTube Premium
('o5o2e3j7-8fi6-4a1k-ab7p-1jkhf63o2785','YouTube Premium','youtube-premium','Streaming','Enjoy ad-free YouTube videos and offline background playback.',2.35,4.5,'/images/logos/youtube.svg','["Zero ads on video/music","Background play support","Offline video downloading","YouTube Music Premium included"]'::jsonb,20,false,4.9,97,'[{"id":"yt-v1","label":"3 Months Subscription","price":2.35},{"id":"yt-v2","label":"6 Months Subscription","price":4.5}]'::jsonb),

-- 16. NordVPN
('p6p3f4k8-9gj7-4b2l-bc8q-2klig74p3896','NordVPN [LIFETIME]','nordvpn-lifetime','Productivity','Fast, secure, and anonymous internet browsing with NordVPN.',2.5,NULL,'/images/logos/nordvpn.svg','["Military-grade encryption","No logs database architecture","5400+ servers worldwide","Lifetime login support warranty"]'::jsonb,20,false,4.8,38,NULL),

-- 17. CapCut Pro (out of stock)
('q7q4a5l9-0hk8-4c3m-cd9r-3lmjh85q4907','Capcut [Pro] [Lifetime]','capcut-pro','Software','Unlock CapCut Pro templates, transitions, and advanced filters.',1.2,NULL,'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/99275149-9196-4206-0aa2-29b59f857d00/public','["Premium templates unlocked","Advanced filters and effects","4K high bitrate video export","Ad-free editor workspace"]'::jsonb,0,false,4.7,14,NULL),

-- 18. IPVanish VPN (out of stock)
('r8r5b6m0-1il9-4d4n-da0s-4mnki96r5018','IPVanish VPN (LIFETIME)','ipvanish-vpn-lifetime','Productivity','Unmetered device connections with a strict no-logs policy.',1.2,NULL,'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/a2e0e6b1-6348-412b-298b-939b86d1bb00/public','["Unmetered simultaneous setups","Strict no-logs tracking","IP masking capabilities","Secure digital download details"]'::jsonb,0,false,4.8,52,NULL),

-- 19. Disney+
('s9s6c7n1-2jm0-4e5o-eb1t-5nolj07s6129','Disney+ Premium [Lifetime]','disney-premium-lifetime','Streaming','Stream movies and series from Disney, Pixar, and Marvel.',1,NULL,'/images/logos/disney-plus.svg','["Full HD streaming capacity","GroupWatch compatible","Profiles for family setup","Instant delivery email details"]'::jsonb,20,true,4.8,139,NULL),

-- 20. Crunchyroll
('t0t7d8o2-3kn1-4f6p-bc2u-6opmk18t7230','Crunchyroll Premium [Lifetime]','crunchyroll-premium-lifetime','Streaming','Watch ad-free anime and read digital manga simulcasts.',1,NULL,'/images/logos/crunchyroll.svg','["No ads on stream catalogs","Simulcast episodes release access","Stream on 4 devices at once","Offline download support"]'::jsonb,20,true,4.9,112,NULL),

-- 21. Spotify
('u1u8e9p3-4lo2-4a7q-cd3v-7pqnl29u8341','Spotify Premium [Lifetime Key]','spotify-premium-lifetime-key','Streaming','Lifetime Spotify Premium key for ad-free offline music.',7.6,41.7,'/images/logos/spotify.svg','["Ad-free music player","Download music offline","High-fidelity audio stream quality","Lifetime activation key"]'::jsonb,20,true,4.9,304,NULL),

-- 22. HBO Max
('v2v9f0q4-5mp3-4b8r-de4w-8qpom30v9452','HBO Max [Lifetime]','max','Streaming','Access premium Max Originals and movie catalogs on your device.',1,NULL,'/images/logos/hbo-max.svg','["Access to HBO library","High definition streams","Personalized user profile","Lifetime warranty coverage"]'::jsonb,20,true,4.7,48,NULL),

-- 23. Paramount+
('w3w0a1r5-6nq4-4c9s-ef5x-9rqpn41w0563','Paramount+ [Lifetime]','paramount','Streaming','Stream live sports, Paramount+ originals, and movie catalogs.',1,NULL,'/images/logos/paramount-plus.svg','["Live sports streaming feed","Paramount+ originals unlocked","Offline downloads","Instant login details"]'::jsonb,20,true,4.8,29,NULL),

-- 24. NBA
('x4x1b2s6-7or5-4d0t-fa6y-0srqp52x1674','Nba [LIFETIME]','nba-lifetime','Streaming','NBA League Pass for live streaming matches and archives.',1,NULL,'/images/logos/nba.svg','["Live game streaming feed","Classic games and archives","Multiple language audio","Lifetime warranty support"]'::jsonb,20,true,4.8,31,NULL),

-- 25. Duolingo
('y5y2c3t7-8ps6-4a1u-ab7z-1tsqp63y2785','Duolingo [LIFETIME]','duolingo-lifetime','Productivity','Learn languages ad-free with unlimited hearts on Duolingo Plus.',1,NULL,'https://imagedelivery.net/HL_Fwm__tlvUGLZF2p74xw/4581f2fb-8c88-40b4-0263-510ee09ef200/public','["No advertisements on lesson plans","Unlimited practice hearts","Personalized review sessions","Offline lesson compatibility"]'::jsonb,20,true,4.9,84,NULL),

-- 26. DAZN
('z6z3d4u8-9qt7-4b2v-bc81-2utrq74z3896','Dazn [Lifetime]','dazn-total-lifetime','Streaming','Watch live boxing, sports tournaments, and documentaries.',1,NULL,'/images/logos/dazn.svg','["Live sports channel feeds","On-demand recordings and clips","Universal streaming compatibility","Warranty during use"]'::jsonb,20,false,4.7,41,'[{"id":"dazn-v1","label":"Standard Plan","price":1},{"id":"dazn-v2","label":"Premium Plan","price":1.65}]'::jsonb),

-- 27. ChatGPT+
('a7a4e5v9-0ru8-4c3w-cd92-3vurq85a4907','ChatGPT+ Accounts [FA]','chatgpt-accounts','AI Tools','Full access to OpenAI''s ChatGPT Plus and advanced models.',3.5,15.99,'/images/logos/chatgpt.svg','["Access to GPT-4o and advanced models","Create custom GPT instances","Fast prompt response times","DALL-E magic graphic generation"]'::jsonb,20,false,4.9,154,'[{"id":"gpt-v1","label":"1 Month Access","price":3.5},{"id":"gpt-v2","label":"Lifetime Access","price":15.99}]'::jsonb),

-- 28. ExpressVPN (out of stock)
('b8b5f6w0-1sv9-4d4x-da03-4wsur96b5018','ExpressVPN (Phone) [LIFETIME]','expressvpn-lifetime','Productivity','Ultra-fast secure mobile VPN proxy access.',1.35,NULL,'https://static.mysellauth.com/storage/images/942209.webp','["Fast server connections","Encryption protocol suite","Phone specific layout UI","Instant credentials delivery"]'::jsonb,0,false,4.8,19,NULL)

ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  description      = EXCLUDED.description,
  price            = EXCLUDED.price,
  original_price   = EXCLUDED.original_price,
  image_url        = EXCLUDED.image_url,
  features         = EXCLUDED.features,
  stock_count      = EXCLUDED.stock_count,
  is_instant_delivery = EXCLUDED.is_instant_delivery,
  rating           = EXCLUDED.rating,
  reviews_count    = EXCLUDED.reviews_count,
  variants         = EXCLUDED.variants;

-- =============================================================
-- SAMPLE REVIEWS (approved, one per product)
-- =============================================================
INSERT INTO reviews (id, product_id, customer_email, rating, comment, is_approved, created_at)
VALUES
('rev-a1iptv01','a1a8c9b3-4db2-4876-8f3b-d56e729a8341','buyer1@example.com',5,'Perfect service. Instructions are clear, account setup took seconds.',true,NOW() - INTERVAL '2 days'),
('rev-b2netf01','b2b9d0c4-5ec3-4987-9a4c-e67f830b9452','buyer2@example.com',5,'Working perfectly! Very fast delivery and great quality.',true,NOW() - INTERVAL '3 days'),
('rev-c3mine01','c3c0e1d5-6fd4-4a98-ab5d-f78f941c0563','buyer3@example.com',5,'Amazing and reliable. Will definitely order from here again.',true,NOW() - INTERVAL '1 day'),
('rev-d4canv01','d4d1f2e6-7ae5-4b09-bc6e-089fa52d1674','buyer4@example.com',4,'Very helpful customer support. Works exactly as described.',true,NOW() - INTERVAL '4 days'),
('rev-e5gemi01','e5e2a3f7-8bf6-4c1a-cd7f-19afb63e2785','buyer5@example.com',5,'Exceeded my expectations. Great value for the price.',true,NOW() - INTERVAL '5 days'),
('rev-f6perp01','f6f3b4a8-9cg7-4d2b-de8g-2abfc74f3896','buyer6@example.com',5,'Works like a charm! No issues at all, fast and smooth.',true,NOW() - INTERVAL '2 days'),
('rev-g7msft01','g7g4c5b9-0da8-4e3c-ef9h-3bcda85g4907','buyer7@example.com',4,'Solid product. Instructions were clear and setup was easy.',true,NOW() - INTERVAL '6 days'),
('rev-h8clau01','h8h5d6c0-1eb9-4f4d-fa0i-4cdab96h5018','buyer8@example.com',5,'Top quality! Received everything as promised. 100% legit.',true,NOW() - INTERVAL '1 day'),
('rev-i9grok01','i9i6e7d1-2fc0-4a5e-ab1j-5deba07i6129','buyer9@example.com',5,'Great experience. Will come back for more products.',true,NOW() - INTERVAL '7 days'),
('rev-j0deez01','j0j7f8e2-3ad1-4b6f-bc2k-6efcb18j7230','buyer10@example.com',5,'Fast delivery and honest seller. Highly recommended!',true,NOW() - INTERVAL '3 days'),
('rev-k1fort01','k1k8a9f3-4be2-4c7g-cd3l-7fgdc29k8341','buyer11@example.com',5,'Exactly what was described. Super happy with my purchase!',true,NOW() - INTERVAL '2 days'),
('rev-l2stea01','l2l9b0g4-5cf3-4d8h-de4m-8ghed30l9452','buyer12@example.com',4,'Good value. Account had everything listed. Would buy again.',true,NOW() - INTERVAL '5 days'),
('rev-m3disc01','m3m0c1h5-6dg4-4e9i-ef5n-9hife41m0563','buyer13@example.com',5,'Server boost applied immediately. Great seller, fast reply.',true,NOW() - INTERVAL '4 days'),
('rev-n4prim01','n4n1d2i6-7eh5-4f0j-fa6o-0ijgf52n1674','buyer14@example.com',5,'Works great. Got my account info within minutes. Thanks!',true,NOW() - INTERVAL '1 day'),
('rev-o5yout01','o5o2e3j7-8fi6-4a1k-ab7p-1jkhf63o2785','buyer15@example.com',5,'No ads, background play — exactly what I needed. Legit!',true,NOW() - INTERVAL '2 days'),
('rev-p6nord01','p6p3f4k8-9gj7-4b2l-bc8q-2klig74p3896','buyer16@example.com',4,'VPN working on all my devices. Good speeds too.',true,NOW() - INTERVAL '3 days'),
('rev-s9disn01','s9s6c7n1-2jm0-4e5o-eb1t-5nolj07s6129','buyer17@example.com',5,'Worked straight away! Disney+ loaded perfectly. 5 stars.',true,NOW() - INTERVAL '6 days'),
('rev-t0crun01','t0t7d8o2-3kn1-4f6p-bc2u-6opmk18t7230','buyer18@example.com',5,'Anime fan here. This is the best deal I found online!',true,NOW() - INTERVAL '2 days'),
('rev-u1spot01','u1u8e9p3-4lo2-4a7q-cd3v-7pqnl29u8341','buyer19@example.com',5,'Spotify working without any ads. Lifetime key activated!',true,NOW() - INTERVAL '4 days'),
('rev-v2hbo001','v2v9f0q4-5mp3-4b8r-de4w-8qpom30v9452','buyer20@example.com',4,'Good quality. Account works on all devices. Happy customer.',true,NOW() - INTERVAL '1 day'),
('rev-w3para01','w3w0a1r5-6nq4-4c9s-ef5x-9rqpn41w0563','buyer21@example.com',5,'Quick and smooth. Exactly what I ordered. Recommended!',true,NOW() - INTERVAL '5 days'),
('rev-x4nba001','x4x1b2s6-7or5-4d0t-fa6y-0srqp52x1674','buyer22@example.com',5,'Live NBA games working great. Love it!',true,NOW() - INTERVAL '3 days'),
('rev-y5duol01','y5y2c3t7-8ps6-4a1u-ab7z-1tsqp63y2785','buyer23@example.com',5,'No ads, unlimited hearts. Duolingo is so much better now.',true,NOW() - INTERVAL '2 days'),
('rev-z6dazn01','z6z3d4u8-9qt7-4b2v-bc81-2utrq74z3896','buyer24@example.com',4,'Sports streams are clear and reliable. Good service.',true,NOW() - INTERVAL '7 days'),
('rev-a7chat01','a7a4e5v9-0ru8-4c3w-cd92-3vurq85a4907','buyer25@example.com',5,'ChatGPT Plus working perfectly. GPT-4o access confirmed!',true,NOW() - INTERVAL '1 day')

ON CONFLICT (id) DO NOTHING;
