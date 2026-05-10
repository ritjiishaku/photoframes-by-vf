# Implementation Plan — Photoframes by VF

> **Project:** Photoframes by VF — Premium Gifting Web Application
> **Client:** Fechi Godwin | **Country:** Nigeria | **Currency:** ₦ (Naira)
> **Stack:** Next.js 14 (App Router) + Tailwind CSS + Sanity.io + PostgreSQL
> **Status:** Ready for Build | **Last Updated:** 10/05/2026

---

## Table of Contents

1. [Phase 0: Foundation — Core Infrastructure](#phase-0-foundation--core-infrastructure)
2. [Phase 1: Layout & Navigation (Shell Components)](#phase-1-layout--navigation-shell-components)
3. [Phase 2: Homepage](#phase-2-homepage)
4. [Phase 3: Products & Categories](#phase-3-products--categories)
5. [Phase 4: Content Pages](#phase-4-content-pages)
6. [Phase 5: API Routes & Backend](#phase-5-api-routes--backend)
7. [Phase 6: Shared UI Components](#phase-6-shared-ui-components)
8. [Phase 7: SEO, Performance & Accessibility](#phase-7-seo-performance--accessibility)
9. [Phase 8: Public Assets](#phase-8-public-assets)
10. [References & Dependencies](#references--dependencies)

---

## Phase 0: Foundation — Core Infrastructure

### 0.1 Sanity Schemas

**Purpose:** Define data structures for all CMS-managed content. Schemas enforce validation rules that allow Fechi (non-technical admin) to manage content independently.

| File | Schema | Key Validations |
|------|--------|-----------------|
| `sanity/schema/product.ts` | Product | name, slug, category (reference), description, emotionalHeadline, price (number, min 0), images (min 1), availability (enum) |
| `sanity/schema/category.ts` | Category | name, slug, displayOrder, isActive |
| `sanity/schema/testimonial.ts` | Testimonial | customerName, rating (1-5), reviewText, isVisible (default false) |
| `sanity/schema/siteSettings.ts` | Site Settings (singleton) | whatsappNumber (regex `/^\+234\d{10}$/`), heroHeadline, aboutText (Portable Text) |
| `sanity/schema/index.ts` | Schema registry | Exports all schemas |
| `sanity/sanity.config.ts` | Sanity Studio config | Desk tool, vision tool, project ID, dataset |

**Notes:**
- `price_display` is NEVER stored — always derived via `formatNaira(price)` at render time
- WhatsApp number regex validation includes plain-English error message: "Please enter a valid Nigerian WhatsApp number starting with +234"
- SiteSettings is a singleton — `__experimental_actions: ['update', 'publish']` prevents accidental deletion

---

### 0.2 Sanity Client & Queries

**Purpose:** Single source of truth for all Sanity data access. No inline GROQ queries in components.

| File | Purpose |
|------|---------|
| `lib/sanity/client.ts` | Configured Sanity client using `@sanity/client` + `@sanity/image-url` |
| `lib/sanity/queries.ts` | All GROQ queries as exported functions — `getProducts()`, `getProductBySlug()`, `getCategories()`, `getTestimonials()`, `getSiteSettings()` |
| `lib/sanity/types.ts` | TypeScript interfaces matching Sanity document shapes |

**Query rules:**
- Always project only needed fields — never `*` in production
- Use `coalesce()` for optional fields
- Use `category->` references to join category data

---

### 0.3 PostgreSQL Database

**Purpose:** Analytics event logging and admin change tracking. Both tables required before deployment.

| File | Purpose |
|------|---------|
| `db/migrations/001_initial.sql` | CREATE TABLE statements for `analytics_events` and `admin_change_log` |
| `lib/db/client.ts` | PostgreSQL connection via `postgres` package |
| `lib/db/queries.ts` | All SQL as parameterised query functions — `insertAnalyticsEvent()`, `logAdminChange()` |

**Table: `analytics_events`**
- Columns: id, event_type (enum), product_slug, category_slug, inquiry_type, traffic_source, scroll_depth, session_id, user_agent, created_at
- Indexed on: event_type, created_at, product_slug

**Table: `admin_change_log`**
- Columns: id, section (enum), field_name, changed_by, changed_at, note
- Indexed on: section, changed_at

**Notes:**
- All queries use parameterised syntax — never string interpolation
- DB errors never reach the user — wrapped in try/catch returning generic 500
- Database is optional at build time — site functions without it

---

### 0.4 Shared Utilities

**Purpose:** Centralised formatting and business logic — never inline in components.

**`lib/format.ts`**
```typescript
formatNaira(amount: number): string     // 25000 → "₦25,000"
formatDate(date: Date | string): string // → "DD/MM/YYYY"
isValidNigerianPhone(phone: string): boolean // /^\+234\d{10}$/
```

**`lib/whatsapp.ts`**
```typescript
buildWhatsAppUrl(type: InquiryType, context?: WhatsAppContext): string
// Single source of truth for ALL wa.me URLs
// Reads NEXT_PUBLIC_WHATSAPP_NUMBER from env
// Throws descriptive error if env var missing
```

**`lib/analytics.ts`**
```typescript
trackEvent(event: TrackableEvent): Promise<void>
// Client-side wrapper around POST /api/analytics
// Always fails silently — never breaks UX
```

---

### 0.5 Constants Layer

**Purpose:** All user-facing display strings in one place for future localisation.

**`lib/constants.ts`**
- Navigation labels: Products, About, Testimonials
- Footer text, copyright
- Accessibility labels and ARIA text
- Default CTA labels (overridden by Sanity where applicable)

---

## Phase 1: Layout & Navigation (Shell Components)

### 1.1 Header

**Purpose:** Sticky top navigation bar — brand identity and primary navigation.

**File:** `components/layout/Header.tsx`

**Logic / Structure:**
- Server component
- Brand logo/name → links to `/`
- Navigation links driven by `lib/constants.ts`
- Desktop: horizontal nav items
- Mobile: hamburger toggle (delegated to `Navigation` component)

**Notes:**
- No data fetching — purely presentational
- Position: `sticky top-0 z-40`

---

### 1.2 Navigation

**Purpose:** Responsive menu — desktop horizontal bar, mobile slide-out drawer.

**File:** `components/layout/Navigation.tsx`

**Logic / Structure:**
- `'use client'` for mobile menu state
- `useState` for open/close toggle
- Keyboard accessible: Escape to close, Tab trapping when open
- `aria-expanded` on hamburger button
- `aria-label` on all nav links

---

### 1.3 Footer

**Purpose:** Brand closing element — social proof, contact fallback, copyright.

**File:** `components/layout/Footer.tsx`

**Logic / Structure:**
- Server component
- Instagram link: `https://instagram.com/{handle}` with `rel="noopener noreferrer"`
- WhatsApp fallback text display
- Copyright with current year

---

### 1.4 FloatingWhatsApp

**Purpose:** Persistent CTA on every page — the primary conversion tool.

**File:** `components/layout/FloatingWhatsApp.tsx`

**Logic / Structure:**
- `'use client'`
- Fixed position: `bottom-6 right-6 z-50`
- 56×56px gold circle (`w-14 h-14`)
- SVG WhatsApp icon
- Generates URL via `buildWhatsAppUrl('general')`
- Tracks click via `trackEvent({ type: 'whatsapp_click', inquiryType: 'general' })`
- `aria-label="Chat with us on WhatsApp"`
- Rendered in root layout — never imported elsewhere

---

### 1.5 Root Layout Update

**File:** `app/layout.tsx`

**Changes:**
- Wrap children in Header + main content + Footer structure
- Render FloatingWhatsApp component
- Keep existing font loading and metadata
- Server component — no `'use client'`

---

## Phase 2: Homepage

### 2.1 Hero

**Purpose:** Full-viewport emotional introduction — the first thing visitors see.

**File:** `components/home/Hero.tsx`

**Logic / Structure:**
- Server component
- Fetches from Sanity: `siteSettings.heroHeadline`, `heroSubheadline`, `heroCTAPrimary`, `heroCTASecondary`
- Background image (optional, from Sanity)
- Primary CTA: link to `/products`
- Secondary CTA: `WhatsAppButton` with `type="general"`
- Hero image: `priority={true}` on `<Image>`

---

### 2.2 FeaturedCategories

**Purpose:** Category discovery grid — encourages browsing.

**File:** `components/home/FeaturedCategories.tsx`

**Logic / Structure:**
- Server component
- Fetches categories from Sanity, ordered by `displayOrder`, filtered `isActive === true`
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- Each card: cover image, category name, link to `/categories/[slug]`

---

### 2.3 TestimonialsPreview

**Purpose:** Social proof carousel on homepage — builds trust immediately.

**File:** `components/home/TestimonialsPreview.tsx`

**Logic / Structure:**
- Server component
- Fetches latest 3-5 approved testimonials (`isVisible === true`)
- Quote in Playfair Display italic
- Star rating, customer name, location
- Link to full `/testimonials` page

---

### 2.4 Homepage Page

**File:** `app/page.tsx`

**Structure:**
- Composes Hero + FeaturedCategories + TestimonialsPreview
- ISR: `revalidate: 1800`
- Exports `metadata` with OG tags

---

## Phase 3: Products & Categories

### 3.1 ProductCard

**Purpose:** Individual product tile — the atomic unit of the product gallery.

**File:** `components/product/ProductCard.tsx`

**Logic / Structure:**
- `'use client'` for interactivity (hover, analytics)
- Image via `ImageWithFallback` — lazy-loaded
- Product name: `font-heading`
- Price via `PriceTag` component
- Occasion tag pill
- Entire card tappable → navigates to `/products/[slug]`
- WhatsApp inquiry button inside card
- Hover: `hover:scale-[1.02] transition-transform duration-300`

---

### 3.2 ProductGrid

**Purpose:** Masonry/Pinterest-style grid container.

**File:** `components/product/ProductGrid.tsx`

**Logic / Structure:**
- Server component
- CSS columns: `columns-2 md:columns-3 lg:columns-4 gap-4`
- Children use `break-inside-avoid mb-4`
- Accepts `products` array and renders `ProductCard` for each

---

### 3.3 CategoryFilter

**Purpose:** Horizontal tab bar for filtering products by category.

**File:** `components/product/CategoryFilter.tsx`

**Logic / Structure:**
- `'use client'`
- Horizontal scroll on mobile (no wrap)
- Active tab: gold fill (`bg-primary text-on-primary`)
- Inactive: transparent
- `aria-pressed` on active button
- Tracks click via `trackEvent({ type: 'category_click' })`
- Keyboard navigable

---

### 3.4 PriceTag

**Purpose:** The only component allowed to render prices.

**File:** `components/ui/PriceTag.tsx`

**Logic / Structure:**
- Server component
- Accepts `amount: number` — never a string
- Calls `formatNaira(amount)` internally
- Never uses `₦` symbol directly in JSX

---

### 3.5 ProductDetail

**Purpose:** Full product view — the conversion page.

**File:** `components/product/ProductDetail.tsx`

**Logic / Structure:**
- Server component with `'use client'` isolated to interactive parts
- Image gallery (primary + thumbnails)
- Emotional headline, description (Portable Text)
- Price via `PriceTag`
- Customisation note (if applicable)
- Availability badge
- WhatsApp CTA via `WhatsAppButton` with `type="product_specific"`
- Occasion tags

---

### 3.6 Products Gallery Page

**File:** `app/products/page.tsx`

**Structure:**
- Server component
- Fetches all products + categories from Sanity
- Renders `CategoryFilter` + `ProductGrid`
- Client-side filtering by category (via state in a client wrapper)
- ISR: `revalidate: 3600`
- Exports `generateMetadata`

---

### 3.7 Product Detail Page

**File:** `app/products/[slug]/page.tsx`

**Structure:**
- `generateStaticParams` to pre-render all product slugs
- ISR: `revalidate: 3600`
- Fetches single product by slug
- Renders `ProductDetail`
- Exports `generateMetadata` with product-specific title/description/OG image

---

### 3.8 Category Page

**File:** `app/categories/[slug]/page.tsx`

**Structure:**
- `generateStaticParams` for all active categories
- Fetches products filtered by category slug
- Renders category name + description + filtered product grid
- ISR: `revalidate: 3600`
- Exports `generateMetadata`

---

## Phase 4: Content Pages

### 4.1 About Page

**File:** `app/about/page.tsx`

**Logic / Structure:**
- Server component
- Fetches `siteSettings.aboutText` (Portable Text) + `aboutImage`
- Renders via `@portabletext/react`
- Two-column layout on desktop (text + image)
- ISR: `revalidate: 3600`

---

### 4.2 Testimonials Page

**File:** `app/testimonials/page.tsx`

**Logic / Structure:**
- Server component
- Fetches all approved testimonials (`isVisible === true`), ordered by `date desc`
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Each card: star rating, quote, customer name, location, product type, date
- ISR: `revalidate: 3600`

---

### 4.3 StarRating

**Purpose:** Reusable star display for testimonials.

**File:** `components/ui/StarRating.tsx`

**Logic / Structure:**
- Server component
- Accepts `rating: number` (1-5)
- Renders filled/empty stars
- Screen reader: `role="img" aria-label="Rated X out of 5 stars"`

---

## Phase 5: API Routes & Backend

### 5.1 Analytics API

**File:** `app/api/analytics/route.ts`

**Purpose:** Receives analytics events from client and writes to PostgreSQL.

**Logic / Structure:**
- `POST` only — reject other methods with 405
- Origin check for CSRF protection
- Zod validation of request body
- Accepted event types: `whatsapp_click`, `product_view`, `category_click`, `hero_cta`, `instagram_click`, `scroll_depth`
- Reject unknown event types with 400
- Parameterised SQL insert
- Return 200 on success, 500 on DB error (generic message)
- Failure never propagates to client

---

### 5.2 Sanity Webhook

**File:** `app/api/webhooks/sanity/route.ts`

**Purpose:** Receives content update notifications from Sanity and triggers ISR revalidation.

**Logic / Structure:**
- `POST` only
- Validate webhook secret header
- Determine affected pages from document type
- Call `revalidatePath()` for affected routes
- Log change to `admin_change_log` table
- Return 200 immediately — do not block on revalidation

---

## Phase 6: Shared UI Components

### 6.1 WhatsAppButton

**Purpose:** Reusable inline CTA button — used in hero, product detail, and anywhere a WhatsApp action is needed.

**File:** `components/ui/WhatsAppButton.tsx`

**Logic / Structure:**
- `'use client'`
- Generates wa.me URL internally via `buildWhatsAppUrl(type, context)`
- Never accepts raw URL as prop
- Tracks click via `trackEvent({ type: 'whatsapp_click' })`
- Loading state while URL generates
- Styled: gold fill, uppercase label, hover transition
- `aria-label` dynamically set based on product context

---

### 6.2 ImageWithFallback

**Purpose:** Safe image rendering with branded placeholder on failure.

**File:** `components/ui/ImageWithFallback.tsx`

**Logic / Structure:**
- `'use client'` for `onError` handling
- Wraps Next.js `<Image>`
- On error: swaps `src` to `/fallback-product.jpg`
- `alt` prop is required — never empty
- Forwards `priority`, `sizes`, `className` to `<Image>`

---

### 6.3 WhatsApp SVG Icon

**Purpose:** Reusable WhatsApp SVG icon used in FloatingWhatsApp and WhatsAppButton.

**File:** `components/ui/WhatsAppIcon.tsx`

**Logic / Structure:**
- Pure server component
- Accepts `className` for sizing/colouring
- Standard WhatsApp logo path

---

## Phase 7: SEO, Performance & Accessibility

### 7.1 Metadata Per Page

**Files:** All `page.tsx` files

**Requirements:**
- Every page exports `metadata` or `generateMetadata`
- Unique `<title>`: "Page Name | Photoframes by VF"
- Unique `<meta name="description">` — keyword-rich, 150-160 characters
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:type`, `og:locale="en_NG"`
- Product pages: dynamic OG image from product primary image

### 7.2 Sitemap

**File:** `app/sitemap.ts`

**Structure:**
- Lists all static pages: `/`, `/products`, `/about`, `/testimonials`
- Dynamic entries for all product slugs
- Dynamic entries for all active category slugs
- Last modified dates

### 7.3 Structured Data (JSON-LD)

**File:** `components/product/ProductSchema.tsx`

**Logic / Structure:**
- Renders `<script type="application/ld+json">` on product detail pages
- Schema.org `Product` type with name, description, image, offers (price, currency, availability)

### 7.4 Performance Audit

**Checklist:**
- Lighthouse mobile score ≥ 85
- LCP < 2.5s on throttled Fast 3G (Chrome DevTools)
- CLS < 0.1
- INP < 100ms
- Zero render-blocking scripts on initial load
- All below-fold images: `loading="lazy"` or `priority={false}`
- Hero image: `priority={true}`
- Fonts via `next/font` only — zero external font requests

### 7.5 Accessibility Audit

**Checklist:**
- WCAG 2.1 AA contrast verified (≥ 4.5:1 body, ≥ 3:1 large text/UI)
- Keyboard navigation: Tab through all pages, visible `:focus-visible` rings
- Screen reader: `aria-label` on all interactive elements, meaningful `alt` on all images
- Minimum font size 14px on mobile
- Touch targets minimum 44×44px
- `prefers-reduced-motion` respected

---

## Phase 8: Public Assets

### 8.1 Fallback Image

**File:** `public/fallback-product.jpg`

**Requirements:**
- Branded placeholder — logo on neutral (ivory/champagne) background
- Used by `ImageWithFallback` when product images fail to load

### 8.2 Favicon

**File:** `public/favicon.ico`, `public/apple-icon.png`, `public/icon.png`

**Requirements:**
- Brand-compliant gold-on-dark or brand mark
- Generated in standard sizes (16×16, 32×32, 192×192, 512×512)

---

## References & Dependencies

| Reference | Location | Purpose |
|-----------|----------|---------|
| AGENTS.md | `/AGENTS.md` | Operating manual — absolute rules, architecture, data schemas |
| PRD v2.0 | `/Photoframes_by_VF_PRD_v2.md` | Source of truth for all product decisions |
| Design System | `.agents/rules/design-system.md` | Colour tokens, typography, layout rules |
| Architecture Rules | `.agents/rules/architecture.md` | Stack decisions, routing, data fetching |
| Code Style | `.agents/rules/code-style.md` | TypeScript, Tailwind, import conventions |
| Security Rules | `.agents/rules/security.md` | Secrets, validation, XSS prevention |
| Workflow: Components | `.agents/workflows/new-component.md` | Component creation process |
| Workflow: API Routes | `.agents/workflows/new-api-route.md` | API route creation process |
| Design Tokens | `/styles/tokens.css` | CSS variables — auto-generated from JSON tokens |
| Colour Tokens | `/token-colour.json` | Source JSON for colour design tokens |
| Typography Tokens | `/token-typography.json` | Source JSON for typography design tokens |

---

## Build Order Summary

```
Phase 0 ─── Sanity schemas → Client/queries → DB migrations → Utilities → Constants
    │
    ▼
Phase 1 ─── Header → Navigation → Footer → FloatingWhatsApp → Root Layout
    │
    ▼
Phase 2 ─── Hero → FeaturedCategories → TestimonialsPreview → Homepage
    │
    ▼
Phase 3 ─── PriceTag → ImageWithFallback → ProductCard → ProductGrid → CategoryFilter
    │        → ProductDetail → Gallery page → Detail page → Category page
    │
    ▼
Phase 4 ─── About page → Testimonials page → StarRating
    │
    ▼
Phase 5 ─── Analytics API → Sanity Webhook
    │
    ▼
Phase 6 ─── WhatsAppButton → WhatsAppIcon → polish all UI components
    │
    ▼
Phase 7 ─── Metadata → Sitemap → JSON-LD → Performance audit → Accessibility audit
    │
    ▼
Phase 8 ─── Fallback image → Favicon → final deployment prep
```

---

*All decisions trace back to AGENTS.md and PRD v2.0. When in doubt: keep it simple, keep it fast, keep it on-brand.*
