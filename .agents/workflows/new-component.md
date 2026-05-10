Here is the `workflows/new-component.md` file:

```markdown
# Workflow: New Component

## Purpose

Standardized process for creating a new React component for Photoframes by VF.

---

## When to Use

- Creating a new UI component in `components/` directory
- Adding interactive elements (buttons, forms, cards)
- Building page sections (hero, gallery, testimonials)

---

## Step 1: Define Component Requirements

Before writing code, answer these questions:

| Question | Answer |
|----------|--------|
| What is the component's purpose? | |
| Does it need to be interactive? | Yes / No |
| Will it fetch data from Sanity? | Yes / No |
| Does it need `'use client'`? | Yes / No |
| What props does it accept? | List them |
| Is this in PRD Section 6.1? | Yes / No |

**If component matches an existing design in PRD Section 6.1, reference it directly.**

---

## Step 2: Choose Component Location

| Type | Location | Example |
|------|----------|---------|
| Layout | `components/layout/` | Header, Footer, FloatingWhatsAppButton |
| Product | `components/product/` | ProductCard, ProductGrid, CategoryFilter |
| Homepage | `components/home/` | Hero, FeaturedCategories, TestimonialsPreview |
| UI (reusable) | `components/ui/` | Button, ImageWithFallback, MasonryGrid |
| Testimonial | `components/testimonial/` | TestimonialCard, TestimonialCarousel |

---

## Step 3: Create Component File

**Template:**

```tsx
// components/[category]/[ComponentName].tsx

'use client'; // Only add if using useState, useEffect, or event handlers

import { ReactNode } from 'react';

interface ComponentNameProps {
  // Required props first
  title: string;
  
  // Optional props
  className?: string;
  children?: ReactNode;
  onAction?: () => void;
}

export function ComponentName({ 
  title, 
  className = '', 
  children,
  onAction 
}: ComponentNameProps) {
  return (
    <div className={`container mx-auto px-4 ${className}`}>
      <h2 className="font-heading text-2xl text-text-on-dark">{title}</h2>
      {children}
    </div>
  );
}
```

---

## Step 4: Follow Code Style Rules

### TypeScript Requirements

```typescript
// ✅ Correct
interface Props {
  product: ProductType;
  onSelect: (id: string) => void;
}

// ❌ Incorrect
const props = any;
```

### Styling Rules

```tsx
// ✅ Correct — Tailwind only
<div className="flex gap-4 bg-surface-primary p-6">

// ❌ Incorrect — custom CSS or inline styles
<div style={{ display: 'flex' }} className="my-custom-class">
```

### Font Rules

```tsx
// ✅ Correct
<h1 className="font-heading text-3xl">Heading</h1>
<p className="font-body text-base">Body text</p>

// ❌ Incorrect — prohibited fonts
<h1 className="font-arial">Heading</h1>
```

### Color Rules

```tsx
// ✅ Correct — use CSS variables via Tailwind
<div className="bg-surface-primary text-text-on-dark">
<p className="text-accent-primary">

// ❌ Incorrect — hardcoded colors
<div className="bg-black text-white">
```

---

## Step 5: Add Required Features by Component Type

### For ProductCard

```tsx
import { formatNaira } from '@/lib/format';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/lib/analytics';
import Image from 'next/image';

// Price display
<p className="text-accent-primary">{formatNaira(product.price)}</p>

// WhatsApp inquiry
const handleWhatsApp = async () => {
  await trackWhatsAppClick('product_specific', product.slug);
  const url = await buildWhatsAppUrl('product_specific', {
    productName: product.name,
    productCategory: product.category.name,
  });
  window.open(url, '_blank');
};

// Lazy-loaded image
<Image src={src} alt={alt} loading="lazy" width={400} height={400} />
```

### For WhatsApp Button

```tsx
'use client';

import { useState } from 'react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function WhatsAppButton({ type = 'general', productName }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await trackEvent({ type: 'whatsapp_click', inquiryType: type });
    const url = await buildWhatsAppUrl(type, { productName });
    window.open(url, '_blank');
    setIsLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={isLoading} className="...">
      {isLoading ? 'Loading...' : 'Chat on WhatsApp'}
    </button>
  );
}
```

### For Image Gallery

```tsx
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

// Always use fallback for broken images
<ImageWithFallback
  src={product.images[0]?.url}
  alt={product.name}
  width={800}
  height={800}
  className="object-cover"
/>
```

### For Category Filter

```tsx
import { trackEvent } from '@/lib/analytics';

const handleCategoryClick = async (slug: string) => {
  await trackEvent({ type: 'category_click', categorySlug: slug });
  onSelect(slug);
};
```

---

## Step 6: Implement Fallbacks (PRD Section 11)

| Scenario | Fallback Implementation |
|----------|------------------------|
| **Image fails to load** | Use `ImageWithFallback` component |
| **WhatsApp link fails** | Display phone number as text |
| **Data is missing/loading** | Show skeleton loader |
| **API error** | Hide section gracefully |

**Example — WhatsApp link fallback:**

```tsx
const [waUrl, setWaUrl] = useState<string | null>(null);
const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

useEffect(() => {
  buildWhatsAppUrl('general')
    .then(setWaUrl)
    .catch(async () => {
      const number = await getWhatsAppNumberOnly();
      setPhoneNumber(number);
    });
}, []);

if (waUrl) {
  return <a href={waUrl}>Chat on WhatsApp</a>;
}
if (phoneNumber) {
  return <a href={`tel:${phoneNumber}`}>Call {phoneNumber}</a>;
}
return <p>Contact us via Instagram</p>;
```

---

## Step 7: Add Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| **Alt text on images** | `<Image alt="Gold necklace on white background" />` |
| **ARIA labels on icons** | `<button aria-label="Close menu">✕</button>` |
| **Focus states** | `focus:ring-2 focus:ring-accent-primary focus:outline-none` |
| **Keyboard navigation** | Tab order matches visual order |
| **Color contrast** | Test with Chrome DevTools → Lighthouse |
| **Minimum font size** | 14px on mobile (Tailwind `text-sm` minimum) |

**Example — accessible button:**

```tsx
<button
  onClick={handleClick}
  className="rounded-lg bg-accent-primary px-4 py-2 text-white transition-colors hover:bg-accent-light focus:ring-2 focus:ring-accent-light focus:outline-none"
  aria-label="Inquire about this product on WhatsApp"
>
  Inquire Now
</button>
```

---

## Step 8: Test the Component

### Mobile Viewport Testing

| Device | Width | Test |
|--------|-------|------|
| iPhone SE | 375px | Layout, touch targets (min 44px) |
| Pixel 5 | 393px | Text readability |
| iPad | 768px | Responsive breakpoints |

### Performance Testing

```bash
# Run Lighthouse in Chrome DevTools
# Target scores:
# - Performance ≥ 85
# - Accessibility ≥ 90
# - Best Practices ≥ 90
# - SEO ≥ 90
```

**Checklist:**

- [ ] Images below fold use `loading="lazy"`
- [ ] Hero/above-fold images use `priority={true}`
- [ ] No render-blocking scripts
- [ ] No large layout shifts (CLS < 0.1)

### Accessibility Testing

- [ ] Tab through component — focus visible on all elements
- [ ] Use screen reader (VoiceOver/NVDA) to test announcements
- [ ] Color contrast passes (≥ 4.5:1 for body text)

---

## Step 9: Export Component

### For Page Components

```tsx
// app/products/page.tsx
export default function ProductsPage() {
  return <ProductGallery />;
}
```

### For Reusable Components

```tsx
// components/product/ProductCard.tsx
export function ProductCard({ product }: ProductCardProps) {
  // ...
}

// components/index.ts (barrel export)
export { ProductCard } from './product/ProductCard';
export { FloatingWhatsAppButton } from './layout/FloatingWhatsAppButton';
```

---

## Step 10: Document Component

Add JSDoc comment at top of file:

```tsx
/**
 * ProductCard - Displays product image, name, price, and WhatsApp inquiry button
 * 
 * @param product - Product object from Sanity containing name, price, images, category
 * @param priority - Whether to eager-load image (for hero/above-fold products)
 * @param className - Optional additional Tailwind classes
 * 
 * @example
 * <ProductCard product={product} priority={true} />
 * 
 * @see PRD Section 6.1 - Product Gallery
 * @see AGENTS.md Section 4 - Architecture
 */
```

---

## Step 11: Commit

```bash
# Add the new component
git add components/[category]/[ComponentName].tsx

# Add barrel export if updated
git add components/index.ts

# Commit with conventional message
git commit -m "feat(components): add [ComponentName] component"
```

**Commit message format:**

- `feat(components):` for new components
- `fix(components):` for bug fixes
- `refactor(components):` for changes without new features

---

## Complete Checklist

Before marking component as complete:

### Code Quality

- [ ] TypeScript interface defined
- [ ] No `any` type without justification
- [ ] Tailwind CSS only (no custom CSS)
- [ ] `'use client'` added if using hooks
- [ ] No hardcoded WhatsApp numbers (use `buildWhatsAppUrl`)
- [ ] No hardcoded price strings (use `formatNaira`)

### Accessibility

- [ ] All images have descriptive `alt` text
- [ ] Interactive elements have `aria-label` where needed
- [ ] Focus states visible (`focus:ring-2`)
- [ ] Keyboard navigation works (Tab, Enter, Space)

### Performance

- [ ] Images lazy-loaded below fold
- [ ] Hero images use `priority={true}`
- [ ] Lighthouse mobile score ≥ 85

### Responsive

- [ ] Tested at 375px (mobile)
- [ ] Tested at 768px (tablet)
- [ ] Tested at 1280px (desktop)

### Fallbacks

- [ ] Image fallback implemented
- [ ] WhatsApp link fallback implemented (per PRD Section 11)

### Documentation

- [ ] JSDoc comment added
- [ ] Props interface documented

---

## Common Mistakes to Avoid

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Using Arial/Inter font | Use `font-heading` or `font-body` |
| Hardcoding `wa.me/234...` | Use `await buildWhatsAppUrl()` |
| `₦${price}` inline | Use `formatNaira(price)` |
| Empty `alt=""` on product images | Add descriptive alt text |
| No focus ring on buttons | Add `focus:ring-2` |
| Client component without `'use client'` | Add directive at top |
| Custom CSS files | Use Tailwind classes |
| Hardcoded breakpoints | Use Tailwind responsive prefixes |

---

## References

| Document | Section | Topic |
|----------|---------|-------|
| PRD v1.0 | Section 6.1 | Core components |
| PRD v1.0 | Section 8.2 | Accessibility |
| PRD v1.0 | Section 11 | Fallbacks |
| AGENTS.md | Section 3 | Absolute rules |
| AGENTS.md | Section 11 | Design system |
| code-style.md | All | Code style rules |
