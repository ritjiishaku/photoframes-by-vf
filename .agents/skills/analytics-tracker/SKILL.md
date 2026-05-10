# Analytics Tracker Skill — Photoframes by VF

## Purpose

Implement analytics tracking per PRD v2.0 Section 13 — WhatsApp clicks, product views, traffic sources, and scroll depth. Events are sent to PostgreSQL via API route.

---

## Trackable Events (PRD Section 13.1)

| Event Type | Trigger | Priority |
|------------|---------|----------|
| `whatsapp_click` | Any WhatsApp button/link tapped | Critical |
| `product_view` | User opens product detail page or card | High |
| `category_click` | User filters or taps product category | High |
| `hero_cta` | 'View Collection' or 'Chat on WhatsApp' in hero | High |
| `instagram_click` | User taps Instagram follow link | Medium |
| `scroll_depth` | User scrolls 25%, 50%, 75%, 100% of page | Medium |

---

## PostgreSQL Schema

**Table:** `analytics_events`

```sql
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(64) NOT NULL,
  product_slug VARCHAR(255),
  category_slug VARCHAR(255),
  inquiry_type VARCHAR(32),
  label VARCHAR(128),
  scroll_depth SMALLINT,
  traffic_source VARCHAR(64),
  session_id VARCHAR(64),
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
```

---

## Client-Side Implementation

**Path:** `lib/analytics.ts`

```typescript
type InquiryType = 'product_specific' | 'general' | 'corporate';

type TrackableEvent =
  | { type: 'whatsapp_click'; inquiryType: InquiryType; productSlug?: string; categorySlug?: string }
  | { type: 'product_view'; productSlug: string; categorySlug?: string }
  | { type: 'category_click'; categorySlug: string }
  | { type: 'hero_cta'; label: 'View Collection' | 'Chat on WhatsApp' }
  | { type: 'instagram_click' }
  | { type: 'scroll_depth'; depth: 25 | 50 | 75 | 100 };

/**
 * Get traffic source from referrer or UTM parameters
 */
function getTrafficSource(): string {
  if (typeof window === 'undefined') return 'direct';
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  if (utmSource) return utmSource;
  
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  
  if (referrer.includes('instagram.com')) return 'instagram';
  if (referrer.includes('google.com')) return 'organic';
  if (referrer.includes('wa.me') || referrer.includes('whatsapp.com')) return 'whatsapp_share';
  if (referrer.includes('facebook.com')) return 'facebook';
  if (referrer.includes('twitter.com')) return 'twitter';
  
  return 'referral';
}

/**
 * Generate or retrieve session ID (persists for entire visit)
 */
let sessionId: string | null = null;

function getSessionId(): string {
  if (sessionId) return sessionId;
  
  // Try to get from sessionStorage first
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('vf_session_id');
    if (stored) {
      sessionId = stored;
      return sessionId;
    }
  }
  
  // Generate new session ID
  sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vf_session_id', sessionId);
  }
  
  return sessionId;
}

/**
 * Track an analytics event
 * Fail silently — analytics never blocks user experience
 */
export async function trackEvent(event: TrackableEvent): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const payload = {
      ...event,
      traffic_source: getTrafficSource(),
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Fail silently — analytics never breaks UX
    console.debug('Analytics error:', error);
  }
}

/**
 * Track page view (product detail)
 * Call this in product page useEffect
 */
export function trackProductView(productSlug: string, categorySlug?: string): void {
  trackEvent({ type: 'product_view', productSlug, categorySlug });
}

/**
 * Track WhatsApp click
 * Call this before opening WhatsApp link
 */
export function trackWhatsAppClick(
  inquiryType: InquiryType,
  productSlug?: string,
  categorySlug?: string
): void {
  trackEvent({ type: 'whatsapp_click', inquiryType, productSlug, categorySlug });
}

/**
 * Track scroll depth
 * Use Intersection Observer or scroll event listener
 */
export function trackScrollDepth(depth: 25 | 50 | 75 | 100): void {
  trackEvent({ type: 'scroll_depth', depth });
}
```

---

## API Route Implementation

**Path:** `app/api/analytics/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/client';

interface AnalyticsPayload {
  type: string;
  product_slug?: string;
  category_slug?: string;
  inquiry_type?: string;
  label?: string;
  depth?: number;
  traffic_source: string;
  session_id: string;
  user_agent: string;
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    const body: AnalyticsPayload = await request.json();
    
    // Basic validation
    if (!body.type || !body.session_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get client IP (for analytics, not PII tracking)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || null;
    
    await sql`
      INSERT INTO analytics_events (
        event_type,
        product_slug,
        category_slug,
        inquiry_type,
        label,
        scroll_depth,
        traffic_source,
        session_id,
        user_agent,
        ip_address,
        created_at
      ) VALUES (
        ${body.type},
        ${body.product_slug || null},
        ${body.category_slug || null},
        ${body.inquiry_type || null},
        ${body.label || null},
        ${body.depth || null},
        ${body.traffic_source},
        ${body.session_id},
        ${body.user_agent},
        ${ip ? ip : null},
        ${new Date(body.timestamp).toISOString()}
      )
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Database Client Setup

**Path:** `lib/db/client.ts`

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export { sql };
```

---

## Usage Examples

### In ProductCard Component

```tsx
'use client';

import { trackWhatsAppClick } from '@/lib/analytics';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function ProductCard({ product }) {
  const handleWhatsAppClick = async () => {
    // Track first
    await trackWhatsAppClick('product_specific', product.slug, product.category.slug);
    
    // Then open WhatsApp
    const url = await buildWhatsAppUrl('product_specific', {
      productName: product.name,
      productCategory: product.category.name,
    });
    window.open(url, '_blank');
  };

  return <button onClick={handleWhatsAppClick}>Inquire on WhatsApp</button>;
}
```

### In Product Detail Page

```tsx
'use client';

import { useEffect } from 'react';
import { trackProductView } from '@/lib/analytics';

export default function ProductPage({ params }) {
  useEffect(() => {
    trackProductView(params.slug);
  }, [params.slug]);
  
  return <div>Product content</div>;
}
```

### In Category Filter

```tsx
'use client';

import { trackEvent } from '@/lib/analytics';

export function CategoryFilter({ categories, onSelect }) {
  const handleCategoryClick = async (slug: string) => {
    await trackEvent({ type: 'category_click', categorySlug: slug });
    onSelect(slug);
  };
  
  return <button onClick={() => handleCategoryClick('acrylic-frames')}>Acrylic Frames</button>;
}
```

### Scroll Depth Tracking

```tsx
'use client';

import { useEffect } from 'react';
import { trackScrollDepth } from '@/lib/analytics';

export function ScrollTracker() {
  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    const tracked = new Set<number>();
    
    const handleScroll = () => {
      const percent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      thresholds.forEach(threshold => {
        if (percent >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          trackScrollDepth(threshold as 25 | 50 | 75 | 100);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return null;
}
```

---

## Reporting Queries

### Monthly WhatsApp CTR

```sql
SELECT 
  COUNT(DISTINCT session_id) as unique_visitors,
  SUM(CASE WHEN event_type = 'whatsapp_click' THEN 1 ELSE 0 END) as whatsapp_clicks,
  ROUND(100.0 * SUM(CASE WHEN event_type = 'whatsapp_click' THEN 1 ELSE 0 END) / COUNT(DISTINCT session_id), 2) as ctr_percentage
FROM analytics_events
WHERE created_at >= date_trunc('month', NOW() - INTERVAL '1 month')
  AND created_at < date_trunc('month', NOW());
```

### Top Product Pages by Views

```sql
SELECT 
  product_slug,
  COUNT(*) as views
FROM analytics_events
WHERE event_type = 'product_view'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY product_slug
ORDER BY views DESC
LIMIT 10;
```

### Traffic Source Breakdown

```sql
SELECT 
  traffic_source,
  COUNT(*) as total_events,
  COUNT(DISTINCT session_id) as unique_visitors
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY traffic_source
ORDER BY unique_visitors DESC;
```

---

## Integration Checklist

- [ ] PostgreSQL `analytics_events` table created
- [ ] `DATABASE_URL` environment variable set
- [ ] `/api/analytics` route implemented
- [ ] `trackEvent()` called on every WhatsApp click
- [ ] `trackProductView()` called on product detail pages
- [ ] `trackEvent()` for category clicks implemented
- [ ] Scroll depth tracking initialized on all pages
- [ ] Traffic source attribution working
- [ ] Session ID persists across page navigation
- [ ] Analytics failures fail silently (no UX impact)

---

## Prohibited Patterns

| ❌ Never | ✅ Instead |
|----------|-----------|
| Block UI on analytics failure | Fail silently with try/catch |
| Log PII (email, phone, name) | Log only anonymous session IDs |
| Call analytics on server | Client-side only |
| Hardcode traffic source | Use `getTrafficSource()` |
