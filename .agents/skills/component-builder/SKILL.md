# Component Builder Skill — Photoframes by VF

## Purpose

Create reusable React components for Photoframes by VF following PRD v2.0 and AGENTS.md specifications.

---

## Core Components

### 1. ProductCard Component

**Path:** `components/product/ProductCard.tsx`

```tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { formatNaira } from '@/lib/format';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

interface ProductCardProps {
  product: {
    slug: string;
    name: string;
    price: number;
    images: Array<{ asset: { url: string } }>;
    category: { name: string; slug: string };
  };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWhatsAppClick = async () => {
    setIsLoading(true);
    await trackEvent({
      type: 'whatsapp_click',
      inquiryType: 'product_specific',
      productSlug: product.slug,
      categorySlug: product.category.slug,
    });
    const url = await buildWhatsAppUrl('product_specific', {
      productName: product.name,
      productCategory: product.category.name,
    });
    window.open(url, '_blank');
    setIsLoading(false);
  };

  return (
    <div className="group relative">
      <div className="aspect-square overflow-hidden bg-surface-secondary">
        <Image
          src={product.images[0]?.asset.url}
          alt={product.name}
          width={800}
          height={800}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
        />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-heading text-lg text-text-on-dark">{product.name}</h3>
        <p className="text-accent-primary">{formatNaira(product.price)}</p>
        <button
          onClick={handleWhatsAppClick}
          disabled={isLoading}
          className="mt-2 text-sm text-accent-primary underline underline-offset-4 transition-opacity hover:opacity-70 disabled:opacity-50"
          aria-label={`Inquire about ${product.name} on WhatsApp`}
        >
          {isLoading ? 'Loading...' : 'Inquire on WhatsApp →'}
        </button>
      </div>
    </div>
  );
}
```

---

### 2. FloatingWhatsAppButton Component

**Path:** `components/layout/FloatingWhatsAppButton.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function FloatingWhatsAppButton() {
  const [waUrl, setWaUrl] = useState<string>('#');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    buildWhatsAppUrl('general').then(url => {
      setWaUrl(url);
      setIsLoading(false);
    });
  }, []);

  const handleClick = async () => {
    await trackEvent({
      type: 'whatsapp_click',
      inquiryType: 'general',
    });
  };

  if (isLoading) return null;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary shadow-lg transition-transform hover:scale-105 focus:ring-2 focus:ring-accent-light focus:outline-none"
      aria-label="Chat with us on WhatsApp"
    >
      <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.614-.916-2.21-.242-.58-.485-.533-.669-.533-.148 0-.297-.025-.446-.025-.148 0-.396.05-.594.248-.198.198-.757.74-.757 1.806 0 1.066.777 2.095.884 2.24.107.145 1.527 2.332 3.7 3.271.517.223.921.357 1.236.457.52.16.992.138 1.366.083.417-.06 1.285-.526 1.466-1.034.18-.508.18-.944.126-1.034-.054-.09-.198-.148-.447-.248z"/>
      </svg>
    </a>
  );
}
```

---

### 3. MasonryGrid Component

**Path:** `components/ui/MasonryGrid.tsx`

```tsx
import { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode[];
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
}

export function MasonryGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'gap-6'
}: MasonryGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const colClass = gridCols[columns.desktop as keyof typeof gridCols] || gridCols[3];

  return (
    <div className={`grid ${colClass} ${gap}`}>
      {children}
    </div>
  );
}
```

---

### 4. ImageWithFallback Component

**Path:** `components/ui/ImageWithFallback.tsx`

```tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  fallbackSrc = '/fallback-product.jpg', 
  width, 
  height, 
  className = '',
  priority = false
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}
```

---

### 5. CategoryFilter Component

**Path:** `components/product/CategoryFilter.tsx`

```tsx
'use client';

import { trackEvent } from '@/lib/analytics';

interface Category {
  slug: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
}

export function CategoryFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  const handleClick = async (slug: string | null) => {
    if (slug) {
      await trackEvent({ type: 'category_click', categorySlug: slug });
    }
    onCategoryChange(slug);
  };

  return (
    <div className="flex flex-wrap gap-3 border-b border-border pb-4">
      <button
        onClick={() => handleClick(null)}
        className={`px-4 py-2 text-sm transition-colors ${
          activeCategory === null
            ? 'border-b-2 border-accent-primary text-accent-primary'
            : 'text-text-muted hover:text-text-on-dark'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.slug}
          onClick={() => handleClick(category.slug)}
          className={`px-4 py-2 text-sm transition-colors ${
            activeCategory === category.slug
              ? 'border-b-2 border-accent-primary text-accent-primary'
              : 'text-text-muted hover:text-text-on-dark'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
```

---

### 6. TestimonialCarousel Component

**Path:** `components/testimonial/TestimonialCarousel.tsx`

```tsx
'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/format';

interface Testimonial {
  id: string;
  customerName: string;
  location?: string;
  productType?: string;
  reviewText: string;
  rating: number;
  date?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[index];
  if (!t) return null;

  return (
    <div className="relative px-4 py-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-xl ${i < t.rating ? 'text-accent-primary' : 'text-border'}`}>
              ★
            </span>
          ))}
        </div>
        <p className="text-lg italic text-text-on-dark">"{t.reviewText}"</p>
        <p className="mt-4 font-heading text-text-on-dark">{t.customerName}</p>
        {(t.location || t.productType) && (
          <p className="text-sm text-text-muted">
            {t.location} • {t.productType}
          </p>
        )}
        {t.date && <p className="text-xs text-text-muted">{formatDate(t.date)}</p>}
      </div>
      
      {testimonials.length > 1 && (
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={prev} className="text-accent-primary hover:opacity-70" aria-label="Previous">
            ← Previous
          </button>
          <button onClick={next} className="text-accent-primary hover:opacity-70" aria-label="Next">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### 7. WhatsAppButton (Reusable)

**Path:** `components/ui/WhatsAppButton.tsx`

```tsx
'use client';

import { useState } from 'react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

interface WhatsAppButtonProps {
  type?: 'product_specific' | 'general' | 'corporate';
  productName?: string;
  productCategory?: string;
  className?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({ 
  type = 'general', 
  productName, 
  productCategory, 
  className = '',
  children 
}: WhatsAppButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await trackEvent({
      type: 'whatsapp_click',
      inquiryType: type,
      ...(productName && { productSlug: productName.toLowerCase().replace(/\s+/g, '-') }),
    });
    const url = await buildWhatsAppUrl(type, { productName, productCategory });
    window.open(url, '_blank');
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-white transition-colors hover:bg-accent-light disabled:opacity-50 ${className}`}
      aria-label="Chat on WhatsApp"
    >
      {isLoading ? 'Loading...' : (children || 'Chat on WhatsApp')}
    </button>
  );
}
```

---

## Component Checklist

When creating a new component:

- [ ] Add `'use client'` if using hooks or interactivity
- [ ] Define TypeScript props interface
- [ ] Use Tailwind CSS classes only (no custom CSS)
- [ ] Add proper `aria` labels for interactive elements
- [ ] Implement loading/error states where applicable
- [ ] Test on mobile viewport (375px)
- [ ] Ensure focus states are visible (`focus:ring-2`)
- [ ] Use shared utilities (`formatNaira`, `buildWhatsAppUrl`, `trackEvent`)
- [ ] Lazy-load images below fold with `loading="lazy"`
- [ ] All images have descriptive `alt` text

---

## Prohibited Patterns

| ❌ Never | ✅ Instead |
|----------|-----------|
| Hardcode WhatsApp number | Use `buildWhatsAppUrl()` |
| Inline price strings | Use `formatNaira()` |
| Missing alt text | Always add descriptive alt |
| `dangerouslySetInnerHTML` | Use Sanity Portable Text |
| Generic fonts (Arial, Inter) | Use brand fonts via `font-heading`/`font-body` |
