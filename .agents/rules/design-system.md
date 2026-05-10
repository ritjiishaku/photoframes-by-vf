# design-system.md
# Photoframes by VF — Design System Rules
# Source: AGENTS.md Sections 11 + 13, PRD v2.0 Sections 9, 8.2
# These are the single source of truth for all visual decisions.
# Tokens are defined in styles/globals.css — never override them inline.

---

## 1. COLOUR TOKENS

All colours are defined as CSS custom properties in `styles/globals.css`.
They are extended into Tailwind via `tailwind.config.ts`.
Never use raw hex values in components — always use the semantic token name.

```css
/* styles/globals.css */
:root {
  /* ── Surfaces ─────────────────────────────────── */
  --color-surface-dark:     #111111;   /* Primary page background (dark mode) */
  --color-surface-mid:      #1C1C1C;   /* Cards, elevated elements on dark    */
  --color-surface-light:    var(--color-ivory);  /* Alias for light sections  */

  /* ── Gold accent ──────────────────────────────── */
  --color-gold-primary:     #C9A96E;   /* Primary accent — headings, CTAs, borders */
  --color-gold-light:       #E2C48A;   /* Hover state on gold elements              */
  --color-gold-muted:       #9B7D4F;   /* Subdued gold — dividers, secondary icons  */

  /* ── Light surfaces ───────────────────────────── */
  --color-ivory:            #F5F0E8;   /* Primary light background                  */
  --color-champagne:        #EDE0CC;   /* Secondary light — section alternates       */

  /* ── Text ─────────────────────────────────────── */
  --color-text-on-dark:     #F0EBE1;   /* Body text on dark surfaces — off-white    */
  --color-text-on-light:    #1A1A1A;   /* Body text on light surfaces — near-black  */
  --color-text-muted:       #8A8A8A;   /* Secondary labels, captions, timestamps    */

  /* ── Borders ──────────────────────────────────── */
  --color-border-dark:      #2E2E2E;   /* Subtle border on dark surfaces            */
  --color-border-light:     #D8CEBC;   /* Subtle border on light surfaces           */

  /* ── Status ───────────────────────────────────── */
  --color-in-stock:         #4CAF50;   /* Availability: in stock                    */
  --color-made-to-order:    #FF9800;   /* Availability: made to order               */
  --color-unavailable:      #9E9E9E;   /* Availability: unavailable                 */
}
```

### Token → Tailwind class mapping
```typescript
// tailwind.config.ts
colors: {
  'surface-dark':    'var(--color-surface-dark)',
  'surface-mid':     'var(--color-surface-mid)',
  'ivory':           'var(--color-ivory)',
  'champagne':       'var(--color-champagne)',
  'gold-primary':    'var(--color-gold-primary)',
  'gold-light':      'var(--color-gold-light)',
  'gold-muted':      'var(--color-gold-muted)',
  'text-on-dark':    'var(--color-text-on-dark)',
  'text-on-light':   'var(--color-text-on-light)',
  'text-muted':      'var(--color-text-muted)',
  'border-dark':     'var(--color-border-dark)',
  'border-light':    'var(--color-border-light)',
  'in-stock':        'var(--color-in-stock)',
  'made-to-order':   'var(--color-made-to-order)',
  'unavailable':     'var(--color-unavailable)',
}
```

### Contrast requirements (WCAG 2.1 AA)
Verify these pairs before using them. All meet the 4.5:1 minimum for body text.

| Text token              | Background token       | Ratio   | Status |
|-------------------------|------------------------|---------|--------|
| `--color-text-on-dark`  | `--color-surface-dark` | ≥ 4.5:1 | ✅ Required |
| `--color-text-on-light` | `--color-ivory`        | ≥ 4.5:1 | ✅ Required |
| `--color-gold-primary`  | `--color-surface-dark` | ≥ 3.0:1 | ✅ Large text only |
| `--color-text-muted`    | `--color-surface-dark` | Verify  | ⚠️ Check before use |

**Do not use `--color-text-muted` for body text — only captions and labels.**

### Forbidden colour patterns
- ❌ Purple gradients on any background
- ❌ Solid blue `#0070f3` or any default Next.js/Vercel blue
- ❌ Raw hex values in JSX className or inline styles
- ❌ White (`#FFFFFF`) as a primary background — use `--color-ivory` instead

---

## 2. TYPOGRAPHY

Fonts are loaded via `next/font` in `app/layout.tsx`. Zero external font requests.
No CDN. No `<link rel="stylesheet">` in the document head.

```typescript
// app/layout.tsx
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

// Apply both variables to <html>
<html className={`${displayFont.variable} ${bodyFont.variable}`}>
```

**Acceptable display font alternatives** (if Cormorant Garamond is unavailable):
- Playfair Display
- Libre Baskerville
- EB Garamond

**Acceptable body font alternatives** (if DM Sans is unavailable):
- Plus Jakarta Sans
- Outfit
- Nunito

**Forbidden fonts (from AGENTS.md Section 3 and PRD Section 9):**
- ❌ Arial
- ❌ Inter
- ❌ Roboto
- ❌ Helvetica
- ❌ System UI / `system-ui`
- ❌ Any font loaded via `<link>` tag or `@import` in CSS

### Type scale
```css
/* styles/globals.css — extend as needed */
:root {
  --font-size-xs:   0.75rem;    /* 12px — labels, captions */
  --font-size-sm:   0.875rem;   /* 14px — minimum on mobile (accessibility rule) */
  --font-size-base: 1rem;       /* 16px — body copy */
  --font-size-lg:   1.125rem;   /* 18px — lead text */
  --font-size-xl:   1.25rem;    /* 20px — small headings */
  --font-size-2xl:  1.5rem;     /* 24px */
  --font-size-3xl:  1.875rem;   /* 30px */
  --font-size-4xl:  2.25rem;    /* 36px */
  --font-size-5xl:  3rem;       /* 48px — hero headline */
  --font-size-6xl:  3.75rem;    /* 60px — large display */
}
```

**Minimum font size: 14px (`text-sm`) on mobile — accessibility requirement.**

### Typography usage rules
```typescript
// ✅ Display font — headings, hero, product names
<h1 className="font-display text-5xl font-semibold text-gold-primary">

// ✅ Body font — descriptions, UI labels, body copy
<p className="font-body text-base text-text-on-dark leading-relaxed">

// ✅ Price display — always PriceTag component, never raw text
<PriceTag amount={product.price} className="font-display text-xl text-gold-primary" />

// ❌ Never render a price inline
<span>₦{product.price.toLocaleString()}</span>
```

---

## 3. LAYOUT

### Breakpoints (Tailwind defaults — do not override)
```
sm:  640px   — large phones (landscape)
md:  768px   — tablets
lg:  1024px  — small laptops
xl:  1280px  — desktops
2xl: 1536px  — large screens
```

**Design base: 375px** (iPhone SE / small Android). Everything works here first.

### Page structure
```
┌─────────────────────────────────────────┐
│ Header / Navigation                     │ sticky top
├─────────────────────────────────────────┤
│                                         │
│   Page content (max-w-7xl mx-auto px-4) │
│                                         │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
│ FloatingWhatsApp                        │ fixed bottom-right — always visible
```

### Container
```typescript
// Standard content container — use this class composition consistently
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

### Product grid — masonry / Pinterest-style
```typescript
// Mobile: 2 columns | Tablet: 3 columns | Desktop: 4 columns
// Use CSS columns for true masonry — not CSS Grid rows
className="columns-2 md:columns-3 lg:columns-4 gap-4"

// Each card
className="break-inside-avoid mb-4"
```

### Spacing principles
- Generous whitespace — luxury brands breathe
- Sections separated by at least `py-16` (64px) on desktop, `py-10` on mobile
- Card padding: `p-4` minimum, `p-6` preferred
- No cramped layouts — when in doubt, add more space

### Floating WhatsApp button — position rules
```typescript
// Fixed position — never moves regardless of scroll
className="fixed bottom-6 right-6 z-50"

// Size: large enough to tap on mobile (minimum 44×44px touch target)
className="w-14 h-14 rounded-full flex items-center justify-center"

// Colour: gold on dark, high contrast
className="bg-gold-primary hover:bg-gold-light text-surface-dark"

// Must never be obscured by other fixed elements
```

---

## 4. COMPONENTS — VISUAL RULES

### ProductCard
- Image occupies full card width — no fixed aspect ratio enforcement in CSS (let masonry breathe)
- Product name: `font-display text-lg font-medium`
- Price: always `<PriceTag>` — never raw text
- Occasion tag: small pill, `bg-gold-muted/20 text-gold-primary text-xs`
- On hover: subtle scale `hover:scale-[1.02] transition-transform duration-300`
- No heavy box shadows — luxury feel is flat with subtle border

### Hero section
- Full viewport height on desktop (`min-h-screen`), natural height on mobile
- Background: `bg-surface-dark` with optional editorial product image
- Headline: `font-display text-5xl lg:text-6xl text-gold-primary`
- Subheadline: `font-body text-lg text-text-on-dark/80 max-w-xl`
- CTA buttons: primary (gold fill) + secondary (ghost/outline)

### WhatsApp CTA button — all instances
```typescript
// Primary (filled) — used in hero and product detail
className="bg-gold-primary hover:bg-gold-light text-surface-dark
           font-body font-medium px-6 py-3 transition-colors duration-200"

// Floating — always visible in corner
className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
           bg-gold-primary hover:bg-gold-light shadow-lg
           flex items-center justify-center transition-colors duration-200"
// aria-label="Chat with us on WhatsApp"
```

### Category filter tabs
- Horizontal scroll on mobile — no line wrap
- Active state: `bg-gold-primary text-surface-dark`
- Inactive state: `bg-surface-mid text-text-muted hover:text-text-on-dark`
- No underline tabs — pill shape only

---

## 5. IMAGERY

### Next.js `<Image>` rules
- Always provide `alt` — descriptive, includes product name and category
- Hero image: `priority={true}` — preloaded
- All other images: `priority={false}` (default lazy loading)
- Use `sizes` prop on all images to prevent oversized image downloads

```typescript
// ✅ Product card image
<Image
  src={imageUrl}
  alt={`${productName} — ${categoryName} by Photoframes by VF`}
  fill
  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
  className="object-cover"
/>

// ❌ Missing alt or generic alt
<Image src={imageUrl} alt="" />
<Image src={imageUrl} alt="product image" />
```

### `ImageWithFallback` component
Wraps `<Image>` with `onError` handling. When an image fails to load, it
replaces the `src` with `/public/fallback-product.jpg` — the branded placeholder.
This component is required for all product images. Never use raw `<Image>` for
product photography.

```typescript
// Usage
<ImageWithFallback
  src={product.imageUrl}
  alt={`${product.name} — ${product.category}`}
  fill
  sizes="..."
/>
```

### Image format
- Sanity serves images optimised via its CDN — always use Sanity image URLs
  with `?w=800&fm=webp&q=80` query params (or Sanity's `@sanity/image-url` builder)
- Next.js `<Image>` handles final format negotiation for the browser

---

## 6. ACCESSIBILITY (WCAG 2.1 AA)

These are requirements from PRD Section 8.2. They are not optional.

### Contrast
- Body text: ≥ 4.5:1 against background
- Large text (≥ 18px bold or ≥ 24px regular): ≥ 3:1 against background
- UI components (buttons, inputs, icons): ≥ 3:1

### Focus management
```css
/* styles/globals.css — visible focus ring on all interactive elements */
:focus-visible {
  outline: 2px solid var(--color-gold-primary);
  outline-offset: 2px;
}

/* Remove only the default outline — never remove focus styles entirely */
:focus:not(:focus-visible) {
  outline: none;
}
```

### ARIA requirements
```typescript
// Floating WhatsApp — must have aria-label
<a aria-label="Chat with us on WhatsApp" href={buildWhatsAppUrl('general')}>

// Category filter tabs — must convey active state
<button aria-pressed={isActive} aria-label={`Filter by ${category.name}`}>

// Star rating — must be readable by screen readers
<div role="img" aria-label={`Rated ${rating} out of 5 stars`}>

// Image fallback — must not expose empty alt
<ImageWithFallback alt={`${product.name} — ${product.category}`} />
```

### Keyboard navigation
- All interactive elements reachable via Tab key
- Logical tab order — no positive `tabIndex` values
- Category filter is keyboard-navigable (arrow keys preferred for tab groups)
- Modal/drawer close on Escape key if any modals are added

### Touch targets
- Minimum 44×44px for all tappable elements (Apple HIG + WCAG 2.5.5)
- Floating WhatsApp button: 56×56px (Tailwind `w-14 h-14`)
- Product cards: full card is tappable, not just the text

### Font size
- Minimum 14px (`text-sm`) on mobile — enforced via Tailwind config
```typescript
// tailwind.config.ts
theme: {
  extend: {
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],    // 12px — captions only
      'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px — minimum body
    }
  }
}
```

---

## 7. MOTION & ANIMATION

Luxury aesthetic = restraint. Less is more.

### Permitted animations
- Product card hover: `hover:scale-[1.02] transition-transform duration-300`
- Button hover: `transition-colors duration-200`
- Page transitions: subtle fade (if using Framer Motion — keep under 300ms)
- Floating WhatsApp: subtle pulse on load to draw attention (one time only)

### Forbidden animations
- ❌ Parallax scrolling
- ❌ Scroll-jacking (overriding native scroll behaviour)
- ❌ Continuous looping animations that play without user interaction
- ❌ Animations longer than 400ms
- ❌ Entrance animations that delay content visibility

### Reduced motion
```css
/* styles/globals.css — always respect user preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
