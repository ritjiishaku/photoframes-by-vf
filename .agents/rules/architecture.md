# architecture.md
# Photoframes by VF — Architecture Rules
# Source: AGENTS.md + PRD v2.0 Sections 1–8, 13–18
# Read this before touching any file in the project.

---

## 1. STACK — FINAL. DO NOT DEVIATE.

| Layer          | Technology                              | Notes                                              |
|----------------|-----------------------------------------|----------------------------------------------------|
| Frontend       | Next.js 14 — App Router                 | No Pages Router. No mixing routing paradigms.      |
| Styling        | Tailwind CSS                            | Utility classes only. No CSS Modules. No styled-components. |
| CMS            | Sanity.io                               | Content fetched via GROQ. ISR for product pages.   |
| Database       | PostgreSQL                              | Analytics events + admin change log only.          |
| Backend        | Node.js + Express (or Next.js API routes) | Developer chooses based on complexity.           |
| Hosting        | Vercel                                  | Frontend + serverless functions.                   |
| DB Host        | Supabase or Railway PostgreSQL          | $0/month free tier required.                       |
| CDN            | Vercel Edge Network                     | Built-in. No additional CDN needed.                |

**Cost constraint: $0/month across all services on free tiers.**
Flag any package or service that requires a paid plan before adding it.

**Forbidden technologies (never add, never suggest):**
- WordPress, Wix, Webflow, Squarespace
- CSS Modules, styled-components, Emotion, SASS
- Redux, MobX (React state only — useState, useReducer, Context)
- Any payment SDK (Stripe, Paystack, Flutterwave) — v2.0 only
- Firebase, Supabase Auth, NextAuth, Clerk (no auth in v1.0)

---

## 2. NEXT.JS 14 — APP ROUTER CONVENTIONS

### Routing structure
```
app/
├── layout.tsx                    ← root layout — FloatingWhatsApp lives here ONLY
├── page.tsx                      ← homepage
├── products/
│   ├── page.tsx                  ← full product gallery
│   └── [slug]/
│       └── page.tsx              ← product detail (ISR)
├── categories/
│   └── [slug]/
│       └── page.tsx              ← category-filtered gallery (ISR)
├── about/
│   └── page.tsx
├── testimonials/
│   └── page.tsx
└── api/
    ├── analytics/
    │   └── route.ts              ← POST only
    └── webhooks/
        └── sanity/
            └── route.ts          ← POST only — Sanity webhook receiver
```

### Data fetching rules
- **Product pages** → `generateStaticParams` + ISR (`revalidate: 3600`)
- **Homepage** → ISR (`revalidate: 1800`)
- **Testimonials** → ISR (`revalidate: 3600`)
- **Site settings (WhatsApp number, hero content)** → fetched at build time; revalidated via Sanity webhook
- Never use `'use client'` on page-level components — push interactivity down to leaf components only

### Metadata — required on every page
```typescript
// Every page must export metadata or generateMetadata
export const metadata: Metadata = {
  title: 'Page Title | Photoframes by VF',
  description: '...',
  openGraph: {
    title: '...',
    description: '...',
    images: [{ url: '...' }],
    siteName: 'Photoframes by VF',
  },
};
```

---

## 3. NIGERIAN STANDARDS — NON-NEGOTIABLE

These apply everywhere in the codebase. No exceptions.

| Standard       | Rule                                                                 |
|----------------|----------------------------------------------------------------------|
| Currency       | Always `₦XX,XXX` — use `formatNaira()` from `lib/format.ts` only   |
| Phone number   | Always `+234XXXXXXXXXX` — validate with `isValidNigerianPhone()`    |
| Date format    | Always `DD/MM/YYYY` — use `formatDate()` from `lib/format.ts` only  |
| Price storage  | Always a plain `number` in Sanity and PostgreSQL — NEVER a string   |
| WhatsApp links | Always via `buildWhatsAppUrl()` from `lib/whatsapp.ts` — never inline |

### `lib/format.ts` — single source of truth for all formatting
```typescript
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day   = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()}`;
}

export function isValidNigerianPhone(phone: string): boolean {
  return /^\+234\d{10}$/.test(phone);
}
```

---

## 4. ENVIRONMENT VARIABLES

All variables defined in `.env.example`. Never hardcode. Never expose server-only vars with `NEXT_PUBLIC_`.

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=       # public — used in client + server
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                    # server only — webhook write access

# WhatsApp — synced from Sanity siteSettings during build/revalidation
NEXT_PUBLIC_WHATSAPP_NUMBER=         # +234XXXXXXXXXX — no spaces, no dashes

# PostgreSQL
DATABASE_URL=                        # postgres://user:pass@host:5432/dbname

# Vercel (auto-injected)
VERCEL_URL=
```

**Rules:**
- `.env.local` must be in `.gitignore` — check before every commit
- `.env.example` must be committed and kept up to date
- If a variable is missing at runtime, throw a descriptive error immediately — not a silent `undefined`

---

## 5. API ROUTES

### `POST /api/analytics`
Receives analytics events from the client and writes to PostgreSQL.

```typescript
// app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Validate event_type is a known value
  // Write to analytics_events table via lib/db/queries.ts
  // Return 200 on success, 400 on invalid event, 500 on DB error
}

// Only POST is allowed — reject GET, PUT, DELETE with 405
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
```

**Accepted event types** (from PRD Section 13):
`whatsapp_click` | `product_view` | `category_click` | `hero_cta` | `instagram_click` | `scroll_depth`

Reject any event_type not in this list with a 400 response.

### `POST /api/webhooks/sanity`
Receives content update notifications from Sanity and triggers ISR revalidation.

```typescript
// app/api/webhooks/sanity/route.ts
// Validate Sanity webhook secret header before processing
// Call Next.js revalidatePath() or revalidateTag() for affected pages
// Log the revalidation to admin_change_log in PostgreSQL
// Return 200 immediately — do not block on revalidation
```

---

## 6. POSTGRESQL TABLES

Both tables must exist before the app goes live. Create via migration script at `db/migrations/001_initial.sql`.

```sql
-- Analytics events — PRD Section 13
CREATE TABLE analytics_events (
  id             SERIAL PRIMARY KEY,
  event_type     VARCHAR(64)  NOT NULL
                 CHECK (event_type IN (
                   'whatsapp_click','product_view','category_click',
                   'hero_cta','instagram_click','scroll_depth'
                 )),
  product_slug   VARCHAR(255),
  category_slug  VARCHAR(255),
  inquiry_type   VARCHAR(32)
                 CHECK (inquiry_type IN (
                   'product_specific','general','custom_order','corporate', NULL
                 )),
  traffic_source VARCHAR(64),
  scroll_depth   SMALLINT     CHECK (scroll_depth IN (25, 50, 75, 100)),
  session_id     VARCHAR(64),
  user_agent     TEXT,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_product    ON analytics_events(product_slug)
  WHERE product_slug IS NOT NULL;

-- Admin change log — PRD Section 16
CREATE TABLE admin_change_log (
  id          SERIAL PRIMARY KEY,
  section     VARCHAR(64)  NOT NULL
              CHECK (section IN (
                'hero','product','category','testimonial',
                'contact_info','about','seo'
              )),
  field_name  VARCHAR(128),
  changed_by  VARCHAR(64)  DEFAULT 'admin',
  changed_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  note        TEXT
);

CREATE INDEX idx_change_log_section    ON admin_change_log(section);
CREATE INDEX idx_change_log_changed_at ON admin_change_log(changed_at);
```

**Database query rules:**
- All SQL lives in `lib/db/queries.ts` — no inline SQL anywhere else
- Use parameterised queries always — never string interpolation in SQL
- Wrap every DB call in try/catch — never let a DB error reach the user as a 500 with stack trace

---

## 7. SANITY — CONTENT ARCHITECTURE

### GROQ query rules
- All GROQ queries live in `lib/sanity/queries.ts` — no inline GROQ in components or pages
- Always project only the fields you need — never fetch `*` in production
- Use `coalesce()` for optional fields to avoid null propagation

### ISR + Sanity webhook flow
```
Admin updates product in Sanity Studio
  → Sanity fires webhook to /api/webhooks/sanity
    → Route validates webhook secret
      → revalidatePath('/products') + revalidatePath(`/products/${slug}`)
        → Next.js regenerates static pages
          → Users see updated content within seconds
```

### Singleton document — siteSettings
The `siteSettings` document type must be a singleton. Sanity Studio must be configured
to show it as a single item in the sidebar (not a list). The WhatsApp number lives here
and ONLY here. After any siteSettings update, the Sanity webhook must trigger a full
site revalidation so the new number propagates to all CTA links.

---

## 8. COMPONENT ARCHITECTURE

```
components/
├── layout/
│   ├── FloatingWhatsApp.tsx     ← in root layout only — never instantiated elsewhere
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── product/
│   ├── ProductGrid.tsx          ← masonry/Pinterest grid container
│   ├── ProductCard.tsx          ← individual tile (image, name, ₦price, tag)
│   ├── ProductDetail.tsx        ← full product view
│   └── CategoryFilter.tsx       ← tab/filter bar
├── home/
│   ├── Hero.tsx
│   ├── FeaturedCategories.tsx
│   └── TestimonialsPreview.tsx
└── ui/
    ├── WhatsAppButton.tsx       ← reusable inline CTA — NOT the float
    ├── StarRating.tsx
    ├── ImageWithFallback.tsx    ← broken image → /public/fallback-product.jpg
    └── PriceTag.tsx             ← always calls formatNaira()
```

**Rules:**
- `FloatingWhatsApp.tsx` renders once in `app/layout.tsx` — never import it into individual pages
- `PriceTag.tsx` is the only component allowed to render a price — no ad-hoc `₦` in JSX
- `WhatsAppButton.tsx` calls `buildWhatsAppUrl()` internally — never accepts a raw URL as a prop
- `ImageWithFallback.tsx` wraps Next.js `<Image>` and catches `onError` — always provide `alt` prop

---

## 9. SCALABILITY CONSTRAINTS (PRD Section 18)

These decisions in v1.0 prevent a full rebuild in v2.0:

| Future feature            | v1.0 constraint enforced now                                    |
|---------------------------|-----------------------------------------------------------------|
| Paystack payments         | `price` is always `number` — never stored or passed as string  |
| Order management          | `analytics_events` has `product_slug` — extensible to order_id |
| WhatsApp Business API     | Number in ONE place (Sanity siteSettings) only                  |
| Multi-language            | All display strings from Sanity or `lib/constants.ts` only      |
| Customer accounts         | No auth assumptions in middleware or route guards               |
| Public review submission  | Testimonial `isVisible: false` default — approval flow addable  |

---

## 10. PERFORMANCE GATES

No task is complete until these pass:

| Metric            | Gate                                          |
|-------------------|-----------------------------------------------|
| Lighthouse mobile | ≥ 85 overall                                  |
| LCP               | < 2.5s on throttled Fast 3G (Chrome DevTools) |
| INP               | < 100ms                                       |
| CLS               | < 0.1                                         |
| Hero image        | `priority={true}` on Next.js `<Image>`        |
| Below-fold images | `loading="lazy"` or `priority={false}`        |
| Fonts             | `next/font` only — zero external font requests|
| Render-blocking   | Zero render-blocking scripts on initial load  |
