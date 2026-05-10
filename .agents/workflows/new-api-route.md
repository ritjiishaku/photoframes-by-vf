Here is the `workflows/new-api-route.md` file:

```markdown
# Workflow: New API Route

## Purpose

Standardized process for creating a new API route in Next.js App Router for Photoframes by VF.

**Important:** PRD v2.0 Section 4.2 states v1.0 has minimal API needs. Only create API routes for:
- Analytics tracking (`/api/analytics`)
- Sanity webhooks (`/api/webhooks/sanity`)
- Future v2.0 features (Paystack, orders)

---

## When to Use

- Adding analytics endpoint
- Adding Sanity webhook handler
- Preparing for v2.0 payment/webhook features
- Fetching server-side data that cannot be client-side

**Do NOT create API routes for:**
- Data that can be fetched directly from Sanity (use client-side)
- Static content (use SSG/ISR)
- Features not explicitly required by PRD

---

## Step 1: Define API Requirements

Before writing code, answer these questions:

| Question | Answer |
|----------|--------|
| What is the route's purpose? | |
| HTTP method(s) needed? | GET / POST / PUT / DELETE |
| Does it need authentication? | Yes / No (v1.0: no auth needed) |
| Does it need rate limiting? | Yes / No |
| Will it write to database? | Yes / No |
| Is this required for v1.0 or v2.0? | |

---

## Step 2: Choose Route Location

| Type | Location | Example |
|------|----------|---------|
| Analytics | `app/api/analytics/route.ts` | POST `/api/analytics` |
| Webhooks | `app/api/webhooks/[provider]/route.ts` | POST `/api/webhooks/sanity` |
| Payments (v2.0) | `app/api/payments/route.ts` | POST `/api/payments/initialize` |
| Orders (v2.0) | `app/api/orders/route.ts` | GET/POST `/api/orders` |

---

## Step 3: Create API Route File

**Template:**

```typescript
// app/api/[route-name]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define request schema with Zod
const RequestSchema = z.object({
  // Required fields
  eventType: z.enum(['whatsapp_click', 'product_view', 'category_click']),
  sessionId: z.string().min(1),
  
  // Optional fields
  productSlug: z.string().min(1).max(255).optional(),
  categorySlug: z.string().min(1).max(255).optional(),
  timestamp: z.string().datetime().optional(),
});

// Allowed origins for CORS (CSRF protection)
const ALLOWED_ORIGINS = [
  'https://photoframesbyvf.com',
  'https://photoframesbyvf.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

export async function POST(request: NextRequest) {
  try {
    // 1. CORS / Origin check
    const origin = request.headers.get('origin');
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized origin' },
        { status: 403 }
      );
    }
    
    // 2. Parse and validate request body
    const body = await request.json();
    const validated = RequestSchema.parse(body);
    
    // 3. Process the request
    // Example: Insert into database
    // const result = await sql`INSERT INTO ...`
    
    // 4. Return success response
    return NextResponse.json({ 
      success: true, 
      data: { id: result.id }
    });
    
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    
    // Log server errors
    console.error('API Error:', error);
    
    // Return generic error (never expose internal details)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing id parameter' },
        { status: 400 }
      );
    }
    
    // Fetch data
    // const result = await sql`SELECT * FROM table WHERE id = ${id}`
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

---

## Step 4: Define Request Schema (Zod)

| Field Type | Validation Rules |
|------------|------------------|
| **String** | `.min(1)`, `.max(255)`, `.email()`, `.url()` |
| **Number** | `.min(0)`, `.max(100)`, `.int()` |
| **Enum** | `.enum(['value1', 'value2'])` |
| **Boolean** | `.boolean()` |
| **Date** | `.string().datetime()` |
| **Optional** | `.optional()` |
| **Nullable** | `.nullable()` |

**Example schemas:**

```typescript
// Analytics event schema
const AnalyticsSchema = z.object({
  type: z.enum(['whatsapp_click', 'product_view', 'category_click']),
  productSlug: z.string().min(1).max(255).optional(),
  categorySlug: z.string().min(1).max(255).optional(),
  inquiryType: z.enum(['product_specific', 'general', 'corporate']).optional(),
  trafficSource: z.string().min(1),
  sessionId: z.string().min(1),
  userAgent: z.string().optional(),
});

// Sanity webhook schema
const WebhookSchema = z.object({
  _type: z.string(),
  _id: z.string(),
  _rev: z.string(),
  _updatedAt: z.string().datetime(),
});

// Payment request schema (v2.0)
const PaymentSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
});
```

---

## Step 5: Implement Security

### Origin Check (CSRF Protection)

```typescript
const ALLOWED_ORIGINS = [
  'https://photoframesbyvf.com',
  'https://photoframesbyvf.vercel.app',
  'http://localhost:3000',
];

const origin = request.headers.get('origin');
if (!ALLOWED_ORIGINS.includes(origin)) {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
}
```

### Rate Limiting (Simple Version)

```typescript
// Simple in-memory rate limiting (for low-traffic APIs)
const rateLimit = new Map();

function isRateLimited(ip: string, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const requests = (rateLimit.get(ip) || []).filter(t => t > windowStart);
  
  if (requests.length >= limit) return true;
  
  requests.push(now);
  rateLimit.set(ip, requests);
  return false;
}

// Usage in route
const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
if (isRateLimited(ip)) {
  return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
}
```

### API Key Authentication (For Webhooks)

```typescript
// For Sanity webhook or external services
const apiKey = request.headers.get('x-api-key');
const expectedKey = process.env.WEBHOOK_SECRET_KEY;

if (!apiKey || apiKey !== expectedKey) {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}
```

---

## Step 6: Add Database Integration

### PostgreSQL Query (Parameterised)

```typescript
import { sql } from '@/lib/db/client';

// ✅ Correct — parameterised query
const result = await sql`
  INSERT INTO analytics_events (
    event_type, product_slug, session_id, created_at
  ) VALUES (
    ${validated.type}, ${validated.productSlug || null}, ${validated.sessionId}, NOW()
  )
  RETURNING id
`;

// ❌ Incorrect — string concatenation (SQL injection risk)
// await sql.query(`INSERT INTO analytics_events (event_type) VALUES ('${type}')`);
```

### Response Format

```typescript
// Success (200)
return NextResponse.json({ 
  success: true, 
  data: { id: result[0].id }
});

// Bad Request (400)
return NextResponse.json(
  { success: false, error: 'Missing required field: productSlug' },
  { status: 400 }
);

// Unauthorized (401/403)
return NextResponse.json(
  { success: false, error: 'Invalid API key' },
  { status: 401 }
);

// Not Found (404)
return NextResponse.json(
  { success: false, error: 'Resource not found' },
  { status: 404 }
);

// Server Error (500)
return NextResponse.json(
  { success: false, error: 'Internal server error' },
  { status: 500 }
);
```

---

## Step 7: Add Environment Variables

If route requires new environment variables:

### 1. Add to `.env.local` (local development)

```bash
# .env.local (never commit)
WEBHOOK_SECRET_KEY=sk_live_xxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx
```

### 2. Add placeholder to `.env.example` (commit this)

```bash
# .env.example (committed)
WEBHOOK_SECRET_KEY=your_webhook_secret_key_placeholder
PAYSTACK_SECRET_KEY=your_paystack_secret_key_placeholder
```

### 3. Access in route

```typescript
const secretKey = process.env.WEBHOOK_SECRET_KEY;
if (!secretKey) {
  throw new Error('WEBHOOK_SECRET_KEY environment variable not set');
}
```

---

## Step 8: Add Error Logging

```typescript
// Basic console logging (v1.0)
console.error('API Error:', { error, body, url: request.url });

// With Sentry (if configured)
import { captureException } from '@sentry/nextjs';

try {
  // route logic
} catch (error) {
  console.error('API Error:', error);
  captureException(error, {
    extra: { body, url: request.url, method: request.method },
  });
  return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
}
```

---

## Step 9: Test the API Route

### Local Testing with cURL

```bash
# POST request
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "type": "whatsapp_click",
    "sessionId": "test-123",
    "inquiryType": "general"
  }'

# GET request
curl -X GET "http://localhost:3000/api/analytics?id=123" \
  -H "Origin: http://localhost:3000"
```

### Expected Responses

| Scenario | Status | Response |
|----------|--------|----------|
| Success | 200 | `{ "success": true, "data": {...} }` |
| Invalid input | 400 | `{ "success": false, "error": [...] }` |
| Unauthorized origin | 403 | `{ "success": false, "error": "Unauthorized origin" }` |
| Rate limited | 429 | `{ "success": false, "error": "Too many requests" }` |
| Server error | 500 | `{ "success": false, "error": "Internal server error" }` |

---

## Step 10: Add Client-Side Utility (if needed)

If route will be called from client components, create a utility function:

**Path:** `lib/api/[feature].ts`

```typescript
// lib/api/analytics.ts
interface TrackEventPayload {
  type: 'whatsapp_click' | 'product_view' | 'category_click';
  sessionId: string;
  productSlug?: string;
  categorySlug?: string;
}

export async function trackEvent(payload: TrackEventPayload): Promise<boolean> {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.debug('Analytics error:', error);
    return false; // Fail silently
  }
}
```

---

## Step 11: Commit

```bash
# Add the route file
git add app/api/[route-name]/route.ts

# Add client utility if created
git add lib/api/[feature].ts

# Update environment example
git add .env.example

# Commit with conventional message
git commit -m "feat(api): add [route-name] endpoint"
```

**Commit message format:**

- `feat(api):` for new routes
- `fix(api):` for bug fixes
- `refactor(api):` for changes without new features

---

## Complete Checklist

Before marking API route as complete:

### Code Quality

- [ ] Route file created in `app/api/[name]/route.ts`
- [ ] TypeScript types defined for request/response
- [ ] Zod schema for input validation
- [ ] No `any` types without justification

### Security

- [ ] Origin check implemented (if public endpoint)
- [ ] Rate limiting considered
- [ ] No SQL injection risk (parameterised queries only)
- [ ] No internal errors exposed to client
- [ ] API key auth for webhooks

### Validation

- [ ] Required fields validated
- [ ] Data types checked
- [ ] Length/range limits enforced
- [ ] Custom error messages for validation failures

### Error Handling

- [ ] Try/catch around async operations
- [ ] Zod errors return 400 with details
- [ ] Server errors return 500 with generic message
- [ ] Errors logged to console (Sentry if available)

### Database (if applicable)

- [ ] Parameterised queries only
- [ ] Connection uses existing `lib/db/client.ts`
- [ ] Return appropriate status codes

### Environment Variables

- [ ] Added to `.env.local` (local)
- [ ] Placeholder added to `.env.example` (committed)
- [ ] Checked for existence before use

### Testing

- [ ] Tested with cURL or Postman
- [ ] Success response (200) verified
- [ ] Validation error (400) verified
- [ ] Unauthorized (403) verified (if applicable)
- [ ] Server error (500) handled gracefully

### Documentation

- [ ] JSDoc comment added to route handler
- [ ] Client utility documented (if created)

---

## Common Mistakes to Avoid

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| No input validation | Add Zod schema |
| String concatenation in SQL | Use parameterised queries |
| Exposing internal errors | Return generic error message |
| No origin check for public API | Add allowed origins list |
| Hardcoded secrets | Use environment variables |
| Creating API when not needed | Fetch directly from Sanity client-side |
| No error logging | Add console.error or Sentry |
| Mixed response formats | Use consistent `{ success, data/error }` |

---

## Existing API Routes (v1.0)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/analytics` | POST | Log analytics events to PostgreSQL |
| `/api/webhooks/sanity` | POST | Rebuild on Sanity content change |

**Do not modify these without approval.**

---

## Future v2.0 API Routes (Planned)

| Route | Method | Purpose | Target |
|-------|--------|---------|--------|
| `/api/payments/initialize` | POST | Create Paystack payment intent | v2.0 |
| `/api/payments/webhook` | POST | Paystack webhook handler | v2.0 |
| `/api/orders` | GET/POST | Order management | v2.0 |

---

## References

| Document | Section | Topic |
|----------|---------|-------|
| PRD v1.0 | Section 4.2 | Out of scope (API minimal) |
| PRD v1.0 | Section 14 | Security requirements |
| AGENTS.md | Section 12 | Security rules |
| security.md | Section 5 | Input validation |
| security.md | Section 8 | Monitoring & logging |
