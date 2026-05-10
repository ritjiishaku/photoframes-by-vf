# AGENTS.md — Photoframes by VF
# AI Agent Context File for Google Antigravity
# Version: 1.0 | Last Updated: 09/05/2025
# Aligned with: PRD v2.0 (Sections 1–18)

---

## 1. PROJECT IDENTITY

| Field            | Value                                                  |
|------------------|--------------------------------------------------------|
| Project          | Photoframes by VF — Web Application                   |
| Client           | Fechi Godwin                                           |
| Country          | Nigeria                                                |
| Currency         | Nigerian Naira — always formatted as ₦XX,XXX           |
| Phone format     | +234XXXXXXXXXX (Nigerian standard)                     |
| Date format      | DD/MM/YYYY everywhere — never MM/DD/YYYY               |
| Primary CTA      | WhatsApp inquiry via wa.me deep links only             |
| Auth             | None — no user login, no accounts, no sessions         |
| Payments         | None in v1.0 — Paystack integration planned for v2.0  |
| Admin            | Fechi Godwin — non-technical, manages content via Google Sheets |
| CMS              | Google Sheets (free, no login required beyond Google account) |
| Sheet            | URL stored in GOOGLE_SHEET_ID env var |
| PRD reference    | PRD v2.0 — 18 sections. All decisions trace back to it.|

---

## 2. APPROVED TECH STACK

This stack is final. Do not suggest alternatives. Do not deviate.

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **CMS Client:** Google Sheets (content fetched via googleapis at build time + time-based ISR)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Purpose:** API routes for analytics event logging only (/api/analytics POST — unchanged)

### Database
- **Engine:** PostgreSQL
- **Purpose:** Analytics events, testimonial approvals, admin change log, WhatsApp inquiry logs

### CMS
- **Platform:** Google Sheets
- **Who uses it:** Fechi Godwin (non-technical admin) — edits rows directly
- **What it manages:** Products (tab 1), Categories (tab 2), Testimonials (tab 3),
                   Site Settings (tab 4 — key/value pairs)
- **Library:** googleapis (official Google Node.js client)
- **Access:** Google Service Account — read-only access to the sheet

### Hosting & Infrastructure
- **Hosting:** Vercel (frontend + Next.js API routes)
- **Backend:** Vercel Serverless Functions OR a separate lightweight Express deployment on Railway/Render (developer decision based on complexity)
- **Database:** Supabase (PostgreSQL) or Railway PostgreSQL — $0/month tier
- **CDN:** Vercel Edge Network (built-in)
- **Target monthly cost:** $0 across all services on free tiers

### Cost Constraint
Every service must have a viable $0/month free tier that covers the expected traffic of a new Nigerian SMB website. If a package or service requires paid plans, flag it before adding it.

---

## 3. ABSOLUTE RULES — READ BEFORE EVERY TASK

The agent must enforce these without exception. They are non-negotiable.

### NEVER do any of the following:
- ❌ Hardcode the WhatsApp number — it must always be read from NEXT_PUBLIC_WHATSAPP_NUMBER env var, which is synced from the Site Settings tab of the Google Sheet at build time
- ❌ Use WordPress, Wix, Webflow, Squarespace, or any page-builder tool
- ❌ Build a custom admin interface — Google Sheets IS the admin experience
- ❌ Add user authentication, login pages, sessions, or JWT at any point in v1.0
- ❌ Integrate any payment gateway (Stripe, Paystack, Flutterwave) in v1.0
- ❌ Use Arial, Inter, Roboto, or any generic system font — the brand requires editorial serif + refined sans-serif typography only
- ❌ Use purple gradients, generic template layouts, or stock-looking design patterns
- ❌ Scatter display text directly in JSX/markup — all user-facing strings must come from Google Sheets queries (lib/sheets/queries.ts) or lib/constants.ts — never hardcoded in JSX
- ❌ Hardcode prices as display strings — price must always be stored as a number in Google Sheets/PostgreSQL and formatted as ₦XX,XXX by a shared utility function
- ❌ Add any feature not in the PRD v1.0 scope without explicit approval

### ALWAYS do the following:
- ✅ Read the WhatsApp number from `NEXT_PUBLIC_WHATSAPP_NUMBER` env var (synced from Google Sheets Site Settings tab at build time) — never from code
- ✅ Format all prices using the shared `formatNaira(amount: number): string` utility — e.g. `formatNaira(25000)` → `"₦25,000"`
- ✅ Format all dates as DD/MM/YYYY using the shared `formatDate(date: Date): string` utility
- ✅ Validate all Nigerian phone numbers against the pattern `+234XXXXXXXXXX` before saving
- ✅ Lazy-load all images below the fold using Next.js `<Image>` with `loading="lazy"`
- ✅ Add descriptive `alt` text to every `<Image>` component — no empty or placeholder alts in production
- ✅ Generate WhatsApp deep links using the shared `buildWhatsAppUrl(type, context)` utility — never construct wa.me URLs inline
- ✅ Keep the floating WhatsApp button rendered on every page via the root layout
- ✅ Ensure every page has a unique `<title>`, `<meta name="description">`, and Open Graph tags via Next.js Metadata API
- ✅ Test every page for WCAG 2.1 AA contrast before marking a task complete
- ✅ Check that Core Web Vitals targets are met: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## 4. ARCHITECTURE OVERVIEW

```
photoframes-vf/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # Root layout — floating WhatsApp button lives here
│   ├── page.tsx                  # Homepage (Hero + Categories + Featured Products)
│   ├── products/
│   │   ├── page.tsx              # Full product gallery with category filter
│   │   └── [slug]/
│   │       └── page.tsx          # Product detail page
│   ├── categories/
│   │   └── [slug]/
│   │       └── page.tsx          # Category-filtered product grid
│   ├── about/
│   │   └── page.tsx              # Brand story + Fechi's narrative
│   ├── testimonials/
│   │   └── page.tsx              # Customer reviews
│   └── api/
│       ├── analytics/
│       │   └── route.ts          # POST — log analytics events to PostgreSQL
│       └── webhooks/
│           └── sanity/
│               └── route.ts      # Sanity webhook receiver (content updates)
│
├── components/
│   ├── layout/
│   │   ├── FloatingWhatsApp.tsx  # Persistent CTA — rendered in root layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── product/
│   │   ├── ProductGrid.tsx       # Masonry / Pinterest-style grid
│   │   ├── ProductCard.tsx       # Individual product tile
│   │   ├── ProductDetail.tsx     # Full product view
│   │   └── CategoryFilter.tsx    # Category tab/filter bar
│   ├── home/
│   │   ├── Hero.tsx              # Full-width emotional hero section
│   │   ├── FeaturedCategories.tsx
│   │   └── TestimonialsPreview.tsx
│   └── ui/
│       ├── WhatsAppButton.tsx    # Reusable WhatsApp CTA button (not the float)
│       ├── StarRating.tsx
│       ├── ImageWithFallback.tsx # Handles broken image → branded placeholder
│       └── PriceTag.tsx          # Always uses formatNaira()
│
├── lib/
│   ├── sheets/
│   │   ├── client.ts        # Google Sheets API client (googleapis)
│   │   ├── queries.ts       # All data-fetching — no raw sheet access in components
│   │   ├── types.ts         # TypeScript types matching sheet column structure
│   │   ├── sync-env.ts      # Syncs whatsapp_number to env var at build time
│   │   └── utils.ts         # imageUrl helper for direct Google Drive URLs
│   ├── db/
│   │   ├── client.ts             # PostgreSQL connection
│   │   └── queries.ts            # All SQL queries — no inline SQL in routes
│   ├── whatsapp.ts               # buildWhatsAppUrl() — single source of truth
│   ├── format.ts                 # formatNaira(), formatDate(), formatPhone()
│   └── analytics.ts              # trackEvent() — wraps POST to /api/analytics
│

├── styles/
│   └── globals.css               # Tailwind base + design token CSS variables
│
├── public/
│   ├── fallback-product.svg      # Branded placeholder for broken product images
│   └── favicon.svg               # Brand favicon
│
├── scripts/
│   └── seed.mjs                  # Seed script for sample products
├── .env.local                    # Local environment variables (never committed)
├── .env.example                  # Committed — documents all required env vars
├── AGENTS.md                     # This file
├── Implementation-Plan.md        # Phased build plan
├── Photoframes_by_VF_PRD_v2.md   # PRD v2.0 — the source of truth for all decisions
└── sanity-to-googlesheets-migration.md  # CMS migration reference
```

---

## 5. DATA SCHEMAS

Directly from PRD v2.0 Section 7. Content is managed via Google Sheets tabs.
PostgreSQL tables match the analytics requirements below.

### 5.1 Product Schema

```typescript
// Fields map exactly to PRD Section 7.1
{
  name: 'product',
  fields: [
    { name: 'name',               type: 'string',   validation: Rule => Rule.required() },
    { name: 'slug',               type: 'slug',     options: { source: 'name' }, validation: Rule => Rule.required() },
    { name: 'category',           type: 'reference', to: [{ type: 'category' }], validation: Rule => Rule.required() },
    { name: 'description',        type: 'text',     validation: Rule => Rule.required() },
    { name: 'emotionalHeadline',  type: 'string',   validation: Rule => Rule.required() },
    { name: 'price',              type: 'number',   validation: Rule => Rule.required().min(0) },
    // price_display is NEVER stored — always derived via formatNaira(price)
    { name: 'images',             type: 'array', of: [{ type: 'image' }], validation: Rule => Rule.required().min(1) },
    { name: 'isCustomisable',     type: 'boolean',  initialValue: false },
    { name: 'customisationNote',  type: 'string' },
    { name: 'availability',       type: 'string',   options: { list: ['in_stock', 'made_to_order', 'unavailable'] } },
    { name: 'occasionTags',       type: 'array', of: [{ type: 'string' }],
      options: { list: ['Anniversary','Birthday','Wedding','Graduation','Proposal','Corporate','General Gift'] } },
    { name: 'whatsappInquiryText', type: 'text' },
  ]
}
```

### 5.2 Sanity — Category Schema

```typescript
// Maps to PRD Section 7.2
{
  name: 'category',
  fields: [
    { name: 'name',         type: 'string',  validation: Rule => Rule.required() },
    { name: 'slug',         type: 'slug',    options: { source: 'name' } },
    { name: 'description',  type: 'text' },
    { name: 'coverImage',   type: 'image' },
    { name: 'displayOrder', type: 'number',  initialValue: 99 },
    { name: 'isActive',     type: 'boolean', initialValue: true },
  ]
}
```

### 5.3 Sanity — Testimonial Schema

```typescript
// Maps to PRD Section 7.5
{
  name: 'testimonial',
  fields: [
    { name: 'customerName',  type: 'string',  validation: Rule => Rule.required() },
    { name: 'location',      type: 'string' },  // Nigerian city e.g. "Lagos"
    { name: 'productType',   type: 'string' },
    { name: 'reviewText',    type: 'text',    validation: Rule => Rule.required() },
    { name: 'rating',        type: 'number',  validation: Rule => Rule.required().min(1).max(5) },
    { name: 'isVisible',     type: 'boolean', initialValue: false }, // admin must approve
    { name: 'date',          type: 'date' },  // formatted DD/MM/YYYY in display layer
  ]
}
```

### 5.4 Sanity — Admin Content / Site Settings

```typescript
// Maps to PRD Section 7.4 — single singleton document
{
  name: 'siteSettings',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // no create/delete — singleton
  fields: [
    { name: 'heroHeadline',      type: 'string' },
    { name: 'heroSubheadline',   type: 'string' },
    { name: 'heroCTAPrimary',    type: 'string', initialValue: 'Explore the Collection' },
    { name: 'heroCTASecondary',  type: 'string', initialValue: 'Chat on WhatsApp' },
    { name: 'aboutText',         type: 'array', of: [{ type: 'block' }] },
    { name: 'aboutImage',        type: 'image' },
    { name: 'whatsappNumber',    type: 'string',
      description: 'Nigerian format: +234XXXXXXXXXX',
      validation: Rule => Rule.required().regex(/^\+234\d{10}$/, { name: 'Nigerian phone' }) },
    { name: 'instagramHandle',   type: 'string',
      description: 'Without the @ — e.g. photoframesbyvf' },
  ]
}
```

### 5.5 PostgreSQL — Analytics Events Table

```sql
-- Maps to PRD Section 13 — primary conversion tracking
CREATE TABLE analytics_events (
  id            SERIAL PRIMARY KEY,
  event_type    VARCHAR(64) NOT NULL,         -- 'whatsapp_click' | 'product_view' | 'category_click' | 'hero_cta' | 'instagram_click' | 'scroll_depth'
  product_slug  VARCHAR(255),                 -- populated for product-specific events
  category_slug VARCHAR(255),
  inquiry_type  VARCHAR(32),                  -- 'product_specific' | 'general' | 'corporate'
  traffic_source VARCHAR(64),                 -- 'organic' | 'instagram' | 'whatsapp_share' | 'direct' | 'referral'
  scroll_depth  SMALLINT,                     -- 25 | 50 | 75 | 100 — only for scroll events
  session_id    VARCHAR(64),
  user_agent    TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
```

```sql
-- Admin change log — maps to PRD Section 16
CREATE TABLE admin_change_log (
  id          SERIAL PRIMARY KEY,
  section     VARCHAR(64) NOT NULL,    -- 'hero' | 'product' | 'category' | 'testimonial' | 'contact_info' | 'about'
  field_name  VARCHAR(128),
  changed_by  VARCHAR(64) DEFAULT 'admin',
  changed_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  note        TEXT
);
```

---

## 6. WHATSAPP LINK GENERATION

The `buildWhatsAppUrl()` function in `lib/whatsapp.ts` is the **single source of truth** for all WhatsApp links. Never construct wa.me URLs anywhere else.

```typescript
// lib/whatsapp.ts

type InquiryType = 'product_specific' | 'general' | 'custom_order' | 'corporate';

interface WhatsAppContext {
  productName?: string;
  productCategory?: string;
}

export function buildWhatsAppUrl(
  type: InquiryType,
  context?: WhatsAppContext
): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // synced from Sanity
  if (!number) throw new Error('NEXT_PUBLIC_WHATSAPP_NUMBER is not set');

  const messages: Record<InquiryType, string> = {
    product_specific:
      `Hello! I'm interested in ${context?.productName ?? 'one of your products'}` +
      `${context?.productCategory ? ` (${context.productCategory})` : ''}.` +
      ` Could you share more details, availability, and pricing? Thank you.`,
    general:
      `Hello! I came across Photoframes by VF and would love to know more about your products. Could you help me?`,
    custom_order:
      `Hello! I'd like to place a custom order with Photoframes by VF. Could we discuss the details?`,
    corporate:
      `Hello! I'm interested in bulk/corporate orders from Photoframes by VF. Could we discuss options and pricing?`,
  };

  const encoded = encodeURIComponent(messages[type]);
  return `https://wa.me/${number.replace('+', '')}?text=${encoded}`;
}
```

---

## 7. SHARED UTILITY FUNCTIONS

All formatting must go through these. Never format inline in components.

```typescript
// lib/format.ts

/** Format a number as Nigerian Naira — e.g. 25000 → "₦25,000" */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

/** Format a Date as DD/MM/YYYY — Nigerian standard */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day   = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year  = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Validate a Nigerian phone number */
export function isValidNigerianPhone(phone: string): boolean {
  return /^\+234\d{10}$/.test(phone);
}
```

---

## 8. ANALYTICS TRACKING

All events tracked from the client must call `trackEvent()` from `lib/analytics.ts`. No raw fetch calls to `/api/analytics` from components.

```typescript
// lib/analytics.ts

type TrackableEvent =
  | { type: 'whatsapp_click'; inquiryType: string; productSlug?: string }
  | { type: 'product_view';   productSlug: string; categorySlug?: string }
  | { type: 'category_click'; categorySlug: string }
  | { type: 'hero_cta';       label: string }
  | { type: 'instagram_click' }
  | { type: 'scroll_depth';   depth: 25 | 50 | 75 | 100 };

export async function trackEvent(event: TrackableEvent): Promise<void> {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch {
    // Analytics must never break the user experience — fail silently
  }
}
```

---

## 9. ENVIRONMENT VARIABLES

All required environment variables. The agent must reference `.env.example` before creating any new service or integration.

```bash
# .env.example — commit this; never commit .env.local

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                    # Server-only — write access for webhooks

# WhatsApp — synced from Sanity siteSettings, set during build or via Vercel env
NEXT_PUBLIC_WHATSAPP_NUMBER=         # Format: +234XXXXXXXXXX — no spaces

# PostgreSQL (Supabase or Railway)
DATABASE_URL=                        # postgres://user:pass@host:5432/db

# Vercel
VERCEL_URL=                          # Auto-set by Vercel
```

Never hardcode any of these values in source code. If a value is missing at runtime, throw a clear descriptive error — not a silent undefined.

---

## 10. PERFORMANCE REQUIREMENTS

These are hard requirements from PRD Section 8 and 11, not guidelines.

| Metric              | Target                                      |
|---------------------|---------------------------------------------|
| Page load (3G/4G)   | < 3 seconds on Nigerian mobile networks     |
| LCP                 | < 2.5s                                      |
| FID / INP           | < 100ms                                     |
| CLS                 | < 0.1                                       |
| Image formats       | WebP with AVIF fallback via Next.js Image   |
| Below-fold images   | Lazy-loaded — `loading="lazy"` or `priority={false}` |
| Hero image          | `priority={true}` — preloaded immediately   |
| Render-blocking     | Zero render-blocking scripts on initial load |
| Fonts               | Loaded via `next/font` — no external font requests |

If any Lighthouse score drops below 85 on mobile, the agent must investigate and fix before proceeding to the next task.

---

## 11. DESIGN SYSTEM

### Typography (load via `next/font` — no Google Fonts CDN requests)
- **Heading (serif):** Cormorant Garamond — `var(--font-heading)` — refined serif, conveys heritage and luxury
- **Body (sans-serif):** DM Sans — `var(--font-body)` — readable, contemporary, airy
- **Accent (serif):** Playfair Display — `var(--font-accent)` — high-contrast serif for testimonials, quotes, emotional headlines
- **Never use:** Arial, Inter, Roboto, Helvetica, or any OS system font
- **See full token set:** `styles/tokens.css`

### Colour Tokens (defined in `styles/tokens.css` as CSS variables via `token-colour.json`)

The colour system has two layers — **primitives** (by palette and tone) and **roles** (semantic, theme-aware). UI must use only roles, never primitives.

**Light theme** (`:root`):
```css
:root {
  --color-primary: hsl(45, 100%, 51%);
  --color-on-primary: hsl(0, 0%, 100%);
  --color-primary-container: hsl(45, 100%, 49%);
  --color-on-primary-container: hsl(44, 100%, 18%);
  --color-secondary: hsl(44, 100%, 24%);
  --color-on-secondary: hsl(0, 0%, 100%);
  --color-secondary-container: hsl(43, 95%, 55%);
  --color-on-secondary-container: hsl(44, 100%, 18%);
  --color-tertiary: hsl(44, 100%, 24%);
  --color-on-tertiary: hsl(0, 0%, 100%);
  --color-tertiary-container: hsl(42, 88%, 61%);
  --color-on-tertiary-container: hsl(44, 100%, 18%);
  --color-error: hsl(0, 74%, 42%);
  --color-on-error: hsl(0, 0%, 100%);
  --color-error-container: hsl(0, 100%, 84%);
  --color-on-error-container: hsl(0, 100%, 29%);
  --color-background: hsl(44, 100%, 96%);
  --color-on-background: hsl(53, 40%, 8%);
  --color-surface: hsl(44, 100%, 96%);
  --color-on-surface: hsl(53, 40%, 8%);
  --color-surface-variant: hsl(46, 77%, 81%);
  --color-on-surface-variant: hsl(47, 49%, 22%);
  --color-outline: hsl(46, 30%, 40%);
  --color-outline-variant: hsl(46, 47%, 70%);
  --color-inverse-surface: hsl(53, 21%, 16%);
  --color-inverse-on-surface: hsl(46, 69%, 91%);
  --color-inverse-primary: hsl(45, 100%, 49%);
}
```

**Dark theme** (`.dark`):
```css
.dark {
  --color-primary: hsl(45, 100%, 51%);
  --color-on-primary: hsl(44, 100%, 12%);
  --color-primary-container: hsl(44, 100%, 18%);
  --color-on-primary-container: hsl(40, 100%, 81%);
  --color-secondary: hsl(43, 95%, 55%);
  --color-on-secondary: hsl(42, 100%, 13%);
  --color-secondary-container: hsl(44, 100%, 18%);
  --color-on-secondary-container: hsl(40, 100%, 81%);
  --color-tertiary: hsl(42, 88%, 61%);
  --color-on-tertiary: hsl(43, 100%, 13%);
  --color-tertiary-container: hsl(44, 100%, 18%);
  --color-on-tertiary-container: hsl(40, 100%, 81%);
  --color-error: hsl(0, 100%, 84%);
  --color-on-error: hsl(0, 100%, 21%);
  --color-error-container: hsl(0, 100%, 29%);
  --color-on-error-container: hsl(0, 100%, 92%);
  --color-background: hsl(53, 24%, 4.8%);
  --color-on-background: hsl(46, 41%, 85%);
  --color-surface: hsl(53, 24%, 4.8%);
  --color-on-surface: hsl(46, 41%, 85%);
  --color-surface-variant: hsl(47, 49%, 22%);
  --color-on-surface-variant: hsl(46, 47%, 70%);
  --color-outline: hsl(46, 26%, 50%);
  --color-outline-variant: hsl(47, 49%, 22%);
  --color-inverse-surface: hsl(46, 41%, 85%);
  --color-inverse-on-surface: hsl(53, 21%, 16%);
  --color-inverse-primary: hsl(45, 100%, 24%);
  --color-surface-dim: hsl(53, 24%, 4.8%);
  --color-surface-bright: hsl(52.2, 19%, 19.6%);
  --color-surface-container-lowest: hsl(53, 16%, 3.2%);
  --color-surface-container-low: hsl(53, 40%, 8%);
  --color-surface-container: hsl(53, 36.2%, 9.6%);
  --color-surface-container-high: hsl(53, 26.7%, 13.6%);
  --color-surface-container-highest: hsl(52.6, 20%, 17.8%);
}
```

Full set including surface containers, typography scales, and text style composites: `styles/tokens.css`

### Layout
- Mobile-first: base styles at 375px, scale up with Tailwind breakpoints
- Grid: CSS Grid or Tailwind grid — Pinterest masonry for product gallery
- Whitespace: generous — luxury brands breathe
- Floating WhatsApp button: fixed bottom-right, `z-index: 50`, always visible

### Forbidden design patterns
- Purple gradients on white
- Generic card shadows (0 4px 6px rgba(0,0,0,0.1))
- Rounded pill buttons with solid blue fills
- Stock photography or lorem ipsum in any commit

---

## 12. SECURITY REQUIREMENTS (PRD Section 14)

| Requirement               | Implementation                                                    |
|---------------------------|-------------------------------------------------------------------|
| HTTPS                     | Enforced by Vercel — HTTP redirects to HTTPS automatically        |
| WhatsApp number exposure  | Stored in Sanity + env var only — never in source or markup       |
| Admin content sanitisation| Sanity's Portable Text handles sanitisation — never use dangerouslySetInnerHTML with raw strings |
| Image upload validation   | Sanity enforces file type (JPG/PNG/WebP) and size limits          |
| Dependency hygiene        | Run `npm audit` before every deployment — fix high/critical issues |
| No exposed credentials    | All secrets in `.env.local` — `.gitignore` must include it        |

---

## 13. ACCESSIBILITY REQUIREMENTS (PRD Section 8.2)

- WCAG 2.1 AA is the minimum — not aspirational
- All `<Image>` components must have a meaningful `alt` prop — no empty strings
- Floating WhatsApp button must have `aria-label="Chat with us on WhatsApp"`
- All interactive elements must show a visible `:focus-visible` ring
- Minimum font size: 14px (0.875rem) on mobile — enforced in Tailwind config
- Colour contrast: ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI components
- Category filter tabs must be navigable via keyboard and announced by screen readers

---

## 14. SANITY STUDIO ADMIN RULES

The admin experience is Sanity Studio. No custom dashboard is needed or permitted.

Sanity Studio must be configured so Fechi Godwin can:
- Add/edit/hide products (required fields enforced at schema level)
- Update prices — number field only, ₦ symbol never entered by admin
- Upload images — JPG, PNG, WebP only, max 10MB before Sanity compression
- Toggle product visibility with a single boolean field (`isVisible`)
- Update the WhatsApp number in Site Settings — validated against `+234XXXXXXXXXX`
- Add and approve testimonials — `isVisible: false` by default until admin approves
- Update hero headline, subheadline, and CTA labels

### Admin validation rules the agent must enforce in Sanity schema:
- Product cannot be published without: name, price, primary image, category, availability
- Price field: number type only — `min(0)` — formatted by app, not by admin
- WhatsApp number: regex validation `/^\+234\d{10}$/` — error message in plain English: "Please enter a Nigerian number starting with +234"
- Deleting a category with active products: use a custom validation warning

---

## 15. DEPLOYMENT CHECKLIST

Before marking any task as complete, the agent must verify:

### Code quality
- [ ] No hardcoded WhatsApp numbers anywhere in source
- [ ] No inline wa.me URLs — all use `buildWhatsAppUrl()`
- [ ] No inline price strings — all use `formatNaira()`
- [ ] No Arial, Inter, or Roboto in any CSS or Tailwind class
- [ ] All images have descriptive `alt` text
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` is committed and up to date

### Performance
- [ ] Lighthouse mobile score ≥ 85
- [ ] LCP < 2.5s on throttled 3G simulation
- [ ] No render-blocking scripts
- [ ] All below-fold images lazy-loaded

### Sanity
- [ ] All schemas match PRD Section 7 exactly
- [ ] Singleton siteSettings document exists and is published
- [ ] WhatsApp number field validates Nigerian format
- [ ] All required fields enforced with `Rule.required()`

### Analytics
- [ ] `analytics_events` and `admin_change_log` tables created in PostgreSQL
- [ ] `trackEvent('whatsapp_click')` fires on every WhatsApp CTA interaction
- [ ] Traffic source attribution reads from referrer or UTM params

### SEO
- [ ] Every page has a unique `<title>` and `<meta name="description">`
- [ ] Open Graph tags present on all pages
- [ ] `sitemap.xml` generated via `next-sitemap` or Next.js App Router sitemap
- [ ] All product image `alt` text contains product name and category

---

## 16. FUTURE-PROOFING FOR V2.0

These decisions must be made correctly in v1.0 to avoid a full rebuild later.

| v2.0 Feature              | v1.0 Requirement                                                     |
|---------------------------|----------------------------------------------------------------------|
| Paystack payment gateway  | `price` must be stored as `number` in Sanity and PostgreSQL — never as display string |
| Order management          | PostgreSQL schema must include `order_id` column placeholder in analytics table |
| Automated WhatsApp (WABA) | WhatsApp number stored in ONE place (Sanity siteSettings) — never duplicated |
| Multi-language (Yoruba / Igbo / Pidgin) | All display strings must come from Sanity or a constants file — never hardcoded in JSX |
| Customer accounts         | No auth assumptions hardcoded into routing — middleware must be addable without restructuring |
| Public review submission  | Testimonial schema already supports this — just add a public POST endpoint and set `isVisible: false` |

---

## 17. TIMELINE

| Week | Deliverable                                                              |
|------|--------------------------------------------------------------------------|
| 1    | Repo setup, Sanity schema, PostgreSQL tables, design system, layout components |
| 2    | Homepage, product gallery, product detail page, category filtering       |
| 3    | About page, testimonials, SEO metadata, analytics events, WhatsApp integration |
| 4    | Performance audit, accessibility audit, deployment to Vercel, Sanity Studio handoff to Fechi |

---

## 18. REFERENCE DOCUMENTS

| Document       | Location         | Purpose                                         |
|----------------|------------------|-------------------------------------------------|
| PRD v2.0       | `/PRD.md`        | Source of truth for all product decisions       |
| Sanity schemas | `/sanity/schema/`| Data structure — must match PRD Section 7       |
| Env vars       | `/.env.example`  | All required environment variables              |
| Design tokens  | `/styles/tokens.css` | CSS variables — single source for all colours  |
| WhatsApp util  | `/lib/whatsapp.ts` | Only place wa.me URLs are constructed          |
| Format utils   | `/lib/format.ts` | formatNaira(), formatDate(), isValidNigerianPhone() |

---

*AGENTS.md is the agent's operating manual for this project.
All decisions that are not covered here must be traced back to PRD v2.0.
When in doubt: keep it simple, keep it fast, keep it on-brand.*
