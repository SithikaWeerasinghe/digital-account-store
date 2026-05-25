-- Digital Account Store Database Seed Data
-- Safe placeholder data with no real credentials or personal information

-- Seed Products
INSERT INTO products (id, name, slug, category, description, price, image_url, stock_count, is_active, is_instant_delivery, rating)
VALUES
(
    'a7b3c2d1-e5f6-4a3b-2c1d-0e9f8a7b6c5d',
    'Streaming Entertainment Pack',
    'streaming-entertainment-pack',
    'Streaming',
    'Access to premium shared streaming services with a dedicated user profile. High definition quality, multi-device compatibility, and instant digital key delivery.',
    19.99,
    'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=600&auto=format&fit=crop',
    150,
    TRUE,
    TRUE,
    4.7
),
(
    'b8c4d3e2-f6a7-5b4c-3d2e-1f0a9b8c7d6e',
    'AI Productivity Pack',
    'ai-productivity-pack',
    'AI Tools',
    'Unlock your complete workflow efficiency with our curated suite of professional AI automation, smart text completion, and task scheduling tools.',
    24.99,
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=600&auto=format&fit=crop',
    90,
    TRUE,
    TRUE,
    4.9
),
(
    'c9d5e4f3-a7b8-6c5d-4e3f-2a1b0c9d8e7f',
    'Creator Tools Bundle',
    'creator-tools-bundle',
    'AI Tools',
    'The ultimate bundle for modern content creators. Includes premium assets, design filters, templates, and high-fidelity editing assistance tools.',
    39.99,
    'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop',
    75,
    TRUE,
    TRUE,
    4.6
),
(
    'd0e6f5a4-b8c9-7d6e-5f4a-3b2c1d0e9f8a',
    'Gaming Starter Bundle',
    'gaming-starter-bundle',
    'Gaming',
    'Jumpstart your gaming journey. Includes unique character skins, starting resources, and access pass codes for popular online multiplayer worlds.',
    14.99,
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    200,
    TRUE,
    TRUE,
    4.5
),
(
    'e1f7a6b5-c9d0-8e7f-6a5b-4c3d2e1f0a9b',
    'Software License Pack',
    'software-license-pack',
    'Software',
    'A fully licensed office suite activation pack. Lifetime access for word processors, high-performance spreadsheets, slides, and secure local file protection.',
    49.99,
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop',
    120,
    TRUE,
    TRUE,
    4.8
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Approved Reviews for seeded products
INSERT INTO reviews (product_id, customer_email, rating, comment, is_approved)
VALUES
(
    'a7b3c2d1-e5f6-4a3b-2c1d-0e9f8a7b6c5d',
    'customer1@example.com',
    5,
    'Absolutely excellent streaming package. Key was delivered to my inbox in less than 30 seconds and setup instructions were flawless!',
    TRUE
),
(
    'a7b3c2d1-e5f6-4a3b-2c1d-0e9f8a7b6c5d',
    'customer2@example.com',
    4,
    'Works very well on my smart TV. The stream quality is crystal clear.',
    TRUE
),
(
    'b8c4d3e2-f6a7-5b4c-3d2e-1f0a9b8c7d6e',
    'writer_pro@example.com',
    5,
    'This AI bundle completely restructured my daily workflow. Saves me hours of research and writing every single week.',
    TRUE
),
(
    'c9d5e4f3-a7b8-6c5d-4e3f-2a1b0c9d8e7f',
    'vlogger_hq@example.com',
    4,
    'Very solid collection of creative templates. Highly recommended for beginners and intermediate content developers.',
    TRUE
),
(
    'd0e6f5a4-b8c9-7d6e-5f4a-3b2c1d0e9f8a',
    'gamerguy@example.com',
    5,
    'Unbeatable price for such a complete set of skins and codes. Worked perfectly without any redemption hiccups!',
    TRUE
)
ON CONFLICT DO NOTHING;

-- Seed Sample Inventory Items (safe mock digital keys)
INSERT INTO inventory_items (product_id, delivery_content, status)
VALUES
('a7b3c2d1-e5f6-4a3b-2c1d-0e9f8a7b6c5d', 'STREAM-KEY-8X9Y1Z-MOCK', 'available'),
('a7b3c2d1-e5f6-4a3b-2c1d-0e9f8a7b6c5d', 'STREAM-KEY-2A3B4C-MOCK', 'available'),
('b8c4d3e2-f6a7-5b4c-3d2e-1f0a9b8c7d6e', 'AIPROD-LICENSE-998877-MOCK', 'available'),
('c9d5e4f3-a7b8-6c5d-4e3f-2a1b0c9d8e7f', 'CREATOR-ASSETS-ZIP-LINK-MOCK', 'available'),
('d0e6f5a4-b8c9-7d6e-5f4a-3b2c1d0e9f8a', 'GAME-REDEEM-CODE-QWERT-MOCK', 'available'),
('e1f7a6b5-c9d0-8e7f-6a5b-4c3d2e1f0a9b', 'OFFICE-LIFETIME-SERIAL-MOCK', 'available');
