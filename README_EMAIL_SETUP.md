# Email Setup (Resend)

This guide explains how to activate transactional emails for the ApexFled store.
Email is powered by [Resend](https://resend.com) and is controlled **entirely by
environment variables** — there is no code change required to turn it on or off.

---

## How It Works

- The email service (`lib/services/emailService.ts`) reads its config from
  `process.env` at runtime and sends via the Resend REST API (no SDK dependency).
- The Resend API key is **server-side only** — it is never imported into any client
  component and never exposed to the browser.
- If `RESEND_API_KEY` is **not set**, every send is safely skipped and logged
  (`[emailService] RESEND_API_KEY not set — skipping email ...`). The app keeps
  working normally; orders, checkout, and the admin dashboard are unaffected.
- All email sending is **best-effort**: a failure never blocks an order, a checkout,
  or the Mercado Pago webhook.

---

## Required Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Yes (to send) | Resend API key. Secret — never commit it. |
| `RESEND_FROM_EMAIL` | Recommended | The "from" address, e.g. `ApexFled <onboarding@resend.dev>`. Defaults to `onboarding@resend.dev` if unset. |
| `ADMIN_NOTIFICATION_EMAIL` | Optional | Where new/paid order notifications go. If unset, admin emails are skipped. |
| `SUPPORT_EMAIL` | Optional | Shown in email footers. Defaults to `support@apexfled.com`. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Used for buttons/links inside emails. |

> **Naming:** this project standardizes on `RESEND_FROM_EMAIL` (not `FROM_EMAIL`).
> If you see `FROM_EMAIL` referenced anywhere, use `RESEND_FROM_EMAIL` instead.

---

## Email Events

| Event | To | When |
|-------|----|------|
| Order confirmation | Customer | Order created (`POST /api/orders`). Shows **pending** until paid — never a fake "paid". |
| New order notification | Admin | Order created (only if `ADMIN_NOTIFICATION_EMAIL` is set). |
| Payment confirmation | Customer | Mercado Pago webhook marks the order **paid**. |
| Paid order notification | Admin | Mercado Pago webhook marks the order **paid**. |
| Resend confirmation | Customer | Admin clicks **Resend Email** in the order detail (admin-protected route). |

---

## Test Resend Locally

1. Create a Resend account at [resend.com](https://resend.com) and copy an **API key**.
2. Add it to `.env.local` in the project root (this file is gitignored — never commit it):

   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   RESEND_FROM_EMAIL=ApexFled <onboarding@resend.dev>
   ADMIN_NOTIFICATION_EMAIL=you@example.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   > Until you verify a custom domain in Resend, you must use `onboarding@resend.dev`
   > as the from address, and Resend test mode only delivers to the account owner's email.

3. Restart the dev server so the new env vars load:

   ```bash
   npm run dev
   ```

4. Place a test order through the checkout. You should receive the **order confirmation**
   (customer) and, if `ADMIN_NOTIFICATION_EMAIL` is set, the **new order** email.
5. To test the **paid** emails without a real Mercado Pago payment, mark the order as
   paid from the admin dashboard, or trigger the webhook in the Mercado Pago sandbox.
6. If `RESEND_API_KEY` is blank, check the dev console — you'll see the
   "skipping email" log instead of a send. That confirms the safe-skip path works.

---

## Add Resend Key to Vercel (Production)

1. Go to your project on [vercel.com](https://vercel.com) → **Settings** → **Environment Variables**.
2. Add each variable (Production + Preview):
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `ADMIN_NOTIFICATION_EMAIL`
   - `SUPPORT_EMAIL` (optional)
   - `NEXT_PUBLIC_SITE_URL` (your live domain, e.g. `https://yourstore.com`)
3. Click **Save**.
4. **Redeploy** the project (Deployments → … → Redeploy) so the new variables take effect.
5. Place a live test order and confirm the emails arrive.

---

## Remaining Limitations / Notes

- **Domain verification:** to send from your own domain (e.g. `noreply@yourstore.com`),
  verify the domain in Resend and update `RESEND_FROM_EMAIL`. Until then use
  `onboarding@resend.dev`.
- **Multi-item carts:** each cart item becomes its own order, so the customer receives
  one confirmation per item (this matches the current order model).
- **Digital delivery content:** the confirmation template supports an optional
  "Your Access Details" block (`credentials`), but automated delivery of inventory keys
  is not wired yet — the admin can include credentials via the **Resend Email** action.
- **Currency display:** email totals are formatted in EUR for display; this is cosmetic
  and independent of the Mercado Pago charge currency (`MERCADOPAGO_CURRENCY`).
