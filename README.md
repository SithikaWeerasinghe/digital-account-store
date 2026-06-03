This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Email (Resend)

Transactional emails are sent via [Resend](https://resend.com). Email is **activated by
environment variables only** — no code change is needed. If `RESEND_API_KEY` is missing,
the app keeps working and email sending is safely skipped (logged in dev).

Required variables (see `.env.example`):

```env
RESEND_API_KEY=            # Resend API key (server-side secret — never commit it)
RESEND_FROM_EMAIL=ApexFled <onboarding@resend.dev>   # verified "from" address
ADMIN_NOTIFICATION_EMAIL=  # where new-order admin notifications are sent (optional)
SUPPORT_EMAIL=support@apexfled.com   # shown in email footers
NEXT_PUBLIC_SITE_URL=      # used for links/buttons in emails
```

> **Naming note:** this project uses `RESEND_FROM_EMAIL` (not `FROM_EMAIL`). Set the
> "from" address there. Until you verify a custom domain in Resend, keep the default
> `onboarding@resend.dev`.

**Active email events**

| Event | Recipient | Trigger |
|-------|-----------|---------|
| Order confirmation | Customer | On order creation (`POST /api/orders`) |
| New order notification | Admin (`ADMIN_NOTIFICATION_EMAIL`) | On order creation |
| Payment confirmation | Customer | Mercado Pago webhook marks order **paid** |
| Paid order notification | Admin | Mercado Pago webhook marks order **paid** |
| Resend confirmation | Customer | Admin clicks **Resend Email** (admin-protected) |

See **[README_EMAIL_SETUP.md](README_EMAIL_SETUP.md)** for local testing and Vercel setup.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
