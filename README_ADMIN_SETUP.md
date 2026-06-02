# Admin Authentication Setup

This guide explains how to set up admin users for the ApexFled digital account store.

## Overview

Admin authentication uses **Supabase Auth** for login and the **admin_users** table for authorization.

### How It Works

1. **Admin Login** (`/admin/login`):
   - Admin enters email and password
   - Supabase Auth validates the credentials
   - On success, the app checks the `admin_users` table
   - If the user's email exists with `role = 'admin'`, they gain access
   - If not authorized, they are signed out with an error message

2. **Protected Routes**:
   - `/admin/dashboard`
   - `/admin/products`
   - `/admin/orders`
   - `/admin/tickets`
   - `/admin/reviews`
   - All admin API routes (`/api/admin/*`)

3. **Logout**:
   - Click the user profile menu in the admin header
   - Click "Logout Session"
   - Signed out of Supabase Auth and redirected to `/admin/login`

---

## Creating the First Admin User

### Step 1: Create Auth User in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Users**
4. Click **Add User** (or invite user)
5. Enter:
   - **Email**: `admin@apexfled.com` (or your admin email)
   - **Password**: A strong password (min 6 characters)
6. Click **Create User**

**Note**: You can also use the Supabase CLI:
```bash
supabase auth admin create-user --email admin@apexfled.com --password "SecurePassword123"
```

### Step 2: Add to admin_users Table

In the Supabase dashboard:

1. Go to the **SQL Editor**
2. Run this query:
```sql
INSERT INTO admin_users (email, role)
VALUES ('admin@apexfled.com', 'admin');
```

Or use the **Table Editor**:

1. Go to **Tables** → `admin_users`
2. Click **Insert Row**
3. Fill in:
   - `email`: `admin@apexfled.com`
   - `role`: `admin`
   - `id` and `created_at` auto-populate
4. Click **Save**

### Step 3: Test Login

1. Go to `/admin/login`
2. Enter:
   - **Email**: `admin@apexfled.com`
   - **Password**: The password you set in Supabase Auth
3. If login succeeds, you'll be redirected to `/admin/dashboard`

---

## Managing Admin Users

### View All Admins

In Supabase Table Editor:

1. Go to **Tables** → `admin_users`
2. See all admins with `role = 'admin'`

### Add Another Admin

Run in SQL Editor:
```sql
INSERT INTO admin_users (email, role)
VALUES ('newadmin@example.com', 'admin');
```

Then create the Supabase Auth user as in Step 1 above.

### Remove Admin Access

To revoke admin access without deleting the user:

```sql
DELETE FROM admin_users WHERE email = 'admin@apexfled.com';
```

(This removes their admin_users record but keeps their Supabase Auth account.)

### Delete Admin Completely

To fully delete an admin user:

1. Delete from `admin_users` table
2. Go to Supabase **Authentication** → **Users**
3. Find the user and click **Delete**

---

## Testing Protected Routes

### Verify Login Page Works

```bash
npm run dev
# Navigate to http://localhost:3000/admin/login
# Should NOT redirect (login page is public)
```

### Verify Protected Pages Redirect

1. Without logging in, try to visit `/admin/dashboard`
2. Should redirect to `/admin/login`

### Verify Logout Works

1. Login as admin
2. Click the user profile menu in the top-right
3. Click "Logout Session"
4. Should redirect to `/admin/login`
5. Try to visit `/admin/dashboard` → should redirect to login again

### Verify API Protection

Test the protected API routes:

```bash
# Without auth, should return 401
curl http://localhost:3000/api/admin/products/1

# With auth (from browser logged in), should work
# The browser's Supabase session will be sent automatically
```

---

## Security Notes

### Before Going Live

1. **Change Default Credentials**:
   - Do not use `admin@apexfled.com` / `password123` in production
   - Create admin accounts with strong passwords
   - Supabase enforces minimum 6-character passwords; use much longer ones

2. **Enable Email Verification** (Optional but Recommended):
   - In Supabase **Authentication** → **Policies**
   - Enable "Confirm email before signing in"
   - Users must verify their email address before gaining access

3. **Enable Multi-Factor Authentication** (Optional but Recommended):
   - Supabase Auth supports MFA via TOTP
   - Consider enabling for admin accounts

4. **Monitor Admin Activity**:
   - Check Supabase Auth logs regularly
   - Monitor `admin_users` table for unexpected entries

5. **Secure Your Supabase Keys**:
   - Never commit `.env.local` (it's in .gitignore)
   - Never share `SUPABASE_SERVICE_ROLE_KEY`
   - Rotate keys periodically

### Session Expiration

- Supabase Auth sessions expire after **1 week** by default
- Admins must log back in if their session expires
- You can customize session duration in Supabase **Authentication** → **Providers**

### Rate Limiting

- Supabase Auth has built-in rate limiting on login attempts
- Excessive failed logins will temporarily block the IP
- This is automatic; no configuration needed

---

## Troubleshooting

### "Invalid email or password" on Login

**Causes**:
- Email doesn't exist in Supabase Auth
- Password is incorrect
- User was recently deleted

**Fix**:
- Verify the email exists: Supabase **Authentication** → **Users**
- Reset password: Click the user, then **Regenerate Password**
- Re-add the user if deleted

### "You are not authorized as an admin" on Login

**Causes**:
- Email exists in Supabase Auth but NOT in `admin_users` table
- User has a different role (e.g., `'support'` instead of `'admin'`)

**Fix**:
- Add the email to `admin_users` table with `role = 'admin'`
- SQL: `INSERT INTO admin_users (email, role) VALUES ('user@example.com', 'admin');`

### Admin Pages Redirect to Login on Every Refresh

**Causes**:
- Supabase session is not persisting
- Browser cookies are disabled
- Supabase keys are incorrect

**Fix**:
- Check browser cookies are enabled
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct in `.env.local`
- Try logging in again in a private/incognito window
- Check browser console for errors

### "Unauthorized" on Admin API Calls

**Causes**:
- Admin is not logged in
- Session cookie was not sent with the request
- CORS issue (for API calls from external domain)

**Fix**:
- Ensure you're logged in: visit `/admin/dashboard` first
- API calls from the same domain will auto-include session cookies
- If calling from a different domain, configure CORS in Supabase

---

## Local Development

### Disable Auth for Faster Development (Optional)

If you want to skip auth during development, you can temporarily modify `/lib/adminAuth.ts`:

```typescript
// For dev only — remove before production!
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_ADMIN_AUTH === 'true') {
    return { id: 'dev', email: 'dev@example.com', role: 'admin', createdAt: new Date().toISOString() };
  }
  // ... rest of the function
}
```

Then set in `.env.local`:
```
SKIP_ADMIN_AUTH=true
```

**⚠️ WARNING**: Only do this locally. Never enable in production.

---

## Production Deployment

### On Vercel

1. Set environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Create admin users in production Supabase:
   - Same steps as above
   - Use a fresh password (not the dev password)

3. Test login on deployed site:
   - Visit `https://yourdomain.com/admin/login`
   - Verify you can log in with production credentials

### Monitoring

- Monitor Supabase Auth logs for failed login attempts
- Check `admin_users` table for unauthorized entries
- Set up Supabase alerts for security events

---

## Common Questions

**Q: Can I use a different email provider?**  
A: Currently, Supabase Auth is required. You can configure OAuth (Google, GitHub, etc.) in Supabase, but admin verification still requires the `admin_users` table.

**Q: What if I forget the admin password?**  
A: In Supabase, go to **Authentication** → **Users**, find the admin, and click **Regenerate Password**.

**Q: Can multiple people be admins?**  
A: Yes! Add multiple emails to the `admin_users` table, and create Supabase Auth accounts for each.

**Q: Is admin login encrypted?**  
A: Yes. Supabase Auth uses industry-standard encryption (bcrypt for passwords, HTTPS for transmission).

**Q: What happens if someone gains access to admin_users table?**  
A: Keep `SUPABASE_SERVICE_ROLE_KEY` secret. Only backend code should have it. The public anon key cannot write to `admin_users` due to Row Level Security policies.

---

## Getting Help

- Check Supabase docs: https://supabase.com/docs/guides/auth
- Review code: `/lib/adminAuth.ts` and `/components/admin/AdminProtected.tsx`
- Check logs: Supabase **Authentication** → **Logs**

