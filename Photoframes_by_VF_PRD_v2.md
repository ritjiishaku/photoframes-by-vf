# PRODUCT REQUIREMENT DOCUMENT

## Photoframes by VF

### Premium Gifting & Custom Jewellery Web Application

| | |
|---|---|
| **Document Version** | v1.0 |
| **Prepared For** | Fechi Godwin |
| **Business** | Photoframes by VF |
| **Date** | 09/05/2025 |
| **Status** | Ready for Development |

---

## 1. Executive Summary

Photoframes by VF is a Nigerian premium gifting brand owned by Fechi Godwin, offering custom acrylic photo frames, frameless artwork displays, and non-tarnish gold-layered jewellery. The business currently operates informally through social media channels, resulting in low visibility and limited customer reach.

This document defines the requirements for a fast, elegant, mobile-first web application that will serve as the brand's primary digital presence. The app is designed to showcase products, drive WhatsApp-based inquiries, and convert visitors into paying customers — without requiring online payment processing or user authentication at this stage.

| | |
|---|---|
| **Document Purpose** | Define requirements for the Photoframes by VF web app |
| **Business Owner** | Fechi Godwin |
| **Country** | Nigeria |
| **Currency** | Nigerian Naira (₦) |
| **Primary CTA** | WhatsApp inquiry |
| **Target Launch** | As soon as possible |

---

## 2. Business Overview

### 2.1 Products & Services

Photoframes by VF offers two core product lines:

- **Photo Frames:** Enlarged pictures and artworks in acrylic frames and frameless designs
- **Jewellery:** Customised non-tarnish gold-layered jewellery pieces

### 2.2 Problem Statement

The business currently faces three primary challenges:

- **Low visibility:** No dedicated digital presence beyond social media
- **Limited reach:** Target audience cannot easily discover the brand online
- **Low engagement:** No structured platform to showcase products or capture inquiries

### 2.3 Success Metrics

The project is considered successful when the following outcomes are observed:

| Metric | Target Outcome |
|--------|----------------|
| **Discovery** | More target customers find the brand online |
| **Engagement** | Visitors browse products and spend time on site |
| **Inquiries** | More customers initiate WhatsApp conversations |
| **Orders** | Increase in completed purchases via WhatsApp |
| **Retention** | Repeat customers and referrals from social sharing |

### 2.4 Target Audience

The primary users of the web application are:

- **Couples & Relationships:** Boyfriends, girlfriends, spouses, fiancés seeking meaningful gifts
- **Milestone Celebrators:** New parents, graduates, newly engaged, recently promoted individuals
- **Gift Buyers:** Friends, siblings, colleagues, event attendees
- **Fashion-Conscious Women:** Style-forward women and content creators
- **Event-Based Buyers:** Wedding guests, proposal setups, souvenir buyers
- **Corporate Buyers:** Businesses sourcing branded gifts and client appreciation items

---

## 3. Market Intelligence

### 3.1 Market Overview

The Nigerian custom framing and gifting market is growing rapidly, driven by increased demand for personalised products in urban centres. The acrylic frame segment alone is estimated at $15.3 million annually, with a 12.7% CAGR projected through 2027. Lagos accounts for approximately 42% of demand, followed by Abuja (28%) and Port Harcourt (17%). The custom jewellery gifting sector is similarly expanding, fuelled by a culture of celebration, milestone gifting, and the growing influence of social media aesthetics.

### 3.2 Competitor Analysis

| Competitor | Products | Strengths | Weaknesses | Positioning |
|------------|----------|-----------|------------|-------------|
| **Framegidi** | Custom framing (acrylic, canvas) | Online ordering, national delivery, upload-and-order flow | No jewellery offering; functional but not luxury-positioned | Tech-forward, convenience-first |
| **iPrints Nigeria** | Acrylic frames, canvas prints | UV printing tech, Lagos-based, variety of sizes | Generic website aesthetic; no emotional gifting angle | Volume/commercial printing |
| **Acrylic Frame Nigeria** | Acrylic frames only (specialist) | Niche focus, WhatsApp-driven trust-building (video call before payment) | Single product category; limited gifting narrative | Trust & transparency |
| **Hazken Digital** | Fibre frames, acrylic, table-top | Affordable pricing (from ₦8,000), fast 1-2 day delivery in Lagos | Non-premium look and feel; no jewellery | Budget-friendly, fast turnaround |
| **Framedinlagos** | Framing, artworks, interior decor | Broad product range, international delivery, established brand | Not emotionally positioned; feels like a catalogue | Interior decor, volume |
| **Foto Art Plus** | Acrylic, canvas, albums, general printing | Multi-service, corporate clients, Ikeja showroom | Very broad — diluted focus; no gifting or jewellery angle | B2B and professional print |
| **Saint Tracy** | Luxury gold & diamond jewellery | Premium brand, multi-city stores, luxury packaging | No photo frame offering; high price point | Ultra-premium jewellery |
| **Zavandi Jewelry** | 18k/14k solid gold jewellery | Bespoke rings/pendants, warranty, professional | No frames; institutional pricing | Bespoke fine jewellery |

### 3.3 Competitive Advantage — Photoframes by VF

Photoframes by VF occupies a unique and largely uncontested position in the Nigerian market:

- **Dual product offering:** No direct competitor combines premium custom photo frames with gold-layered jewellery under a single gifting brand
- **Luxury-gifting positioning:** Most frame competitors are functional/affordable; most jewellery brands are either mass-market or ultra-premium. Photoframes by VF sits in the premium-but-accessible gifting sweet spot
- **Emotional narrative:** The brand's gift-oriented messaging is absent from almost all frame competitors in Nigeria
- **Non-tarnish jewellery:** This durability feature is a meaningful differentiator against fashion-jewellery competitors

### 3.4 SWOT Analysis

| STRENGTHS | WEAKNESSES |
|-----------|------------|
| • Unique dual-product offering (frames + jewellery) in one gifting brand | • No existing web presence — zero SEO authority at launch |
| • Non-tarnish gold jewellery is a durable, premium differentiator | • Brand visibility entirely dependent on social media currently |
| • Strong gift-oriented emotional positioning | • No structured inquiry or order tracking system |
| • Existing product images, logo, and brand content ready | • Admin content updates currently require technical assistance |
| • WhatsApp-native business model aligns with Nigerian buyer behaviour | • Single owner — limited capacity to scale without systems |
| • Low overhead — made-to-order model reduces inventory risk | • Inconsistent brand positioning without a defined digital home |

| OPPORTUNITIES | THREATS |
|---------------|---------|
| • Nigerian gifting market growing rapidly — acrylic frames at 12.7% CAGR | • Established competitors (Framegidi, Foto Art Plus) have SEO head-start |
| • No competitor combines premium frames + jewellery under a gifting brand | • Nigerian naira volatility can impact raw material costs and pricing |
| • Instagram and WhatsApp deeply embedded in Nigerian buyer discovery | • Low switching cost for customers — gifting market is impulse-driven |
| • Corporate gifting segment (client appreciation, branded souvenirs) is underserved | • Instagram algorithm changes can reduce organic reach overnight |
| • SEO: near-zero competition for 'acrylic frames gift Nigeria' type queries | • WhatsApp-only competitors offer lower friction for first-time buyers |
| • Diaspora market: Nigerians abroad seeking personalised hometown gifts | • Custom import delays raising acrylic material costs by up to 22% |

---

## 4. Product Goals & Scope

### 4.1 In Scope (Version 1.0)

- Product showcase with category browsing
- WhatsApp-integrated inquiry flow (persistent floating CTA)
- Mobile-first responsive design (375px and above)
- Instagram integration (link or feed)
- Admin-manageable content (without developer dependency)
- SEO-optimised structure with meta tags, Open Graph, and sitemap
- Fast-loading performance (under 3 seconds on Nigerian 3G/4G)
- Accessibility: WCAG 2.1 AA compliant
- Testimonials section
- About / brand story section

### 4.2 Out of Scope (Version 1.0)

- Online payment processing
- User accounts or login system
- Complex admin dashboard
- Cart or checkout functionality
- Delivery tracking system
- Email marketing integration

### 4.3 Future Considerations (Version 2.0+)

The following features may be scoped in future releases based on business growth:

- Integrated payment gateway (Paystack or Flutterwave — Nigerian standards)
- Order management system
- Customer review submission (public-facing)
- Loyalty or referral programme
- WhatsApp Business API integration for automated responses

---

## 5. User Flow & Journey Map

### 5.1 Primary Flow

| Step | Screen | User Action | System Response |
|------|--------|-------------|-----------------|
| **1** | Landing / Hero | Arrives on homepage | Display hero headline, product categories, floating WhatsApp CTA |
| **2** | Browse Categories | Taps a product category | Show filtered product grid / masonry gallery |
| **3** | Product Gallery | Scrolls through products | Lazy-load images; display name, price (₦), and short tag |
| **4** | Product Detail | Taps a product | Show full image, description, customisation note, WhatsApp CTA |
| **5** | WhatsApp CTA | Taps 'Chat on WhatsApp' | Open WhatsApp with pre-filled product inquiry message |
| **6** | WhatsApp Chat | Sends inquiry to Fechi | Business owner receives and responds to close the sale |

### 5.2 Secondary Flows

- **Impulse Inquiry:** Hero → Floating WhatsApp button → WhatsApp chat (no browsing required)
- **Social Discovery:** Instagram → Web app → Product detail → WhatsApp
- **Return Visit:** Direct URL / bookmark → Product gallery → WhatsApp
- **Corporate Inquiry:** Any page → 'Bulk / Corporate Orders' link → WhatsApp with corporate pre-fill

---

## 6. Functional Requirements

### 6.1 Core Pages & Components

| Page / Component | Description | Priority |
|------------------|-------------|----------|
| **Hero Section** | Full-width emotional headline, subheadline, two CTAs: View Collection + Chat on WhatsApp | Critical |
| **Category Navigation** | Filterable tabs or grid: Acrylic Frames, Frameless, Gold Jewellery, Couple Gifts, Event Souvenirs | Critical |
| **Product Gallery** | Masonry / Pinterest-style grid; each tile shows image, name, price (₦), and tag | Critical |
| **Product Detail View** | Full image, name, price (₦), description, customisation note, WhatsApp inquiry CTA | Critical |
| **Floating WhatsApp Button** | Persistent across all pages; bottom-right position; pre-fills context in WhatsApp | Critical |
| **About / Brand Story** | Fechi's story, brand values, emotional gifting narrative | High |
| **Testimonials Section** | Customer reviews with name, location, product type, star rating | High |
| **Instagram Integration** | Feed embed or link with follow CTA in footer or gallery section | High |
| **Footer** | Contact info, WhatsApp number (+234 format), Instagram handle, navigation links | High |
| **SEO Meta / OG Tags** | Title, description, Open Graph image, Twitter card per page | Critical |
| **Sitemap** | Auto-generated or manually defined sitemap.xml for all key pages | High |

### 6.2 WhatsApp Inquiry Behaviour

WhatsApp is the primary conversion mechanism. The following pre-filled messages must be generated dynamically per context:

**Product-specific:**

```
Hello! I'm interested in [Product Name] (Category: [Category]). Could you share more details, availability, and pricing? Thank you.
```

**General inquiry:**

```
Hello! I came across Photoframes by VF and would love to know more about your products. Could you help me?
```

**Corporate/bulk:**

```
Hello! I'm interested in bulk/corporate orders from Photoframes by VF. Could we discuss options and pricing?
```

WhatsApp number must be stored in Nigerian format: `+234XXXXXXXXXX`

---

## 7. Data Schemas

The following schemas define the core data structures the app must support. All schemas are stack-agnostic and aligned to Nigerian standards (₦ currency, DD/MM/YYYY date format, +234 phone format).

### 7.1 Product Schema

| Field | Type | Description |
|-------|------|-------------|
| **id** | Unique ID | System-generated unique identifier |
| **name** | String | Product display name |
| **slug** | String | URL-friendly version of name (e.g. gold-pendant-necklace) |
| **category** | Enum | acrylic_frame \| frameless_design \| gold_jewellery \| couple_gift \| event_souvenir |
| **description** | String | Emotionally-written product description (gifting-focused tone) |
| **price** | Number | Price in Nigerian Naira (₦) — whole numbers, no kobo unless specified |
| **price_display** | String | Formatted for display, e.g. '₦25,000' |
| **images** | Array | Image references: [primary, gallery_1, gallery_2, ...] |
| **is_customisable** | Boolean | Can the buyer personalise this product? |
| **customisation_note** | String \| null | e.g. 'Upload your photo via WhatsApp after ordering' |
| **availability** | Enum | in_stock \| made_to_order \| unavailable |
| **tags** | Array | e.g. [gift, couples, anniversary, graduation, corporate] |
| **whatsapp_inquiry_text** | String | Pre-filled WhatsApp message template for this product |
| **created_at** | Date | DD/MM/YYYY — Nigerian date format |
| **updated_at** | Date | DD/MM/YYYY — updated on each admin edit |

### 7.2 Product Category Schema

| Field | Type | Description |
|-------|------|-------------|
| **id** | Unique ID | System-generated unique identifier |
| **name** | String | Display name, e.g. 'Acrylic Frames' |
| **slug** | String | URL-friendly, e.g. 'acrylic-frames' |
| **description** | String | Short category tagline (1-2 sentences) |
| **cover_image** | Image Ref | Primary image shown on category card |
| **display_order** | Number | Controls display order on site (1 = first) |
| **is_active** | Boolean | Admin can show/hide a category without deleting it |

### 7.3 WhatsApp Inquiry Schema

No backend form submission is required. This schema defines the pre-filled message generated per product or context.

| Field | Type | Description |
|-------|------|-------------|
| **inquiry_type** | Enum | product_specific \| general \| custom_order \| corporate |
| **product_name** | String \| null | Populated if inquiry_type = product_specific |
| **product_category** | String \| null | Populated if inquiry_type = product_specific |
| **customer_message** | String | Pre-filled message template sent to WhatsApp |
| **whatsapp_number** | String | Nigerian format: +234XXXXXXXXXX |
| **generated_url** | String | wa.me deep link with URL-encoded message |

### 7.4 Admin Content Schema

| Field | Type | Description |
|-------|------|-------------|
| **section** | Enum | hero \| about \| product_listing \| category \| testimonial \| instagram_link \| contact_info |
| **label** | String | Human-readable section name for admin UI |
| **content_type** | Enum | text \| image \| link \| boolean |
| **current_value** | Mixed | String, image reference, or boolean depending on content_type |
| **last_updated** | Date | DD/MM/YYYY |
| **updated_by** | String | Defaults to 'admin' |

### 7.5 Testimonial Schema

| Field | Type | Description |
|-------|------|-------------|
| **id** | Unique ID | System-generated unique identifier |
| **customer_name** | String | First name or initials only — privacy protection |
| **location** | String \| null | Nigerian city, e.g. 'Lagos', 'Abuja', 'Port Harcourt' |
| **product_type** | String \| null | e.g. 'Acrylic Frame', 'Gold Necklace' |
| **review_text** | String | Customer's own words — displayed verbatim |
| **rating** | Number | Integer 1-5 (star rating) |
| **is_visible** | Boolean | Admin toggles display without deleting the record |
| **date** | Date | DD/MM/YYYY — Nigerian date format |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Requirement | Standard |
|-------------|----------|
| **Page load time** | Under 3 seconds on Nigerian 3G/4G mobile network |
| **Image delivery** | Compressed and served in modern formats where supported |
| **Lazy loading** | All gallery and product images below the fold must lazy-load |
| **Render-blocking scripts** | None on initial page load — defer all non-critical scripts |
| **Core Web Vitals** | LCP < 2.5s, FID < 100ms, CLS < 0.1 (Google standards) |

### 8.2 Accessibility

- WCAG 2.1 AA standard as a minimum baseline
- All product and brand images must include descriptive alt text
- WhatsApp CTA must be reachable via keyboard navigation and screen reader
- Minimum colour contrast ratio of 4.5:1 for all body text
- Minimum font size of 14px on mobile viewports
- Focus states must be visible on all interactive elements

### 8.3 SEO & Discoverability

| SEO Element | Requirement |
|-------------|-------------|
| **Page title & meta description** | Keyword-rich, unique per page |
| **Open Graph tags** | Required for WhatsApp and Instagram link previews |
| **Structured data** | Product schema markup for search engine rich results |
| **URL structure** | Clean, human-readable — e.g. `/frames/acrylic-frames` |
| **Image alt text** | Descriptive alt on every product and brand image |
| **Sitemap** | sitemap.xml covering all key pages |
| **Mobile-friendliness** | Required — Google's primary mobile-first ranking signal |

**Recommended SEO keyword targets at launch:**

- "custom photo frames Nigeria"
- "acrylic frames Lagos"
- "gold jewellery gifts Nigeria"
- "personalised gifts Nigeria"
- "custom frames for couples"

---

## 9. Design Guidelines

### 9.1 Visual Identity

| Element | Direction |
|---------|-----------|
| **Overall feel** | Minimal, rich, editorial — luxury jewellery brand lookbook aesthetic |
| **Layout** | Pinterest-inspired masonry or clean grid; generous whitespace |
| **Primary surface** | Deep black or dark charcoal |
| **Accent colour** | Warm gold tones (exact values defined in separate design token file) |
| **Background** | Ivory or champagne white |
| **Text on dark** | Off-white |
| **Text on light** | Near-black |
| **Heading font** | Refined serif display font — conveys heritage, elegance, weight |
| **Body font** | Clean, modern sans-serif — readable, contemporary, airy |
| **Avoid** | Generic system fonts (Arial, Inter, Roboto), purple gradients, template layouts |

### 9.2 Brand Voice

| Instead of writing this... | Write this instead |
|---------------------------|-------------------|
| "We sell photo frames." | "Celebrate love with a frame that lasts forever." |
| "Buy jewellery here." | "Wear something as unique as the moment you're marking." |
| "Contact us." | "Let's create something beautiful together." |
| "View products." | "Explore the collection." |
| "Custom orders available." | "Every piece is made for your moment — tell us your story." |

---

## 10. Content Management Requirements

Fechi Godwin must be able to manage routine content updates independently — without developer involvement. The implementation approach (CMS tool, config file, spreadsheet-driven, headless solution) is a developer decision based on the chosen stack.

| Section | Admin Can Update |
|---------|------------------|
| **Hero** | Headline text, subheadline, CTA button labels |
| **Product listings** | Add, edit, or hide products; update price (₦), images, descriptions |
| **Categories** | Rename, reorder, show/hide categories |
| **Testimonials** | Add, approve, or hide customer reviews |
| **Contact info** | WhatsApp number (+234 format), Instagram handle |
| **About section** | Business story text and brand image |
| **SEO fields** | Page titles, meta descriptions per page |

---

## 11. Fallback Behaviour & Error Handling

| Scenario | Fallback Action |
|----------|-----------------|
| **Product image fails to load** | Display branded placeholder — logo on neutral background; never broken icon |
| **WhatsApp link is broken** | Display business phone number (+234 format) as visible fallback text |
| **Instagram embed unavailable** | Replace with static 'Follow us on Instagram' button linking to profile |
| **Admin cannot update content** | Developer provides clearly labelled, plain-language editable sections |
| **Feature conflicts with luxury minimalism** | Recommend simpler premium alternative; explain UX benefit in writing |
| **Brand information is missing** | Default to Nigerian luxury gifting conventions; label assumption clearly |
| **Requirements are unclear** | Default to mobile-first, fast-loading, WhatsApp-inquiry-focused solution |
| **App loads slowly on mobile** | Prioritise critical content first; defer all non-essential assets |
| **Pre-filled WhatsApp message too long** | Truncate gracefully; ensure product name and CTA remain intact |

---

## 12. Assumptions & Open Questions

### 12.1 Assumptions Made

- The business owner will supply all product images, the logo, and brand content before development begins
- WhatsApp Business number is active and in Nigerian format (+234)
- The Instagram account is active and publicly accessible
- Products are made-to-order; no real-time inventory tracking is required in v1.0
- The business primarily serves customers within Nigeria, with potential diaspora reach
- Pricing is in Nigerian Naira (₦) and subject to change by admin at any time

### 12.2 Open Questions for Client

| # | Question | Why It Matters |
|---|----------|----------------|
| **1** | What is the WhatsApp Business number in +234 format? | Required for all CTA links |
| **2** | What is the Instagram handle? | Required for integration and footer link |
| **3** | Do you want prices displayed publicly, or hidden (inquiry only)? | Affects product detail design |
| **4** | Are all products made-to-order, or are some always in stock? | Affects availability display logic |
| **5** | Do you want a separate 'Corporate Gifts' page or section? | High-value audience segment |
| **6** | Should the site be available in English only? | Affects scope if Yoruba/Igbo/Pidgin is desired |
| **7** | Do you have an existing domain name, or does one need to be registered? | Affects deployment planning |
| **8** | Who is the hosting/domain provider, or does this need to be arranged? | Affects deployment planning |

---

## 13. Analytics & Tracking Requirements

Without measurement, the success metrics defined in Section 2 cannot be verified. Analytics must be built in from launch — not added as an afterthought. All tracking must respect user privacy and comply with applicable Nigerian data regulations.

### 13.1 Primary Conversion Event

The single most important measurable action on this site is a WhatsApp CTA click. Every analytics setup must treat this as the primary conversion event.

| Event | Trigger | Priority |
|-------|---------|----------|
| **WhatsApp CTA click** | Any WhatsApp button or link tapped/clicked | Critical |
| **Product view** | User opens a product detail page or card | High |
| **Category click** | User filters or taps a product category | High |
| **Instagram link click** | User taps the Instagram follow link | Medium |
| **Hero CTA click** | 'View Collection' or 'Chat on WhatsApp' in hero | High |
| **Page scroll depth** | User scrolls 25%, 50%, 75%, 100% of a page | Medium |
| **Session duration** | Time spent on site per visit | Medium |

### 13.2 Traffic Source Attribution

Understanding where visitors come from is essential for deciding where to invest marketing effort. The following sources must be distinguishable in analytics:

- Organic search (Google, Bing)
- Instagram (link in bio, story swipe-up, DM link)
- WhatsApp shares (when someone shares the site link via chat)
- Direct (typed URL or bookmark)
- Referral (other websites linking to the brand)

### 13.3 Reporting Baseline

The following metrics must be reviewable by the developer or business owner at a minimum monthly cadence:

- Total visitors per month
- WhatsApp click-through rate (clicks / visitors)
- Top-performing product pages by views
- Top traffic sources
- Most-viewed product categories

> **Note:** The specific analytics tool is a developer decision based on the chosen stack. The requirement is that the above data is measurable and accessible without developer assistance.

---

## 14. Security & Abuse Prevention

Even a brochure-style site without user accounts or payments requires basic security hygiene. These requirements protect both the business and its visitors.

| Requirement | Standard |
|-------------|----------|
| **HTTPS** | All pages must be served over HTTPS. HTTP requests must redirect to HTTPS automatically. |
| **WhatsApp link validation** | All wa.me links must be tested before deployment. Broken links must trigger the fallback defined in Section 11. |
| **Admin content sanitisation** | Any admin-entered text rendered on the public site must be sanitised to prevent layout breakage or injection. Plain text only in display fields. |
| **Image upload validation** | Admin image uploads must be validated for file type (JPG, PNG, WebP only) and size (max 5MB per image before compression). |
| **No exposed credentials** | No API keys, WhatsApp numbers in raw source, or admin credentials must be visible in public-facing code or source markup. |
| **Dependency hygiene** | All third-party packages and libraries used must be from maintained, trusted sources. No abandoned dependencies. |

---

## 15. Deployment & Environment Requirements

These requirements define what the production environment must provide. The choice of hosting provider and deployment method is left to the developer — these are the outcomes required, not the tools.

### 15.1 Production Environment

- Site must be served on a custom domain (domain registration status to be confirmed — see Section 12.2, Q7 and Q8)
- HTTPS must be active on all routes from day one
- A global CDN (Content Delivery Network) must be used to ensure fast delivery to visitors across Nigeria and diaspora locations
- The production build must be separate from any local development or staging environment
- Redeployment (e.g. after a product update) must not cause downtime visible to users

### 15.2 Admin Content Updates

- Admin content updates must not require a new code deployment to take effect
- If a deployment is required for any reason, it must complete in under 5 minutes
- The deployment process must be documented in plain language for the developer's handoff notes

### 15.3 Uptime & Reliability

- Target uptime: 99.5% or above (standard for shared/managed hosting in Nigeria)
- If the hosting provider experiences outages, the error page shown to users must be branded — not a generic server error page

---

## 16. Monitoring & Logging

Silent failures cost the business real inquiries and revenue. The following monitoring requirements ensure that if something breaks, it is detected quickly — ideally before a customer notices.

### 16.1 What Must Be Monitored

| Item | How | Alert Threshold |
|------|-----|-----------------|
| **WhatsApp CTA links** | Automated link check on each deployment | Alert if any wa.me link returns an error |
| **Page load errors (4xx/5xx)** | Error logging on all routes | Alert if any page returns a 5xx error |
| **Broken image links** | Automated check post-deployment | Alert if any product image fails to load |
| **Uptime** | Uptime monitoring ping every 5 minutes | Alert if site is unreachable for more than 2 minutes |
| **Admin content changes** | Change log with timestamp and field name | Logged; no alert required |

### 16.2 Alert Routing

Alerts for critical failures (site down, broken WhatsApp links) must be routed to the developer's preferred notification channel (email, SMS, or monitoring dashboard). The business owner does not need to manage this — it is a developer responsibility.

---

## 17. Admin Experience Standards

The admin (Fechi Godwin) is a non-technical user. The content management interface — whatever form it takes — must meet these experience standards. These are measurable requirements, not design suggestions.

### 17.1 Usability Standards

| Task | Standard |
|------|----------|
| **Add a new product** | Completable by a non-technical user with no instructions beyond field labels |
| **Update a product price (₦)** | Single field change — must not require touching any other field or republishing the whole site |
| **Upload a product image** | Must accept JPG, PNG, or WebP; must validate and reject unsupported formats with a clear message |
| **Hide a product without deleting it** | Must be a single toggle — no deletion required to temporarily remove a product from display |
| **Update the WhatsApp number** | Single field — change must propagate to all CTA links site-wide automatically |
| **Add a customer testimonial** | Form must include: name, location (optional), product type (optional), review text, rating (1-5) |

### 17.2 Product Content Template

Every product entered by the admin must follow this content structure. The admin interface must prompt for each field, and the developer must ensure incomplete entries cannot be published without the required fields.

| Field | Required? | Guidance for Admin |
|-------|-----------|-------------------|
| **Product name** | Required | Short, specific — e.g. 'Gold Layered Name Necklace' |
| **Emotional headline** | Required | One line that speaks to feeling — e.g. 'Wear your love story' |
| **Short description** | Required | 2-3 sentences. Focus on the occasion and the feeling, not just the product. |
| **Occasion tags** | Required | Select all that apply: Anniversary, Birthday, Wedding, Graduation, Proposal, Corporate, General Gift |
| **Price (₦)** | Required | Whole number in Naira — e.g. 25000. System formats as ₦25,000 automatically. |
| **Primary image** | Required | Clear product photo on neutral background. Minimum 800px wide. |
| **Gallery images** | Optional | Up to 3 additional images showing different angles or contexts |
| **Customisation note** | Optional | e.g. 'Send your photo via WhatsApp after ordering'. Only fill if product is customisable. |
| **Availability** | Required | Select: In Stock / Made to Order / Unavailable |

### 17.3 Error Prevention Rules

- Admin must not be able to publish a product without a name, price, primary image, and availability status
- Price field must accept numbers only — the ₦ symbol and comma formatting are applied by the system, not the admin
- WhatsApp number field must validate Nigerian format (+234XXXXXXXXXX) before saving
- If an image upload fails, the admin must see a specific error — not a blank field or silent failure
- Deleting a category that contains active products must prompt a warning: 'This category contains X products. Move them before deleting.'

---

## 18. Scalability Requirements

The v1.0 scope is intentionally minimal. However, the architecture must be designed so that the features listed below can be added in future versions without requiring a full rebuild of the system.

| Future Feature | v1.0 Preparation Required | Target Version |
|----------------|--------------------------|----------------|
| **Online payment (Paystack / Flutterwave)** | Product schema must include price as a number field — not display-only text | v2.0 |
| **Order management system** | WhatsApp inquiry schema must be extensible to include order_id and status fields | v2.0 |
| **Customer accounts & login** | No auth system in v1.0, but routing and page structure must not hardcode assumptions against it | v2.0 |
| **Automated WhatsApp responses** | WhatsApp number must be stored as a single configurable value — not hardcoded in multiple places | v2.0 |
| **Product reviews (public submission)** | Testimonial schema already supports this — admin approval flow needs to be added | v2.0 |
| **Multi-language support (Yoruba, Igbo, Pidgin)** | All display text must be stored in a single layer — not scattered in markup — to allow translation | v3.0 |
| **Delivery tracking integration** | Product schema must support future order_id linkage | v3.0 |
