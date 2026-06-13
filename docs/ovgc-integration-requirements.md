# OVGC Payments — Integration Notes

Status: **IMPLEMENTED (pending live verification).** The create-payment call and
webhook are wired to the documented OVGC API. Card payments use OVGC only when
`CARD_PAYMENT_PROVIDER=ovgc`; otherwise Mercado Pago is used (default). A few
response/payload field names are not fully documented, so the code reads them
defensively (see "Remaining unknowns").

## Known details (from the OVGC dashboard)

### Create payment request
- **Endpoint:** `POST https://billing.ovgcpayments.com/backend/api/payment-request-api`
  (configurable via `OVGC_PAYMENT_ENDPOINT`).
- **Auth:** `api_key` is sent in the **JSON body** (not a header).
- **Request body we send:**
  ```json
  {
    "api_key": "<OVGC_API_KEY>",
    "order_uuid": "<our checkout reference>",
    "total_amount": 25.00,
    "email": "customer@example.com",
    "success_url": "https://www.apexfled.com/checkout/success?order_id=<ref>",
    "cancel_url": "https://www.apexfled.com/checkout/cancel",
    "product_title": "<order summary>"
  }
  ```
  Optional: `first_name`, `last_name`.
- **Response:** returns a **hosted checkout URL** to redirect the customer to.
  We read the URL from any of: `checkout_url`, `payment_url`, `redirect_url`, `url`
  (also nested under `data`). We read the id from any of: `transaction_id`,
  `payment_id`, `id`.

### Payment statuses
- `Pending` — request created, not completed → order stays pending.
- `Paid` — captured → mark paid + fulfill.
- `Declined` — gateway declined → failed, no delivery.
- `Expired` — 30-min window elapsed → failed, no delivery.

### Order status check (admin verification only)
- `GET https://billing.ovgcpayments.com/backend/api/order-status/{transaction_id}`
- Header: `x-api-key: <OVGC_API_KEY>`
- Implemented as `getOvgcPaymentStatus()`; **not** used for delivery decisions.

### Webhook
- Endpoint registered in OVGC dashboard: `https://www.apexfled.com/api/webhooks/ovgc`
- The signing secret is sent **in the payload** as `webhook_secret`; we compare it
  (constant-time) to `OVGC_WEBHOOK_SECRET` and reject (401) on mismatch.

## Remaining unknowns (handled defensively; lock down when docs confirm)
- **Exact create-payment response shape** — which field holds the checkout URL and id.
- **Exact webhook payload shape** — which fields hold the order reference
  (`order_uuid` / `checkout_reference` / `order_id` / `reference`), the payment id
  (`transaction_id` / `payment_id` / `id`), and the status (`payment_status` / `status`).
- **Whether the webhook has additional signing** beyond the `webhook_secret` field
  (e.g. an HMAC header). If so, add that verification in `verifyOvgcWebhookSecret`'s caller.

## Env vars (set in Vercel — server-side only, never NEXT_PUBLIC)
```
CARD_PAYMENT_PROVIDER=ovgc            # switch card payments to OVGC
OVGC_API_KEY=<secret>
OVGC_WEBHOOK_SECRET=<secret>
OVGC_BASE_URL=https://billing.ovgcpayments.com/backend/api
OVGC_PAYMENT_ENDPOINT=https://billing.ovgcpayments.com/backend/api/payment-request-api
OVGC_SUCCESS_URL=https://www.apexfled.com/checkout/success
OVGC_CANCEL_URL=https://www.apexfled.com/checkout/cancel
OVGC_WEBHOOK_URL=https://www.apexfled.com/api/webhooks/ovgc
OVGC_CURRENCY=EUR
```

## Safety guarantees (enforced in code)
- Hosted checkout only — **no raw card details** are collected or stored.
- `OVGC_API_KEY` / `OVGC_WEBHOOK_SECRET` are server-side only.
- An order is marked **paid** and delivered **only** from a webhook with a verified
  `webhook_secret` and a `Paid` status. Declined/Expired never deliver. Duplicate
  webhooks never re-deliver or re-email (idempotent).
