Here is the `security.md` file based on your PRD v2.0 and AGENTS.md:

```markdown
# Security Rules — Photoframes by VF

## Document Control

| Property | Value |
|----------|-------|
| Version | 1.0 |
| Last Updated | 09/05/2025 |
| Aligned With | PRD v2.0 Section 14, AGENTS.md Section 12 |
| Owner | Development Team |

---

## 1. Overview

Even as a brochure-style site without user accounts or payments, Photoframes by VF requires basic security hygiene. These requirements protect both the business and its visitors, ensuring trust in the brand and compliance with Nigerian data protection expectations.

---

## 2. HTTPS & Transport Security

### 2.1 Mandatory HTTPS

| Requirement | Standard |
|-------------|----------|
| **HTTPS everywhere** | All pages must be served over HTTPS. No HTTP-only pages permitted. |
| **Auto-redirect** | HTTP requests must redirect to HTTPS automatically (301 permanent redirect). |
| **HSTS header** | `Strict-Transport-Security: max-age=31536000; includeSubDomains` |

### 2.2 Implementation (Vercel)

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 3. Secrets & Credentials Management

### 3.1 Environment Variables

| ❌ Never | ✅ Always |
|----------|-----------|
| Commit `.env.local` to version control | Commit `.env.example` with placeholder values |
| Expose API keys in client-side code | Use server-side API routes for sensitive operations |
| Hardcode WhatsApp numbers or tokens | Store secrets in environment variables |
| Share secrets in documentation or chat | Rotate secrets quarterly or after team changes |

### 3.2 Required Environment Variables (`.env.example`)

```bash
# .env.example — commit this file (values are placeholders)
# Never commit .env.local

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_xxxxxxxxxxxxxxxx     # Server-only — never exposed to client

# PostgreSQL (if using custom analytics)
DATABASE_URL=postgres://user:password@host:5432/dbname

# Vercel (auto-set during deployment)
VERCEL_URL=
```

### 3.3 .gitignore Rules

```gitignore
# .gitignore — must include these lines
.env.local
.env.*.local
.DS_Store
node_modules/
.next/
.vercel/
sanity/.env
```

---

## 4. WhatsApp Number Protection

### 4.1 Core Rule

> **The WhatsApp number must NEVER be hardcoded in source files, environment variables, or client-side markup.**

### 4.2 Correct Implementation

```typescript
// lib/whatsapp.ts — CORRECT ✅
// Fetch from Sanity at runtime with caching

let cachedNumber: string | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getWhatsAppNumber(): Promise<string> {
  if (cachedNumber && Date.now() - cacheTime < CACHE_TTL) {
    return cachedNumber;
  }
  
  const query = `*[_type == 'siteSettings'][0]{ whatsappNumber }`;
  const data = await client.fetch(query);
  
  if (!data?.whatsappNumber) {
    throw new Error('WhatsApp number not found in Sanity siteSettings');
  }
  
  cachedNumber = data.whatsappNumber;
  cacheTime = Date.now();
  return cachedNumber;
}
```

### 4.3 Validation & Fallback

```typescript
// Validation in Sanity schema
validation: (R) => R.required()
  .regex(/^\+234\d{10}$/, 'Must be +234 followed by 10 digits')
  .error('Please enter a valid Nigerian WhatsApp number starting with +234')

// Fallback when link fails (PRD Section 11)
{/* Display phone number as fallback */}
<a href={`tel:${whatsappNumber}`} className="text-accent-primary">
  {whatsappNumber}
</a>
```

---

## 5. Input Validation

### 5.1 Sanity Schema Validation

| Field | Validation Rule |
|-------|-----------------|
| **Product name** | Required, string, max 100 characters |
| **Price** | Required, number, min 0 |
| **WhatsApp number** | Required, regex `/^\+234\d{10}$/` |
| **Rating** | Required, number, min 1, max 5 |
| **Images** | Required, min 1, max 10 |

```typescript
// Example: Product price validation
{
  name: 'price',
  type: 'number',
  title: 'Price (₦)',
  validation: (R) => R.required().min(0).error('Price must be a positive number')
}
```

### 5.2 API Route Validation (if implemented)

```typescript
// app/api/analytics/route.ts
import { z } from 'zod';

const analyticsSchema = z.object({
  type: z.enum(['whatsapp_click', 'product_view', 'category_click', 'hero_cta', 'instagram_click', 'scroll_depth']),
  productSlug: z.string().optional(),
  categorySlug: z.string().optional(),
  inquiryType: z.enum(['product_specific', 'general', 'corporate']).optional(),
  scroll_depth: z.number().min(0).max(100).optional(),
  traffic_source: z.string().optional(),
  session_id: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validated = analyticsSchema.parse(body); // Throws if invalid
  // ... process
}
```

### 5.3 SQL Injection Prevention

```typescript
// ✅ ALWAYS use parameterised queries
await sql`INSERT INTO analytics_events (event_type) VALUES (${eventType})`;

// ❌ NEVER concatenate strings
await sql.query(`INSERT INTO analytics_events (event_type) VALUES ('${eventType}')`);
```

---

## 6. Image Upload Security

### 6.1 File Type Validation

| Requirement | Standard |
|-------------|----------|
| **Allowed formats** | JPG, JPEG, PNG, WebP only |
| **Maximum size** | 5MB per image before compression |
| **Sanity handling** | Sanity automatically compresses and optimises |

### 6.2 Implementation

```typescript
// Sanity schema automatically enforces via asset sources
{
  name: 'images',
  type: 'array',
  title: 'Images',
  of: [{
    type: 'image',
    options: {
      accept: '.jpg,.jpeg,.png,.webp',
      storeOriginalFilename: false,
    }
  }],
  validation: (R) => R.max(10).error('Maximum 10 images per product')
}
```

---

## 7. Content Security

### 7.1 Sanitisation Rules

| Content Type | Handler |
|--------------|---------|
| **Rich text (about section)** | Sanity Portable Text — automatically sanitised |
| **Product descriptions** | Plain text or Portable Text — no raw HTML |
| **Admin-entered text** | Never use `dangerouslySetInnerHTML` |
| **User-generated content** | Not in v1.0 — when added, sanitise server-side |

### 7.2 Prohibited Patterns

```tsx
// ❌ NEVER do this
<div dangerouslySetInnerHTML={{ __html: adminProvidedText }} />

// ✅ ALWAYS use Sanity Portable Text
<PortableText value={aboutText} components={richTextComponents} />
```

### 7.3 External Links

```tsx
// All external links must have security attributes
<a 
  href="https://instagram.com/photoframesbyvf" 
  target="_blank" 
  rel="noopener noreferrer"  // Required
  className="..." 
>
  Follow on Instagram
</a>
```

---

## 8. Monitoring & Logging

### 8.1 Admin Change Log Table (PostgreSQL)

```sql
CREATE TABLE admin_change_log (
  id SERIAL PRIMARY KEY,
  section VARCHAR(64) NOT NULL,     -- hero, product, category, testimonial, contact_info, about
  field_name VARCHAR(128),
  old_value TEXT,
  new_value TEXT,
  changed_by VARCHAR(64) DEFAULT 'admin',
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,                  -- Optional: for audit trail
  user_agent TEXT                   -- Optional: for audit trail
);

-- Index for efficient querying
CREATE INDEX idx_admin_change_log_section ON admin_change_log(section);
CREATE INDEX idx_admin_change_log_changed_at ON admin_change_log(changed_at);
```

### 8.2 What Gets Logged

| Action | Logged? |
|--------|---------|
| Product added/edited/deleted | ✅ Yes |
| Price change | ✅ Yes |
| WhatsApp number update | ✅ Yes |
| Testimonial approval/rejection | ✅ Yes |
| Category reordering | ✅ Yes |
| Hero text change | ✅ Yes |
| Page view (analytics) | ❌ No (separate analytics table) |
| WhatsApp click | ❌ No (separate analytics table) |

### 8.3 Monitoring Alerts (PRD Section 16)

| Failure Type | Alert Method | Threshold |
|--------------|--------------|-----------|
| Site down | UptimeRobot / Vercel | 2 minutes unreachable |
| 5xx errors | Sentry | Any 5xx error in production |
| Broken WhatsApp links | Cron job + log | Any wa.me link returns error |
| Broken images | Post-deployment check | Any product image 404 |

---

## 9. Dependency Security

### 9.1 Audit Requirements

| Frequency | Action |
|-----------|--------|
| **Before each deploy** | Run `npm audit` — fix high/critical vulnerabilities |
| **Weekly** | Review `npm outdated` — plan updates for major versions |
| **Monthly** | Run `npx npm-check-updates` — evaluate dependency health |

### 9.2 Lockfile Policy

- ✅ Commit `package-lock.json` to version control
- ✅ Use `npm ci` in CI/CD (not `npm install`)
- ❌ Never delete lockfile without team review

### 9.3 Prohibited Practices

| ❌ Prohibited | ✅ Alternative |
|---------------|----------------|
| Installing unmaintained packages | Check GitHub stars, recent commits, open issues |
| Pinning to exact versions without review | Use `^` for minor updates, test in staging |
| Adding packages without security audit | Run `npm audit` before `npm install` |

### 9.4 Trusted Package Sources

Only install packages from:

- npm registry (official)
- @sanity (official Sanity packages)
- @vercel (official Vercel packages)
- @tailwindcss (official Tailwind packages)

---

## 10. Client-Side Security

### 10.1 No Exposed Credentials

```typescript
// ❌ NEVER expose in client components
const SANITY_TOKEN = 'sk_xxxxxxxx';  // NEVER

// ✅ Use environment variables with NEXT_PUBLIC_ prefix ONLY for safe values
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;  // Safe — public

// ✅ Server-only tokens never leave the server
const apiToken = process.env.SANITY_API_TOKEN;  // Server-only — safe
```

### 10.2 XSS Prevention

| Risk | Mitigation |
|------|------------|
| User input displayed | Sanity Portable Text auto-escapes |
| URL parameters displayed | Use `encodeURIComponent()` or Next.js built-in escaping |
| Admin content | Sanity sanitises before storing |

```tsx
// Safe — Next.js auto-escapes by default
<p>{product.description}</p>

// Still safe — manually encode if needed
<p>{encodeURIComponent(product.name)}</p>
```

### 10.3 CSRF Protection

- No user sessions in v1.0 — CSRF risk is minimal
- For API routes (analytics): use Origin header check

```typescript
// app/api/analytics/route.ts
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://photoframesbyvf.com', 'https://photoframesbyvf.vercel.app'];
  
  if (!allowedOrigins.includes(origin)) {
    return new Response('Unauthorized', { status: 403 });
  }
  // ... process
}
```

---

## 11. Data Protection (Privacy)

### 11.1 What Data Is Collected

| Data Type | Collected? | Purpose |
|-----------|------------|---------|
| WhatsApp number (business) | ✅ Yes | Customer inquiries |
| Instagram handle (business) | ✅ Yes | Social proof |
| Product prices | ✅ Yes | E-commerce display |
| Customer names (testimonials) | ✅ Yes (first name/initials) | Social proof |
| Customer locations (testimonials) | ✅ Yes (optional city) | Social proof |
| Analytics events (anonymous) | ✅ Yes | Business intelligence |
| Personal customer data | ❌ No | Not collected in v1.0 |

### 11.2 Privacy by Design

- Testimonials use first name or initials only — no full names or contact details
- Analytics uses anonymous session IDs — no PII
- No cookies required for core functionality (GA4 uses anonymised IP)
- No third-party tracking beyond GA4

### 11.3 Nigerian Data Protection Compliance

- Inform users via privacy policy (link in footer)
- No sensitive personal data collected
- Data retention: analytics data retained for 12 months, then aggregated

---

## 12. Security Incident Response

### 12.1 Incident Types & Response

| Incident | Response | Responsible |
|----------|----------|-------------|
| **WhatsApp number exposed** | Immediately rotate number in Sanity, redeploy, alert customers | Developer |
| **Sanity token compromised** | Revoke token in Sanity, generate new, update env vars | Developer |
| **Database breach** | Revoke credentials, restore from backup, audit logs | Developer + Vercel |
| **Site defacement** | Rollback to last known good deploy, investigate entry point | Developer |

### 12.2 Contact Protocol

1. **Detection** — Alert via Sentry/UptimeRobot
2. **Containment** — Developer takes affected system offline if needed
3. **Eradication** — Fix root cause
4. **Recovery** — Redeploy from clean state
5. **Notification** — Inform Fechi Godwin within 24 hours

---

## 13. Security Checklist (Pre-Deployment)

Before each deployment, verify:

- [ ] `npm audit` returns no high/critical vulnerabilities
- [ ] No hardcoded WhatsApp numbers in any source file
- [ ] No exposed API keys or tokens in client components
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] No `dangerouslySetInnerHTML` usage (except Sanity Portable Text)
- [ ] `.env.local` is in `.gitignore` (verify file is not tracked)
- [ ] `.env.example` is committed with placeholder values
- [ ] WhatsApp number validation regex is active in Sanity schema
- [ ] Image upload max size (5MB) is enforced
- [ ] HSTS headers are configured in `next.config.js`
- [ ] SQL queries use parameterised syntax (if using PostgreSQL)

---

## 14. References

| Document | Section | Topic |
|----------|---------|-------|
| PRD v2.0 | Section 14 | Security & Abuse Prevention |
| PRD v2.0 | Section 11 | Fallback Behaviour |
| AGENTS.md | Section 12 | Security Requirements |
| AGENTS.md | Section 14 | Sanity Studio Admin Rules |
| Sanity.io Docs | — | Content Security & Validation |

---

*Security is not a one-time setup — it requires ongoing vigilance. Review this document quarterly and after any major change to the stack.*

*End of security.md*
