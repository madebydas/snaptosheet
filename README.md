# SnapToSheet

Turn photos of tables into editable spreadsheets. Upload an image of any table, menu, receipt, or schedule and SnapToSheet uses GPT-4o vision to extract the data into a spreadsheet you can edit and download.

## Features

- **AI-Powered Extraction** — GPT-4o vision reads your images and extracts structured table data
- **Inline Editing** — Review and edit extracted data directly in the browser
- **CSV & Excel Export** — Download as CSV or XLSX files
- **Free & Pro Plans** — 5 free conversions/month, unlimited with Pro ($9/month)
- **Conversion History** — Access all past conversions from your dashboard
- **Secure** — Supabase RLS ensures user data isolation

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Auth:** Supabase Auth (Google OAuth + email/password)
- **Database:** Supabase (PostgreSQL with RLS)
- **Payments:** Stripe (checkout sessions + webhooks)
- **AI:** OpenAI GPT-4o vision API
- **Backend:** Supabase Edge Functions

## Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account
- An [OpenAI](https://platform.openai.com) API key

### 1. Clone and install

```bash
git clone https://github.com/madebydas/snaptosheet.git
cd snaptosheet
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in your Supabase URL, anon key, Stripe publishable key, and Stripe price ID.

### 3. Run the database migration

Apply `supabase/migrations/001_initial_schema.sql` to your Supabase project via the SQL editor or Supabase CLI.

### 4. Deploy edge functions

```bash
supabase functions deploy convert
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

Set the required secrets:

```bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set STRIPE_PRICE_ID_PRO=price_...
supabase secrets set SITE_URL=https://your-domain.com
```

### 5. Start development server

```bash
npm run dev
```

### 6. Configure Stripe webhook

Point your Stripe webhook endpoint to:
```
https://<your-supabase-project>.supabase.co/functions/v1/stripe-webhook
```

Events to listen for:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

## Project Structure

```
src/
├── components/     # Reusable UI and feature components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── lib/            # Supabase client, Stripe helpers, constants
├── pages/          # Route-level page components
└── types/          # TypeScript type definitions

supabase/
├── migrations/     # Database schema and RLS policies
└── functions/      # Edge functions (convert, checkout, webhook)
```

## License

MIT
