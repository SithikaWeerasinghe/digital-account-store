# Digital Account Store Database Setup Guide

This folder contains the database foundation files for the Digital Account Store e-commerce platform. The system is designed to integrate seamlessly with **Supabase (PostgreSQL)**.

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step-by-Step Installation](#2-step-by-step-installation)
3. [Database Schema Overview](#3-database-schema-overview)
4. [Environment Variables](#4-environment-variables)
5. [Backend Service Layer Integration (camelCase Mapping)](#5-backend-service-layer-integration-camelcase-mapping)

---

## 1. Prerequisites
- A web browser to access the [Supabase Dashboard](https://supabase.com).
- A free Supabase account.

---

## 2. Step-by-Step Installation

### Step A: Create a New Supabase Project
1. Log in to your account at [supabase.com](https://supabase.com).
2. Click on **New Project** in your dashboard organization.
3. Provide a **Project Name** (e.g., `digital-account-store`).
4. Set a strong **Database Password** (write this down, you will need it for environment configurations).
5. Select a region close to your target audience.
6. Click **Create new project** and wait a few minutes for the database instance to provision.

### Step B: Run the Database Schema
1. Inside your Supabase project dashboard, navigate to the **SQL Editor** tab from the left sidebar navigation menu (indicated by a terminal console icon `SQL`).
2. Click **New Query**.
3. Copy the entire contents of the `database/schema.sql` file and paste it into the editor window.
4. Click **Run** (or press `Cmd + Enter` / `Ctrl + Enter`).
5. Verify the console outputs `Success. No rows returned` and that all database tables have been successfully created.

### Step C: Seed the Mock Catalog
1. Click **New Query** again in the SQL Editor.
2. Copy the entire contents of the `database/seed.sql` file and paste it into the editor.
3. Click **Run**.
4. This seeds safe, realistic placeholder products, reviews, and mock digital delivery content without compromising security or storing credentials.

### Step D: (Optional) Add Stripe Integration Fields — DEPRECATED
> Stripe is no longer the active gateway (see Step E). These columns are kept but unused.

When preparing for Stripe payment integration:
1. Click **New Query** again in the SQL Editor.
2. Copy the entire contents of the `database/migration_stripe_fields.sql` file and paste it into the editor.
3. Click **Run**.
4. This adds Stripe-ready columns to the orders table: `stripe_session_id`, `stripe_payment_intent_id`, and `paid_at`.
5. Verify the columns exist: Run `SELECT * FROM orders LIMIT 1;` and check for the new columns.

### Step E: Add Mercado Pago Integration Fields — ACTIVE
Mercado Pago (Checkout Pro) is the active payment gateway. To enable payment tracking:
1. Click **New Query** again in the SQL Editor.
2. Copy the entire contents of the `database/migration_mercadopago_fields.sql` file and paste it into the editor.
3. Click **Run**.
4. This adds Mercado Pago columns to the orders table: `mercadopago_preference_id`, `mercadopago_payment_id`, `mercadopago_merchant_order_id`, `mercadopago_status`, and `paid_at` (created if it does not already exist).
5. Verify the columns exist: Run `SELECT * FROM orders LIMIT 1;` and check for the new columns.

> **Note:** This migration is safe to run even if you already ran the Stripe migration — it does not touch or remove the Stripe columns, and `paid_at` is created only if missing.

---

## 3. Database Schema Overview

The database contains 6 interconnected tables:

*   **`products`**: Stores the items listed in the e-commerce store catalog. Includes basic parameters, tags, and stock counts.
*   **`inventory_items`**: Houses the actual redeemable content (such as activation keys or download links). Digital items are delivered automatically based on an `available` status constraint, matching against the transaction quantity.
*   **`orders`**: Tracks order history, customer emails, billing prices, payment statuses (`pending`, `paid`, `failed`, `refunded`), and fulfillment states.
*   **`tickets`**: Customer support tickets containing a category, subject, message, status tracking (`open`, `in_progress`, `resolved`, `closed`), and admin responses.
*   **`reviews`**: Ratings from 1 to 5 stars along with customer comments, requiring an admin `is_approved` flag before appearing publicly.
*   **`admin_users`**: Administrative credentials and access permissions.

---

## 4. Environment Variables

To connect your Next.js application to the Supabase client later, create a `.env.local` file in your project root folder and specify the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anonymous-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key (for secure admin actions)
```

> [!NOTE]
> You can retrieve these credentials from your Supabase Project Dashboard under **Project Settings** > **API**.

---

## 5. Backend Service Layer Integration (camelCase Mapping)

To maintain clean frontend components while adhering to robust database standards:
- The **Database layer** uses traditional PostgreSQL `snake_case` column naming metrics.
- The **TypeScript Frontend UI** requires unified, clean JS `camelCase` properties.

To bridge this seamlessly, the backend service layer (`lib/services/`) acts as an adapter, translating keys automatically:

```typescript
// Sample adapter mapping function inside productService.ts
export function mapDatabaseProduct(dbRow: any): Product {
  return {
    id: dbRow.id,
    name: dbRow.name,
    slug: dbRow.slug,
    category: dbRow.category,
    description: dbRow.description || '',
    price: Number(dbRow.price),
    originalPrice: dbRow.original_price ? Number(dbRow.original_price) : undefined,
    imageUrl: dbRow.image_url || '',
    features: dbRow.features || [],
    inStock: dbRow.stock_count > 0, // Calculates stock availability
    isInstantDelivery: dbRow.is_instant_delivery ?? true,
    rating: Number(dbRow.rating || 0),
    reviewsCount: Number(dbRow.reviews_count || 0),
    createdAt: dbRow.created_at
  };
}
```
This guarantees that no changes are required within our existing UI code, making the live integration phase fast and safe.
