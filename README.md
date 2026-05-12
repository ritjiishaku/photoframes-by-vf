# Photoframes by VF

Premium custom acrylic photo frames and non-tarnish gold-layered jewellery e-commerce site built with Next.js.

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **CMS:** Google Sheets (via Google Sheets API + JWT auth)
- **Database:** PostgreSQL (optional — analytics events only)
- **Styling:** Tailwind CSS + design tokens
- **Fonts:** Cormorant Garamond (headings), Playfair Display (accent), DM Sans (body)
- **Image serving:** Google Drive (via thumbnail API)
- **Animation:** Custom IntersectionObserver-based FadeIn system

## Design System

The project uses a semantic token-based design system:
- **Tokens:** Managed via `token-colour.json` and generated into `styles/tokens.css` via `npm run generate-tokens`.
- **Accessibility:** Specifically tuned for WCAG AA compliance with high-contrast foreground roles on metallic background tokens.
- **Tone:** A curated "Founders' Premium" palette featuring Espresso, Gold Lustre, and Muted Ivory.

## Features

- Product catalogue with categories (Custom Frames / Gold Jewellery)
- **CMS:** Google Sheets — manage products, categories, testimonials, hero, and site settings
- **WhatsApp-based ordering:** Direct product-specific inquiries with context tracking
- **Motion Design:** High-performance, scroll-triggered animations via `IntersectionObserver`
- **Accessibility:** WCAG AA contrast compliance (Deep Espresso on Gold) and reduced motion support
- **Premium UX:** Founders-led brand voice, sticky mobile CTAs, and sophisticated design tokens
- **Social Integration:** Web Share API integration for effortless product sharing
- **SEO:** sitemap, robots.txt, Open Graph, JSON-LD product schema
- **Analytics tracking:** Granular event tracking for user journey analysis
- **Security:** HSTS, Content Security Policy, and robust header headers

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud service account with Sheets API enabled
- (Optional) PostgreSQL instance for analytics

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
GOOGLE_SHEET_ID=               # ID from your Sheet URL
GOOGLE_SERVICE_ACCOUNT_EMAIL=  # e.g. your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=            # Private key (multi-line, wrap in quotes)
NEXT_PUBLIC_WHATSAPP_NUMBER=   # Format: +234XXXXXXXXXX
DATABASE_URL=                  # Optional — postgres://user:pass@host:5432/dbname
```

### Google Sheet Structure

The sheet needs tabs named: `Products`, `Categories`, `Testimonials`, `Site_Settings`. Each tab's first row is the header.

### Install & Run

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/              # Next.js App Router pages & API routes
├── components/       # React components (home, layout, product, ui)
├── lib/              # Shared logic (sheets, db, analytics, whatsapp)
├── db/               # PostgreSQL migrations
├── public/           # Static assets
├── scripts/          # Seed & utility scripts
└── styles/           # Design tokens & globals
```

## Deployment

Deploy on Vercel. Environment variables are synced from the `Site_Settings` sheet at build time. ISR revalidation is set to 1800s (30 min).
