# code-style.md
# Photoframes by VF — Code Style Rules
# Source: AGENTS.md Section 3, PRD v2.0 Sections 8–9
# Every file written for this project must follow these rules.

---

## 1. TYPESCRIPT

- **Strict mode required.** `tsconfig.json` must have `"strict": true`.
- No `any` types — ever. Use `unknown` and narrow it properly.
- No `@ts-ignore` or `@ts-expect-error` — fix the type, don't suppress it.
- All function parameters and return types must be explicitly typed.
- Prefer `interface` over `type` for object shapes. Use `type` for unions and
  utility types.
- Export types from `lib/sanity/types.ts` (Sanity data) and define local types
  inline only when they are not reused.

```typescript
// ✅ Correct
interface ProductCardProps {
  name: string;
  price: number;           // raw number — PriceTag formats it
  slug: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
}

// ❌ Wrong — untyped, unsafe
const ProductCard = ({ name, price, ...rest }: any) => { ... }
```

---

## 2. REACT & NEXT.JS

### Component conventions
- One component per file. Filename matches component name exactly.
- Use named exports — not default exports — for all components.
  Exception: Next.js pages and layouts must use default exports (framework requirement).
- `'use client'` must only appear on leaf components that require browser APIs
  or event handlers. Never on page-level components.

```typescript
// ✅ Named export for components
export function ProductCard({ name, price }: ProductCardProps) { ... }

// ✅ Default export for Next.js pages only
export default function ProductPage() { ... }
```

### Props
- Never pass a raw WhatsApp URL as a prop. `WhatsAppButton` calls `buildWhatsAppUrl()` internally.
- Never pass a raw price string as a prop. Pass `price: number` and let `PriceTag` format it.
- Never pass a raw date string for display. Pass `Date | string` and let `formatDate()` handle it.

### State
- Use `useState` and `useReducer` for local component state.
- Use React Context for cross-tree state (e.g. active category filter).
- No Redux. No Zustand. No Jotai.

---

## 3. TAILWIND CSS — THE ONLY STYLING METHOD

Tailwind utility classes are the only permitted styling mechanism.

```typescript
// ✅ Correct — Tailwind only
<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

// ❌ Wrong — no inline styles
<div style={{ display: 'grid', gap: '1rem' }}>

// ❌ Wrong — no CSS Modules
import styles from './ProductGrid.module.css';

// ❌ Wrong — no styled-components
const Grid = styled.div`display: grid;`
```

### Tailwind class ordering
Follow the Prettier Tailwind plugin order:
1. Layout (display, position, z-index)
2. Sizing (w-, h-, max-w-)
3. Spacing (p-, m-)
4. Typography (font-, text-, leading-)
5. Colours (bg-, text-, border-)
6. Effects (shadow-, opacity-, transition-)
7. Responsive prefixes last (sm:, md:, lg:)

### Design tokens in Tailwind
CSS variables from `styles/globals.css` are extended into `tailwind.config.ts`.
Always use semantic token names — not raw hex values.

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      'surface-dark':  'var(--color-surface-dark)',
      'surface-mid':   'var(--color-surface-mid)',
      'gold-primary':  'var(--color-gold-primary)',
      'gold-light':    'var(--color-gold-light)',
      'ivory':         'var(--color-ivory)',
      'champagne':     'var(--color-champagne)',
    },
    fontFamily: {
      display: ['var(--font-display)', 'serif'],
      body:    ['var(--font-body)', 'sans-serif'],
    },
  }
}

// ✅ In components — semantic tokens
<div className="bg-surface-dark text-gold-primary font-display">

// ❌ In components — raw hex
<div className="bg-[#111111] text-[#C9A96E]">
```

---

## 4. REQUIRED UTILITY FUNCTIONS

These are the only permitted way to perform these operations.
Import from the specified path — do not reimplement inline.

| Operation              | Import                               | Function                          |
|------------------------|--------------------------------------|-----------------------------------|
| Format price           | `lib/format.ts`                      | `formatNaira(amount: number)`     |
| Format date            | `lib/format.ts`                      | `formatDate(date: Date \| string)` |
| Validate phone         | `lib/format.ts`                      | `isValidNigerianPhone(phone)`     |
| Build WhatsApp URL     | `lib/whatsapp.ts`                    | `buildWhatsAppUrl(type, context)` |
| Track analytics event  | `lib/analytics.ts`                   | `trackEvent(event)`               |
| Fetch Sanity data      | `lib/sanity/queries.ts`              | Named query functions only        |
| Execute SQL            | `lib/db/queries.ts`                  | Named query functions only        |

**If a function for the job doesn't exist yet, add it to the correct `lib/` file.
Never write the logic inline in a component or route.**

---

## 5. IMPORTS — ORDER AND STYLE

```typescript
// 1. React / Next.js framework
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 2. Third-party packages
import { PortableText } from '@portabletext/react';

// 3. Internal lib utilities
import { formatNaira } from '@/lib/format';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

// 4. Internal types
import type { Product } from '@/lib/sanity/types';

// 5. Components
import { PriceTag } from '@/components/ui/PriceTag';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

// 6. Styles (rarely needed with Tailwind)
```

Use `@/` path alias for all internal imports — never relative `../../`.

---

## 6. FILE NAMING

| Type                   | Convention                    | Example                        |
|------------------------|-------------------------------|--------------------------------|
| React components       | PascalCase                    | `ProductCard.tsx`              |
| Utility/lib files      | camelCase                     | `format.ts`, `whatsapp.ts`     |
| Next.js pages/layouts  | lowercase (`page`, `layout`)  | `page.tsx`, `layout.tsx`       |
| API routes             | lowercase (`route`)           | `route.ts`                     |
| Sanity schemas         | camelCase                     | `product.ts`, `siteSettings.ts`|
| SQL migrations         | numbered prefix               | `001_initial.sql`              |
| Config files           | lowercase with dots           | `tailwind.config.ts`           |

---

## 7. ERROR HANDLING

```typescript
// ✅ API routes — always return structured errors
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // ...
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[/api/analytics] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ Analytics — always fail silently so UX is never disrupted
export async function trackEvent(event: TrackableEvent): Promise<void> {
  try {
    await fetch('/api/analytics', { method: 'POST', body: JSON.stringify(event) });
  } catch {
    // intentionally silent
  }
}

// ✅ Missing env vars — fail loudly at startup, not silently at runtime
const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
if (!number) throw new Error(
  'NEXT_PUBLIC_WHATSAPP_NUMBER is not set. Check .env.local and .env.example.'
);
```

---

## 8. PROHIBITED PATTERNS

Hard stops. If you see any of these in the codebase, fix them before continuing.

```typescript
// ❌ Hardcoded WhatsApp number
href="https://wa.me/2348012345678"

// ❌ Inline price formatting
<span>₦{(25000).toLocaleString()}</span>

// ❌ Inline date formatting
<span>{new Date(date).toLocaleDateString()}</span>

// ❌ Inline GROQ query
const data = await client.fetch(`*[_type == "product"]{ name, price }`);

// ❌ Inline SQL
const result = await db.query(`SELECT * FROM analytics_events WHERE event_type = '${type}'`);

// ❌ dangerouslySetInnerHTML with any string
<div dangerouslySetInnerHTML={{ __html: adminContent }} />

// ❌ any type
const handleClick = (e: any) => { ... }

// ❌ Inline style
<div style={{ color: '#C9A96E' }}>

// ❌ Forbidden fonts in any className or CSS
className="font-inter"  // Inter is forbidden
className="font-arial"  // Arial is forbidden

// ❌ price stored as string
const product = { price: '₦25,000' }  // must be { price: 25000 }
```

---

## 9. COMMENTS & DOCUMENTATION

- All `lib/` utility functions must have a JSDoc comment explaining inputs,
  outputs, and any side effects.
- All Sanity schema fields must have a `description` string for Fechi (the
  non-technical admin) — written in plain English, not developer jargon.
- All PostgreSQL columns must have an inline comment explaining their purpose.
- Component files do not need comments unless the logic is non-obvious.

```typescript
/**
 * Formats a raw number as Nigerian Naira currency.
 * @param amount - price in Naira as a plain integer (e.g. 25000)
 * @returns formatted string (e.g. "₦25,000")
 */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}
```

---

## 10. PRE-COMMIT CHECKLIST

Run these before every commit:

```bash
# Type check
npx tsc --noEmit

# Lint
npx eslint . --ext .ts,.tsx

# Security audit
npm audit --audit-level=high

# Confirm no secrets in staged files
git diff --staged | grep -E 'SANITY_API_TOKEN|DATABASE_URL|WHATSAPP_NUMBER'
# If anything appears — STOP. Do not commit.
```
