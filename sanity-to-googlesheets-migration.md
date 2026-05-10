# Migration Prompt — Replace Sanity.io with Google Sheets
# Photoframes by VF | AGENTS.md v1.0 → v1.1
# Paste this prompt directly into Google Antigravity to execute the migration.

---

## CONTEXT

You are working on the Photoframes by VF web application. Read AGENTS.md in full
before starting. This prompt supersedes all Sanity-specific instructions in AGENTS.md.
Every other rule in AGENTS.md (formatting, WhatsApp, Nigerian standards, performance,
accessibility, security, forbidden patterns) remains in full effect.

The CMS is being changed from **Sanity.io → Google Sheets** because:
- Fechi Godwin (the non-technical admin) needs zero learning curve
- Google Sheets is completely free with no usage limits
- Fechi already knows how to use spreadsheets
- No "draft vs publish" step — row saves are live immediately

---

## WHAT YOU ARE REPLACING

Remove all of the following. Delete files, remove packages, remove references:

### Files to delete entirely
```
sanity/                          ← entire directory
  schema/product.ts
  schema/category.ts
  schema/testimonial.ts
  schema/adminContent.ts
  schema/index.ts
  sanity.config.ts

lib/sanity/                      ← entire directory
  client.ts
  queries.ts
  types.ts

app/api/webhooks/sanity/         ← entire directory
  route.ts
```

### npm packages to uninstall
```bash
npm uninstall @sanity/client @sanity/image-url next-sanity sanity
```

### Environment variables to remove from .env.local and .env.example
```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
```

### References to remove from existing source files
- Any `import` from `@sanity/client`, `next-sanity`, or `lib/sanity/*`
- Any GROQ query strings (backtick template strings starting with `*[_type ==`)
- The `/api/webhooks/sanity` route registration if referenced in any config
- Any mention of `sanity` in `next.config.js` (image domains, rewrites, etc.)
- ISR revalidation triggered by Sanity webhook — replace with time-based ISR only

---

## WHAT YOU ARE BUILDING

### The Google Sheet structure

Fechi manages content in a single Google Sheet with these tabs (sheets):

**Tab 1 — Products**
| Column | Field            | Notes for Fechi                                      |
|--------|------------------|------------------------------------------------------|
| A      | name             | Product display name — e.g. Gold Layered Name Necklace |
| B      | slug             | URL-friendly ID — e.g. gold-layered-name-necklace (no spaces, lowercase, hyphens only) |
| C      | category         | Must be exactly one of: custom-frames, gold-jewellery, frameless-designs, couple-gifts, event-souvenirs |
| D      | emotional_headline | One line — e.g. "Wear your love story"            |
| E      | description      | 2–3 sentences. Focus on the feeling and occasion.   |
| F      | price            | Number only — no ₦ symbol. e.g. 25000               |
| G      | availability     | Must be exactly one of: in_stock, made_to_order, unavailable |
| H      | occasion_tags    | Comma-separated — e.g. Anniversary,Birthday,Wedding  |
| I      | is_customisable  | TRUE or FALSE                                        |
| J      | customisation_note | e.g. "Send name via WhatsApp after ordering" — leave blank if not customisable |
| K      | image_url        | Google Drive shareable link to product image         |
| L      | is_visible       | TRUE to show on site, FALSE to hide                  |
| M      | whatsapp_inquiry_text | Leave blank — app generates this automatically  |

**Tab 2 — Categories**
| Column | Field         | Notes for Fechi                                         |
|--------|---------------|---------------------------------------------------------|
| A      | name          | Display name — e.g. Custom Frames                       |
| B      | slug          | URL ID — e.g. custom-frames                             |
| C      | description   | Short tagline — 1 sentence                              |
| D      | cover_image_url | Google Drive shareable link to category cover image   |
| E      | display_order | Number — 1 shows first, 2 shows second, etc.            |
| F      | is_active     | TRUE to show, FALSE to hide                             |

**Tab 3 — Testimonials**
| Column | Field        | Notes for Fechi                                          |
|--------|--------------|----------------------------------------------------------|
| A      | customer_name | First name or initials only — e.g. Adaeze O.            |
| B      | location     | Nigerian city — e.g. Lagos                               |
| C      | product_type | e.g. Gold Necklace                                       |
| D      | review_text  | Customer's exact words — leave blank for video-only reviews |
| E      | rating       | Number 1–5                                               |
| F      | is_visible   | TRUE to show on site, FALSE to hide                      |
| G      | date         | DD/MM/YYYY format                                        |
| H      | review_type  | Must be one of: text, video, both. Defaults to text if blank |
| I      | video_url    | YouTube link for video reviews — leave blank for text-only |

**Tab 4 — Site Settings**
| Column | Field              | Notes for Fechi                                    |
|--------|--------------------|----------------------------------------------------|
| A      | key                | Do not change — these are system field names       |
| B      | value              | Change this column only                            |

Rows in Site Settings tab:
```
hero_headline         | Celebrate love with a frame that lasts forever.
hero_subheadline      | Premium custom acrylic frames and gold-layered jewellery — made for your moment.
hero_cta_primary      | Explore the Collection
hero_cta_secondary    | Chat on WhatsApp
about_text            | [full about section text]
whatsapp_number       | +234XXXXXXXXXX
instagram_handle      | photoframesbyvf
```

---

### New files to create

#### `lib/sheets/client.ts`
Google Sheets API client. Authenticates using a Google Service Account.
Fetches data from the spreadsheet by sheet name and returns rows as arrays.

```typescript
// lib/sheets/client.ts
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function getSheetRows(
  sheetName: string
): Promise<string[][]> {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID is not set. Check .env.local and .env.example.');
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
  });

  const rows = response.data.values ?? [];
  // First row is headers — return data rows only (index 1+)
  return rows.slice(1).filter(row => row.length > 0);
}
```

#### `lib/sheets/queries.ts`
All data-fetching functions. No raw sheet access anywhere outside this file.
This replaces `lib/sanity/queries.ts` entirely.

```typescript
// lib/sheets/queries.ts
import { getSheetRows } from './client';
import type { Product, Category, Testimonial, SiteSettings } from './types';

export async function getAllProducts(): Promise<Product[]> {
  const rows = await getSheetRows('Products');
  return rows
    .map(rowToProduct)
    .filter(p => p.is_visible);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.slug === slug) ?? null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter(p => p.category === categorySlug);
}

export async function getAllCategories(): Promise<Category[]> {
  const rows = await getSheetRows('Categories');
  return rows
    .map(rowToCategory)
    .filter(c => c.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find(c => c.slug === slug) ?? null;
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const rows = await getSheetRows('Testimonials');
  return rows
    .map(rowToTestimonial)
    .filter(t => t.is_visible);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await getSheetRows('Site Settings');
  const map = Object.fromEntries(rows.map(([key, value]) => [key, value]));

  const whatsappNumber = map['whatsapp_number'];
  if (!whatsappNumber) {
    throw new Error(
      'whatsapp_number is missing from the Site Settings sheet. Add it before deploying.'
    );
  }

  return {
    hero_headline:      map['hero_headline']      ?? '',
    hero_subheadline:   map['hero_subheadline']   ?? '',
    hero_cta_primary:   map['hero_cta_primary']   ?? 'Explore the Collection',
    hero_cta_secondary: map['hero_cta_secondary'] ?? 'Chat on WhatsApp',
    about_text:         map['about_text']          ?? '',
    whatsapp_number:    whatsappNumber,
    instagram_handle:   map['instagram_handle']   ?? '',
  };
}

// ── Row mappers ────────────────────────────────────────────────────────────

function rowToProduct(row: string[]): Product {
  return {
    name:                 row[0]  ?? '',
    slug:                 row[1]  ?? '',
    category:             row[2]  ?? '',
    emotional_headline:   row[3]  ?? '',
    description:          row[4]  ?? '',
    price:                Number(row[5] ?? 0),
    availability:         (row[6] ?? 'unavailable') as Product['availability'],
    occasion_tags:        (row[7] ?? '').split(',').map(t => t.trim()).filter(Boolean),
    is_customisable:      row[8]?.toUpperCase() === 'TRUE',
    customisation_note:   row[9]  ?? null,
    image_url:            row[10] ?? '',
    is_visible:           row[11]?.toUpperCase() === 'TRUE',
  };
}

function rowToCategory(row: string[]): Category {
  return {
    name:           row[0] ?? '',
    slug:           row[1] ?? '',
    description:    row[2] ?? '',
    cover_image_url: row[3] ?? '',
    display_order:  Number(row[4] ?? 99),
    is_active:      row[5]?.toUpperCase() === 'TRUE',
  };
}

function rowToTestimonial(row: string[]): Testimonial {
  return {
    customer_name: row[0] ?? '',
    location:      row[1] ?? null,
    product_type:  row[2] ?? null,
    review_text:   row[3] ?? '',
    rating:        Number(row[4] ?? 5),
    is_visible:    row[5]?.toUpperCase() === 'TRUE',
    date:          row[6] ?? '',
  };
}
```

#### `lib/sheets/types.ts`
TypeScript types. Replaces `lib/sanity/types.ts`.

```typescript
// lib/sheets/types.ts

export interface Product {
  name:               string;
  slug:               string;
  category:           string;
  emotional_headline: string;
  description:        string;
  price:              number;       // always a number — formatNaira() handles display
  availability:       'in_stock' | 'made_to_order' | 'unavailable';
  occasion_tags:      string[];
  is_customisable:    boolean;
  customisation_note: string | null;
  image_url:          string;
  is_visible:         boolean;
}

export interface Category {
  name:            string;
  slug:            string;
  description:     string;
  cover_image_url: string;
  display_order:   number;
  is_active:       boolean;
}

export interface Testimonial {
  customer_name: string;
  location:      string | null;
  product_type:  string | null;
  review_text:   string;
  rating:        number;
  is_visible:    boolean;
  date:          string;           // stored as DD/MM/YYYY — display as-is
}

export interface SiteSettings {
  hero_headline:      string;
  hero_subheadline:   string;
  hero_cta_primary:   string;
  hero_cta_secondary: string;
  about_text:         string;
  whatsapp_number:    string;      // +234XXXXXXXXXX — read by buildWhatsAppUrl()
  instagram_handle:   string;
}
```

---

### npm packages to install
```bash
npm install googleapis
```

`googleapis` is the official Google client library — maintained by Google, zero cost,
works in Node.js and Vercel serverless functions.

---

### Environment variables — add to .env.local and .env.example

```bash
# Google Sheets — replaces all SANITY_* variables
GOOGLE_SHEET_ID=                        # The long ID from the Sheet URL
                                        # e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
GOOGLE_SERVICE_ACCOUNT_EMAIL=           # e.g. photoframes-vf@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=                     # Multi-line key — wrap in quotes in .env.local

# WhatsApp — now read from getSiteSettings() at build time, synced to env
# Keep this variable — value populated from Site Settings sheet via build script
NEXT_PUBLIC_WHATSAPP_NUMBER=            # +234XXXXXXXXXX — no spaces
```

---

### How NEXT_PUBLIC_WHATSAPP_NUMBER stays in sync

Since Google Sheets has no webhook like Sanity, the WhatsApp number must be
synced to the env var at build time. Add this to the Next.js build process:

```typescript
// lib/sheets/sync-env.ts
// Run during next build via next.config.js instrumentation
// Reads whatsapp_number from Site Settings sheet → sets NEXT_PUBLIC_WHATSAPP_NUMBER

import { getSiteSettings } from './queries';

export async function syncWhatsAppNumber(): Promise<void> {
  const settings = await getSiteSettings();
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = settings.whatsapp_number;
}
```

Call `syncWhatsAppNumber()` in `next.config.js` inside the `webpack` or
`generateBuildId` hook so it runs before any page is rendered. The value is
then available to `buildWhatsAppUrl()` at runtime via the env var — no change
to `lib/whatsapp.ts` required.

---

### ISR strategy — replaces Sanity webhook

Without a Sanity webhook, use time-based ISR. These revalidation intervals
match Fechi's likely update cadence:

```typescript
// app/page.tsx — homepage
export const revalidate = 1800; // 30 minutes

// app/products/page.tsx — full product gallery
export const revalidate = 900;  // 15 minutes — products change more often

// app/products/[slug]/page.tsx — product detail
export const revalidate = 900;

// app/categories/[slug]/page.tsx
export const revalidate = 1800;

// app/about/page.tsx
export const revalidate = 86400; // 24 hours — rarely changes

// app/testimonials/page.tsx
export const revalidate = 3600; // 1 hour
```

**Important:** Tell Fechi that after she updates the Sheet, the site refreshes
within 15–30 minutes automatically. She does not need to do anything else.
If she needs an immediate update, she can trigger a manual redeploy on Vercel
(one button click — include this in her admin guide).

---

### Delete the Sanity webhook API route

```
app/api/webhooks/sanity/route.ts   ← DELETE this file
app/api/webhooks/sanity/           ← DELETE this directory
app/api/webhooks/                  ← DELETE if empty after above
```

The `app/api/analytics/route.ts` stays — it writes to PostgreSQL and has
nothing to do with Sanity.

---

### Update all page-level imports

In every file that previously imported from `lib/sanity/queries` or
`lib/sanity/types`, replace with the Google Sheets equivalent:

```typescript
// BEFORE
import { getAllProducts, getProductBySlug } from '@/lib/sanity/queries';
import type { Product } from '@/lib/sanity/types';

// AFTER
import { getAllProducts, getProductBySlug } from '@/lib/sheets/queries';
import type { Product } from '@/lib/sheets/types';
```

Run a codebase-wide find for `lib/sanity` after the migration to confirm
zero remaining references.

---

### Update `lib/whatsapp.ts` — no changes needed

`buildWhatsAppUrl()` reads from `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER`.
That env var is still populated (now from the Site Settings sheet instead of
Sanity). The function itself does not change.

---

### Update `AGENTS.md` — these sections must be rewritten

#### Section 1 — Project Identity
Change:
```
Admin  | Fechi Godwin — non-technical, manages content via Sanity.io
```
To:
```
Admin  | Fechi Godwin — non-technical, manages content via Google Sheets
CMS    | Google Sheets (free, no login required beyond Google account)
Sheet  | URL stored in GOOGLE_SHEET_ID env var
```

#### Section 2 — Approved Tech Stack
Replace the CMS block:
```
### CMS
- Platform:    Google Sheets
- Who uses it: Fechi Godwin (non-technical admin) — edits rows directly
- What it manages: Products (tab 1), Categories (tab 2), Testimonials (tab 3),
                   Site Settings (tab 4 — key/value pairs)
- Library:     googleapis (official Google Node.js client)
- Access:      Google Service Account — read-only access to the sheet
```

Remove:
```
### Backend
- Purpose: API routes for WhatsApp link generation, analytics event logging,
  and admin webhooks from Sanity
```
Replace with:
```
### Backend
- Purpose: API routes for analytics event logging only
  (/api/analytics POST — unchanged)
  Sanity webhook route removed — no longer needed
```

#### Section 3 — Absolute Rules
Replace:
```
❌ Hardcode the WhatsApp number — it must always be read from the Sanity CMS
   contact_info document
❌ Build a complex admin dashboard — Sanity Studio is the entire admin experience
```
With:
```
❌ Hardcode the WhatsApp number — it must always be read from NEXT_PUBLIC_WHATSAPP_NUMBER
   env var, which is synced from the Site Settings tab of the Google Sheet at build time
❌ Build a custom admin interface — Google Sheets IS the admin experience
```

Replace:
```
✅ Read the WhatsApp number from NEXT_PUBLIC_WHATSAPP_NUMBER env var
   (synced from Sanity) — never from code
```
With:
```
✅ Read the WhatsApp number from NEXT_PUBLIC_WHATSAPP_NUMBER env var
   (synced from Google Sheets Site Settings tab at build time) — never from code
```

Replace:
```
✅ all user-facing strings must come from Sanity or a single constants layer
```
With:
```
✅ all user-facing strings must come from Google Sheets queries (lib/sheets/queries.ts)
   or lib/constants.ts — never hardcoded in JSX
```

#### Section 4 — Architecture Overview
In the file tree, replace:
```
├── lib/
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── types.ts
```
With:
```
├── lib/
│   ├── sheets/
│   │   ├── client.ts        # Google Sheets API client (googleapis)
│   │   ├── queries.ts       # All data-fetching — no raw sheet access in components
│   │   ├── types.ts         # TypeScript types matching sheet column structure
│   │   └── sync-env.ts      # Syncs whatsapp_number to env var at build time
```

Remove from the tree:
```
├── sanity/
│   ├── schema/
│   └── sanity.config.ts
```

Remove from the tree:
```
│       └── webhooks/
│           └── sanity/
│               └── route.ts
```

#### Section 12 — Security Requirements
Replace:
```
| WhatsApp number exposure  | Stored in Sanity + env var only                |
| Admin content sanitisation| Sanity's Portable Text handles sanitisation    |
| Image upload validation   | Sanity enforces file type (JPG/PNG/WebP)       |
```
With:
```
| WhatsApp number exposure  | Stored in Google Sheet + env var only — Service Account is read-only |
| Admin content sanitisation| All sheet content passed through rowMapper functions — no raw HTML rendered |
| Image upload validation   | Images hosted on Google Drive — warn Fechi that Drive links must be public |
| Sheet access control      | Only the Service Account (read-only) and Fechi's Google account have access |
```

#### Section 14 — rename to "Google Sheets Admin Rules"
Replace the entire Sanity Studio admin rules section with:

```
## 14. GOOGLE SHEETS ADMIN RULES

The admin experience is Google Sheets. No custom dashboard, no Sanity Studio.

### Fechi can manage content by:
- Opening the Google Sheet link (bookmarked on her phone/laptop)
- Adding a new row to the Products tab to add a product
- Changing is_visible to FALSE to hide a product without deleting it
- Updating the price column — plain number, no ₦ symbol
- Changing whatsapp_number in Site Settings — must be +234XXXXXXXXXX format
- Adding a row to Testimonials — set is_visible to FALSE until verified
- The site refreshes automatically within 15–30 minutes

### What the agent must ensure:
- Row mappers in lib/sheets/queries.ts handle missing or empty cells gracefully
  (never crash on an empty row — use fallbacks for all optional fields)
- If a required field (name, price, slug, image_url) is missing, the product
  is silently skipped — never crashes the page
- Price column must be parsed with Number() — if non-numeric, default to 0
  and log a warning to the console (do not throw)
- is_visible column defaults to FALSE if blank — never show unreviewed content

### Admin guide (provide to Fechi on handoff):
A plain-language, screenshot-based guide must be written explaining:
1. How to open the Google Sheet
2. How to add a new product (fill in each column with examples)
3. How to hide a product (change is_visible to FALSE)
4. How to update the WhatsApp number in Site Settings
5. How long until changes appear on the site (15–30 minutes)
6. How to trigger an immediate update via Vercel dashboard (one-click redeploy)
```

#### Section 15 — Deployment Checklist
Replace the Sanity checklist block:
```
### Sanity
- [ ] All schemas match PRD Section 7 exactly
- [ ] Singleton siteSettings document exists and is published
- [ ] WhatsApp number field validates Nigerian format
- [ ] All required fields enforced with Rule.required()
```
With:
```
### Google Sheets
- [ ] Google Sheet has all 4 tabs: Products, Categories, Testimonials, Site Settings
- [ ] Service Account has read-only access to the sheet (not edit access)
- [ ] GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY set in Vercel env
- [ ] Site Settings tab contains whatsapp_number row in +234XXXXXXXXXX format
- [ ] NEXT_PUBLIC_WHATSAPP_NUMBER syncs correctly from Site Settings at build time
- [ ] At least 1 visible product and 1 active category exist in the sheet before launch
- [ ] lib/sheets/queries.ts is the only file that calls getSheetRows()
- [ ] No references to lib/sanity remain anywhere in the codebase
```

#### Section 16 — Future-Proofing for v2.0
Replace:
```
| Paystack payments   | price must be stored as number in Sanity and PostgreSQL |
| Automated WhatsApp  | Number in ONE place (Sanity siteSettings) — never duplicated |
| Multi-language      | All strings from Sanity/constants — never hardcoded in JSX |
```
With:
```
| Paystack payments   | price must be stored as number in Google Sheet (column F) and PostgreSQL |
| Automated WhatsApp  | Number in ONE place (Site Settings tab, whatsapp_number row) — never duplicated |
| Multi-language      | All strings from lib/sheets/queries.ts or lib/constants.ts — never hardcoded in JSX |
| CMS upgrade to Sanity| lib/sheets/queries.ts exports the same function signatures as lib/sanity/queries.ts did |
|                     | Swapping the CMS later = replace the lib/sheets/ directory only |
|                     | No page or component files need to change |
```

#### Section 17 — Timeline
Replace Week 1:
```
| 1 | Repo setup, Sanity schema, PostgreSQL tables, design system, layout components |
```
With:
```
| 1 | Repo setup, Google Sheet creation, Service Account setup, PostgreSQL tables,
|   | design system, lib/sheets/ client + queries + types, layout components         |
```

Replace Week 4:
```
| 4 | Performance audit, accessibility audit, deployment to Vercel, Sanity Studio handoff to Fechi |
```
With:
```
| 4 | Performance audit, accessibility audit, deployment to Vercel,
|   | Google Sheets admin guide written and handed to Fechi                           |
```

#### Section 18 — Reference Documents
Replace:
```
| Sanity schemas | /sanity/schema/ | Data structure — must match PRD Section 7 |
```
With:
```
| Google Sheet   | URL in GOOGLE_SHEET_ID env var | Content managed by Fechi         |
| Sheets client  | /lib/sheets/client.ts          | Google Sheets API connection      |
| Sheets queries | /lib/sheets/queries.ts         | All data-fetching — single source |
| Sheets types   | /lib/sheets/types.ts           | TypeScript types for all sheet data |
```

---

## GOOGLE SHEET SETUP INSTRUCTIONS FOR THE DEVELOPER

Before writing any code, complete these steps once:

**Step 1 — Create the Google Sheet**
1. Go to sheets.google.com — create a new blank spreadsheet
2. Rename it "Photoframes by VF — Content"
3. Create 4 tabs named exactly: `Products`, `Categories`, `Testimonials`, `Site Settings`
4. Add the column headers from the schema above as Row 1 of each tab
5. Add at least 2 sample products and 1 category so the site has data to render

**Step 2 — Create a Google Service Account**
1. Go to console.cloud.google.com → create a new project called "photoframes-vf"
2. Enable the Google Sheets API for the project
3. Go to IAM & Admin → Service Accounts → Create Service Account
4. Name it "photoframes-vf-reader" — role: Viewer
5. Create a JSON key → download the file → keep it secure, never commit it

**Step 3 — Share the Sheet with the Service Account**
1. Open the Google Sheet
2. Click Share → paste the service account email (from the JSON key file)
3. Set permission to Viewer (read-only) — not Editor
4. Uncheck "Notify people" → Share

**Step 4 — Set environment variables**
Copy values from the downloaded JSON key file:
```
GOOGLE_SHEET_ID             = [from the Sheet URL — the long alphanumeric string]
GOOGLE_SERVICE_ACCOUNT_EMAIL = client_email from the JSON key file
GOOGLE_PRIVATE_KEY           = private_key from the JSON key file
                               (paste the full value including -----BEGIN/END----- lines)
```
Add these to Vercel Environment Variables (Settings → Environment Variables).
Add the same to `.env.local` for local development.

**Step 5 — Share the Sheet URL with Fechi**
Give Fechi edit access to the sheet using her Google account.
The Service Account only needs Viewer access. Fechi needs Editor access.
Bookmark the sheet URL for her on her phone and laptop.

---

## VALIDATION — RUN AFTER MIGRATION

```bash
# Confirm zero Sanity references remain
grep -r "sanity" . \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --exclude-dir=node_modules \
  --exclude-dir=.git

# Expected output: zero matches
# If any matches appear — fix them before proceeding

# Confirm googleapis is installed
node -e "require('googleapis'); console.log('googleapis OK')"

# Confirm env vars are set
node -e "
  const required = [
    'GOOGLE_SHEET_ID',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'NEXT_PUBLIC_WHATSAPP_NUMBER',
    'DATABASE_URL',
  ];
  required.forEach(key => {
    if (!process.env[key]) console.error('MISSING:', key);
    else console.log('OK:', key);
  });
"

# Test sheet connection
node -e "
  require('dotenv').config({ path: '.env.local' });
  const { getSheetRows } = require('./lib/sheets/client');
  getSheetRows('Products')
    .then(rows => console.log('Products rows fetched:', rows.length))
    .catch(err => console.error('Sheet connection failed:', err.message));
"
```

---

## RULES THAT DO NOT CHANGE

All of the following remain exactly as written in AGENTS.md v1.0.
The migration only affects the CMS layer — nothing else:

- `buildWhatsAppUrl()` in `lib/whatsapp.ts` — unchanged
- `formatNaira()`, `formatDate()`, `isValidNigerianPhone()` in `lib/format.ts` — unchanged
- `trackEvent()` in `lib/analytics.ts` — unchanged
- `/api/analytics` route — unchanged
- PostgreSQL tables (`analytics_events`, `admin_change_log`) — unchanged
- All components in `components/` — unchanged
- All page routes in `app/` — unchanged (imports updated, logic unchanged)
- Design system, colour tokens, typography rules — unchanged
- WCAG 2.1 AA accessibility requirements — unchanged
- Performance gates (Lighthouse ≥ 85, LCP < 2.5s) — unchanged
- Forbidden patterns (hardcoded WhatsApp, inline prices, forbidden fonts) — unchanged
- Nigerian standards (₦, +234, DD/MM/YYYY) — unchanged
- Deployment checklist (except Sanity section replaced above) — unchanged

---

*This migration is complete when:*
*1. zero `lib/sanity` references exist in the codebase*
*2. all 4 sheet tabs exist with correct headers and sample data*
*3. `getAllProducts()` returns real data from the sheet in development*
*4. the site builds and deploys to Vercel without errors*
*5. AGENTS.md has been updated with all changes listed above*
