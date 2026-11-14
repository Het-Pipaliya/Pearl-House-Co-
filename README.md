# Pearl House & Co — Fine Jewelry

Inquiry-based luxury jewelry website (Next.js 14 · React · TypeScript · Tailwind). Customers browse, customize, fill a cart and **submit an order request — there is no online payment of any kind.** Requests are saved to a database, emailed to the business, and acknowledged to the customer. An admin dashboard manages products and inquiries.

## Run locally (2 minutes)

```bash
npm install
cp .env.example .env.local      # then set ADMIN_PASSWORD and ADMIN_SESSION_SECRET
npm run dev                     # http://localhost:3000   ·   admin: /admin
```

With no Supabase/Resend credentials, the site still runs: inquiries are stored in `.data/db.json` (dev only) and **no emails are sent** — the admin dashboard shows a red notice and each inquiry records `not_configured` for both emails.

## What you must configure

| Service | Purpose | Variables | Required for |
|---|---|---|---|
| Admin login | Protects `/admin` | `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (`openssl rand -base64 32`) | Admin access (login is disabled until set) |
| Supabase | Database + image storage | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | **Production** (hosts like Vercel have no persistent disk) |
| Resend | Transactional email | `RESEND_API_KEY`, `BUSINESS_EMAIL`, `EMAIL_FROM` | Business notification + customer acknowledgment |

### Supabase setup
1. Create a project at supabase.com → SQL Editor → run `supabase/schema.sql` (creates tables, enables RLS, creates the `products` public and `references` private storage buckets).
2. Project Settings → API: copy the URL and the **service_role** key into your environment. The key is only used server-side; never put it in `NEXT_PUBLIC_*` variables.

### Email setup (Resend)
1. Create a Resend account, create an API key → `RESEND_API_KEY`.
2. Set `BUSINESS_EMAIL` to the inbox that should receive inquiries.
3. Verify your sending domain in Resend and set `EMAIL_FROM="Pearl House & Co <orders@yourdomain.com>"`. The default `onboarding@resend.dev` sender only delivers to your own Resend account address and is for testing.
4. Submit a test order and confirm both emails arrive. Subject line: `New Jewelry Order Request — Pearl House & Co — #<reference>`.

If an email fails, the inquiry is **still saved** (the customer's request is never lost) and the failure reason is stored on the inquiry and shown in admin.

## Your logo
`public/logo.png` is your rose-gold logo (downsized to 900px). To replace it, overwrite that file, or change `logo` in `src/lib/site.ts`. If the file fails to load, a text wordmark is shown.

## Business details to replace
Edit `src/lib/site.ts`: email, phone, hours, social links (all placeholders now; no address is invented). Policy pages (`/privacy`, `/terms`, `/shipping`, `/custom-order-policy`) are **templates** with `[bracketed]` blanks — have them reviewed for your jurisdiction.

## Products & imagery
The 8 sample products and all artwork in `public/placeholders` are illustrative placeholders (flagged "sample" on the site). In `/admin → Products` add real products with photography and delete or edit the samples. Only the metals/sizes/gemstones you configure for a product are shown to customers.

## Admin
`/admin` → sign in. Inquiries tab: search, filter by status/type, change status (9 statuses), internal notes, view customer details and uploaded reference images (private), export CSV. Products tab: add/edit/delete, upload images, set price/visibility, availability. Messages tab: contact-form messages.

## Security & spam protection (what's implemented)
- All writes go through server API routes; secrets never reach the browser. Admin pages and `/api/admin/*` are guarded by middleware using an HMAC-signed, expiring, httpOnly, SameSite=Strict cookie.
- Zod validation on every endpoint. The server rebuilds each order line from the catalogue (names, available options, availability) instead of trusting the browser.
- Spam: hidden honeypot field, minimum-time-to-submit check, per-IP rate limits (orders, custom, contact, admin login). Uploads are verified by file signature (JPG/PNG/WebP, ≤5 MB); customer reference images are stored privately.
- CSV export neutralises spreadsheet-formula injection. Security headers set in `next.config.mjs`.
- **Known limit:** the rate limiter is in-memory per server instance. On serverless hosting, upgrade to a shared store (e.g. Upstash Redis) or add Cloudflare Turnstile for stronger bot defence.
- Single shared admin password. For multiple staff, move to Supabase Auth.

## Deploy (Vercel)
1. Push to GitHub, import the repo in Vercel.
2. Add all variables from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to your domain).
3. Deploy, open `/admin`, and submit a test order to verify database + both emails.
Any Node host works too: `npm run build && npm start`.

## Scripts
`npm run dev` · `npm run build` · `npm run start` · `npm run typecheck` · `npm run placeholders` (regenerate sample artwork)
