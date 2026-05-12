# Photoframes by VF — Project Walkthrough

This document provides a technical overview of the **Photoframes by VF** e-commerce platform, detailing its architecture, design system, and implementation details.

## 🏗️ Technical Architecture

The project is built using **Next.js 14** with the **App Router**, leveraging server components for optimal performance and SEO.

### 📊 Data Management (Headless CMS)
Instead of a traditional database for content, the site uses **Google Sheets** as a headless CMS.
- **Client:** `lib/sheets/client.ts` handles the Google Auth (JWT) and data fetching.
- **Queries:** `lib/sheets/queries.ts` transforms raw sheet rows into typed TypeScript objects.
- **Tabs:** Data is synced from `Products`, `Categories`, `Testimonials`, and `Site Settings`.

### 🎨 Design System
The visual identity is driven by a robust token system.
- **Tokens:** Defined in `token-colour.json` and `token-typography.json`.
- **CSS Variables:** `styles/tokens.css` translates these tokens into CSS variables.
- **Tailwind Integration:** `tailwind.config.ts` extends the default theme using these variables, allowing for consistent styling like `bg-primary` or `font-heading`.

## 🚀 Key Features

### 1. Dynamic Product Catalogue
- **Optimization:** Uses `next/image` with specific sizes to ensure fast loading on all devices.

### 2. Premium Testimonials
- Supports both text and video reviews.
- **Video Facade:** The `VideoEmbed` component prevents YouTube iframes from slowing down the initial page load by using a placeholder until clicked.

### 3. WhatsApp & Social Sharing
- A `FloatingWhatsApp` button and contextual CTA buttons allow customers to inquire about products directly.
- **Share Button:** A new "Share" button on product pages leverages the Web Share API for native sharing on mobile and provides a clipboard fallback on desktop, maximizing reach and social presence.
- The phone number is managed via the `Site Settings` sheet.

### 4. Accessibility & UX
- **Mobile Navigation:** Fully accessible with focus traps and keyboard support.
- **Visuals:** Uses `backdrop-blur` on the header and smooth scaling transitions on product cards.

## 📁 Project Structure

```text
├── app/              # Next.js App Router (Pages, Layouts, APIs)
├── components/       # UI & Layout components
│   ├── home/         # Homepage sections
│   ├── product/      # Product-specific logic (Detail, Schema)
│   └── ui/           # Reusable atomic components
├── lib/              # Shared utilities & CMS logic
├── styles/           # Design tokens & global CSS
└── scripts/          # Token generation & utility scripts
```

## 🛠️ Development Workflow

1. **Update Content:** Edit the Google Sheet.
2. **Revalidation:** The site automatically updates every 30 minutes (ISR), or you can trigger a manual build on Vercel.
3. **Design Changes:** Update the `token-*.json` files and run `npm run generate-tokens` to refresh the CSS variables.
