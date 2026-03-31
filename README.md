# imgtosheet

Turn photos of tables into editable spreadsheets. Upload an image of any table, menu, receipt, or schedule and imgtosheet uses AI vision to extract the data into a spreadsheet you can edit and download.

## Features

- **AI-Powered Extraction** — AI vision reads your images and extracts structured table data
- **Inline Editing** — Review and edit extracted data directly in the browser
- **CSV & Excel Export** — Download as CSV or XLSX files
- **Free & Paid Plans** — 5 free conversions/month, upgrade for more
- **Conversion History** — Access all past conversions from your dashboard
- **Secure** — Supabase RLS ensures user data isolation

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Auth:** Supabase Auth (Google OAuth + email/password)
- **Database:** Supabase (PostgreSQL with RLS)
- **Payments:** Stripe (checkout sessions + webhooks)
- **AI:** Anthropic Claude API (vision)
- **Backend:** Netlify Functions

## Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account
- An [Anthropic](https://console.anthropic.com) API key

### 1. Clone and install

```bash
git clone https://github.com/madebydas/imgtosheet.git
cd imgtosheet
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in your Supabase URL, anon key, Stripe keys, and price IDs.

### 3. Run the database migration

Apply `supabase/migrations/001_initial_schema.sql` and `002_plan_tiers.sql` to your Supabase project via the SQL editor.

### 4. Start development server

```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable UI and feature components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── lib/            # Supabase client, Stripe helpers, constants
├── pages/          # Route-level page components
└── types/          # TypeScript type definitions

netlify/
└── functions/      # Serverless functions (convert, checkout, webhook)

supabase/
├── migrations/     # Database schema and RLS policies
└── functions/      # Legacy edge functions (replaced by Netlify functions)
```

## License

MIT
