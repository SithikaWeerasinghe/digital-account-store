# OVGC Payments — Integration Requirements

Status: **SCAFFOLD ONLY.** The structure, provider switch, routes, and admin
display exist, but OVGC card payments are **not implemented** and are safely
disabled. Card payments continue to use **Mercado Pago** until this is finished.

To complete the integration we need the following from OVGC
(https://ovgcpayments.com). Please obtain the official API documentation +
sandbox/live credentials and provide these details.

## 1. Account / credentials
- [ ] **API key** (server-side secret) → `OVGC_API_KEY`
- [ ] **Webhook/IPN secret** → `OVGC_WEBHOOK_SECRET`
- [ ] **API base URL** (sandbox + production) → `OVGC_BASE_URL`
- [ ] Confirm **supported currencies** (we display/charge **EUR** → `OVGC_CURRENCY`)

## 2. API authentication
- [ ] How is the API key sent? e.g. `Authorization: Bearer <key>` or `x-api-key: <key>` (exact header name/format).

## 3. Create hosted checkout (redirect) — **required**
We will ONLY use a hosted/redirect checkout. **We will not collect raw card
details** (PCI scope). If OVGC has no hosted page, tell us — we'll stop and reassess.
- [ ] **Endpoint path** + HTTP method to create a checkout/payment session.
- [ ] **Request body** fields and an example (amount, currency, order reference,
      customer email, success URL, cancel URL, webhook/callback URL).
- [ ] **Response body** example, including the **hosted redirect URL** and a
      **payment/session id** we can store.

Environment URLs already prepared:
- `OVGC_SUCCESS_URL=https://www.apexfled.com/checkout/success`
- `OVGC_CANCEL_URL=https://www.apexfled.com/checkout/cancel`
- `OVGC_WEBHOOK_URL=https://www.apexfled.com/api/webhooks/ovgc`

## 4. Webhook / IPN
- [ ] Where to register the webhook URL in the OVGC dashboard.
- [ ] **Webhook payload** example (which field carries our order reference + the payment id).
- [ ] **Signature header name** and **algorithm** (e.g. HMAC-SHA256 over the raw
      body, hex or base64) so we can verify authenticity before marking paid.

## 5. Status values
- [ ] Status string(s) that mean **paid/completed** (trigger delivery).
- [ ] Status string(s) that mean **failed / declined / expired / cancelled** (no delivery).
- [ ] Status string(s) that mean **refunded**, if supported.

## Where to fill these in (code)
- `lib/services/ovgcPaymentService.ts`
  - `createOvgcCheckout()` — TODO: real hosted-checkout call + extract redirect URL & id.
  - `verifyOvgcSignature()` — TODO: real signature verification.
  - `mapOvgcStatus()` — TODO: map real status values.
- `app/api/webhooks/ovgc/route.ts` — TODO: on verified `paid`, reuse the same
  idempotent paid→deliver pipeline used by NOWPayments.
- Switch on with `CARD_PAYMENT_PROVIDER=ovgc` (only after the above is done).

## Hard rules (already enforced by the scaffold)
- Server-side only; **no** `NEXT_PUBLIC_OVGC_*` and the API key never reaches the browser.
- **No raw card collection** — hosted checkout only.
- **No order is marked paid** without a verified OVGC webhook signature.
- While unconfigured/unimplemented, card checkout shows: *"Card payment is
  temporarily unavailable. Please choose another payment method."*
