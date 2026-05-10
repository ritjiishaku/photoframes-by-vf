# WhatsApp Inquiry Builder Skill — Photoframes by VF

## Purpose

Generate WhatsApp deep links (`wa.me`) with pre-filled messages per PRD v2.0 Section 6.2. This is the **single source of truth** for all WhatsApp links in the application.

---

## Message Templates (PRD Section 6.2)

### 1. Product-Specific Inquiry

```
Hello! I'm interested in [Product Name] (Category: [Category]). Could you share more details, availability, and pricing? Thank you.
```

### 2. General Inquiry

```
Hello! I came across Photoframes by VF and would love to know more about your products. Could you help me?
```

### 3. Corporate/Bulk Inquiry

```
Hello! I'm interested in bulk/corporate orders from Photoframes by VF. Could we discuss options and pricing?
```

---

## Implementation

**Path:** `lib/whatsapp.ts`

```typescript
import { client } from '@/lib/sanity/client';

type InquiryType = 'product_specific' | 'general' | 'corporate';

interface WhatsAppContext {
  productName?: string;
  productCategory?: string;
}

// Cache with 5-minute TTL to avoid repeated Sanity calls
let cachedNumber: string | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch WhatsApp number from Sanity siteSettings
 * Results are cached for 5 minutes to reduce API calls
 */
async function getWhatsAppNumber(): Promise<string> {
  // Return cached number if still fresh
  if (cachedNumber && Date.now() - cacheTime < CACHE_TTL) {
    return cachedNumber;
  }
  
  // Fetch from Sanity
  const query = `*[_type == 'siteSettings'][0]{ whatsappNumber }`;
  const data = await client.fetch(query);
  
  if (!data?.whatsappNumber) {
    throw new Error('WhatsApp number not found in Sanity siteSettings');
  }
  
  // Validate format
  const phoneRegex = /^\+234\d{10}$/;
  if (!phoneRegex.test(data.whatsappNumber)) {
    throw new Error('WhatsApp number must be in +234XXXXXXXXXX format');
  }
  
  // Update cache
  cachedNumber = data.whatsappNumber;
  cacheTime = Date.now();
  return cachedNumber;
}

/**
 * Get the pre-filled message template based on inquiry type
 */
function getMessageTemplate(type: InquiryType, context?: WhatsAppContext): string {
  switch (type) {
    case 'product_specific':
      return `Hello! I'm interested in ${context?.productName ?? 'one of your products'}${
        context?.productCategory ? ` (${context.productCategory})` : ''
      }. Could you share more details, availability, and pricing? Thank you.`;
    
    case 'general':
      return "Hello! I came across Photoframes by VF and would love to know more about your products. Could you help me?";
    
    case 'corporate':
      return "Hello! I'm interested in bulk/corporate orders from Photoframes by VF. Could we discuss options and pricing?";
    
    default:
      return "Hello! I came across Photoframes by VF and would love to know more about your products. Could you help me?";
  }
}

/**
 * Build a WhatsApp deep link with pre-filled message
 * 
 * @example
 * // Product-specific link
 * const url = await buildWhatsAppUrl('product_specific', {
 *   productName: 'Gold Layered Necklace',
 *   productCategory: 'Gold Jewellery'
 * });
 * // Returns: https://wa.me/2348123456789?text=Hello%21%20I%27m%20interested...
 * 
 * @example
 * // General inquiry link
 * const url = await buildWhatsAppUrl('general');
 * 
 * @example
 * // Corporate inquiry link
 * const url = await buildWhatsAppUrl('corporate');
 */
export async function buildWhatsAppUrl(
  type: InquiryType,
  context?: WhatsAppContext
): Promise<string> {
  const number = await getWhatsAppNumber();
  const cleanNumber = number.replace('+', ''); // wa.me requires no + prefix
  const message = getMessageTemplate(type, context);
  const encoded = encodeURIComponent(message);
  
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}

/**
 * Get just the WhatsApp number (useful for fallback display)
 */
export async function getWhatsAppNumberOnly(): Promise<string> {
  return getWhatsAppNumber();
}

/**
 * Clear the cached WhatsApp number (useful after admin updates)
 */
export function clearWhatsAppCache(): void {
  cachedNumber = null;
  cacheTime = 0;
}
```

---

## Usage Examples

### In ProductCard Component

```tsx
'use client';

import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function ProductCard({ product }) {
  const handleWhatsAppClick = async () => {
    // Track the conversion event
    await trackEvent({
      type: 'whatsapp_click',
      inquiryType: 'product_specific',
      productSlug: product.slug,
    });
    
    // Build and open WhatsApp link
    const url = await buildWhatsAppUrl('product_specific', {
      productName: product.name,
      productCategory: product.category.name,
    });
    window.open(url, '_blank');
  };

  return (
    <button onClick={handleWhatsAppClick}>
      Inquire on WhatsApp →
    </button>
  );
}
```

### In Floating WhatsApp Button

```tsx
'use client';

import { useEffect, useState } from 'react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function FloatingWhatsAppButton() {
  const [waUrl, setWaUrl] = useState<string>('#');

  useEffect(() => {
    buildWhatsAppUrl('general').then(setWaUrl);
  }, []);

  return (
    <a href={waUrl} target="_blank" rel="noopener noreferrer">
      {/* WhatsApp icon */}
    </a>
  );
}
```

### Corporate Inquiry Page

```tsx
'use client';

import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function CorporateInquiryButton() {
  const handleClick = async () => {
    const url = await buildWhatsAppUrl('corporate');
    window.open(url, '_blank');
  };

  return <button onClick={handleClick}>Corporate Order Inquiry</button>;
}
```

---

## Fallback Behaviour (PRD Section 11)

If the WhatsApp link generation fails, display the phone number as visible text:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { buildWhatsAppUrl, getWhatsAppNumberOnly } from '@/lib/whatsapp';

export function WhatsAppButtonWithFallback() {
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      buildWhatsAppUrl('general').catch(() => null),
      getWhatsAppNumberOnly().catch(() => null),
    ]).then(([url, number]) => {
      if (url) {
        setWaUrl(url);
      } else if (number) {
        setPhoneNumber(number);
        setError(true);
      } else {
        setError(true);
      }
    });
  }, []);

  if (waUrl) {
    return <a href={waUrl}>Chat on WhatsApp</a>;
  }

  if (phoneNumber) {
    return <a href={`tel:${phoneNumber}`}>Call {phoneNumber}</a>;
  }

  return <p>WhatsApp: Please contact us via Instagram</p>;
}
```

---

## Testing URLs

### Expected Output Examples

| Input | Output |
|-------|--------|
| `buildWhatsAppUrl('general')` | `https://wa.me/2348123456789?text=Hello%21%20I%20came%20across...` |
| `buildWhatsAppUrl('product_specific', { productName: 'Gold Necklace', productCategory: 'Jewellery' })` | `https://wa.me/2348123456789?text=Hello%21%20I%27m%20interested%20in%20Gold%20Necklace%20(Jewellery)...` |
| `buildWhatsAppUrl('corporate')` | `https://wa.me/2348123456789?text=Hello%21%20I%27m%20interested%20in%20bulk%2Fcorporate%20orders...` |

---

## Validation Rules

| Rule | Implementation |
|------|----------------|
| WhatsApp number format | Must match `+234XXXXXXXXXX` |
| Message length | No hard limit, but URL encoding handles any length |
| Special characters | Automatically URL-encoded |

---

## Error Handling

| Error Scenario | Handling |
|----------------|----------|
| Sanity fetch fails | Throw error with clear message |
| WhatsApp number missing | Throw `WhatsApp number not found in Sanity` |
| Invalid phone format | Throw `WhatsApp number must be in +234XXXXXXXXXX format` |
| Network failure | Component should show fallback (Section 11) |

---

## Integration Checklist

- [ ] WhatsApp number stored in Sanity `siteSettings` document
- [ ] Number validated with regex `/^\+234\d{10}$/` in Sanity schema
- [ ] `buildWhatsAppUrl()` used everywhere — no inline `wa.me` links
- [ ] Fallback implemented per PRD Section 11
- [ ] Analytics tracking calls `trackEvent` before opening WhatsApp
- [ ] Cache TTL configured (5 minutes default)

---

## Prohibited Patterns

| ❌ Never | ✅ Instead |
|----------|-----------|
| `https://wa.me/2348123456789?text=Hello` | `await buildWhatsAppUrl('general')` |
| `const number = '+2348123456789'` | `const number = await getWhatsAppNumber()` |
| Hardcoded WhatsApp in env var | Fetch from Sanity at runtime |
| Inline URL construction | Use `buildWhatsAppUrl()` utility |
