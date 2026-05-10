# Sanity Schema Builder Skill — Photoframes by VF

## Purpose

Create Sanity.io schemas that exactly match PRD v2.0 Section 7 data structures and AGENTS.md Section 5.

---

## Schema Files Structure

```
sanity/
├── schema/
│   ├── index.ts
│   ├── product.ts
│   ├── category.ts
│   ├── testimonial.ts
│   └── siteSettings.ts
└── sanity.config.ts
```

---

## 1. Product Schema

**Path:** `sanity/schema/product.ts`

```typescript
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Product Name',
      validation: (R) => R.required().error('Product name is required'),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name', maxLength: 96 },
      validation: (R) => R.required(),
    },
    {
      name: 'category',
      type: 'reference',
      title: 'Category',
      to: [{ type: 'category' }],
      validation: (R) => R.required(),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Emotionally-written product description (gifting-focused tone)',
      validation: (R) => R.required(),
    },
    {
      name: 'emotionalHeadline',
      type: 'string',
      title: 'Emotional Headline',
      description: 'e.g. "Wear your love story"',
      validation: (R) => R.required(),
    },
    {
      name: 'price',
      type: 'number',
      title: 'Price (₦)',
      description: 'Whole number in Naira — e.g. 25000',
      validation: (R) => R.required().min(0).error('Price must be a positive number'),
    },
    {
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (R) => R.required().min(1).error('At least one image is required'),
    },
    {
      name: 'isCustomisable',
      type: 'boolean',
      title: 'Customisable?',
      description: 'Can the buyer personalise this product?',
      initialValue: false,
    },
    {
      name: 'customisationNote',
      type: 'string',
      title: 'Customisation Note',
      description: 'e.g. "Send your photo via WhatsApp after ordering"',
    },
    {
      name: 'availability',
      type: 'string',
      title: 'Availability',
      options: {
        list: [
          { title: 'In Stock', value: 'in_stock' },
          { title: 'Made to Order', value: 'made_to_order' },
          { title: 'Unavailable', value: 'unavailable' },
        ],
      },
      validation: (R) => R.required(),
    },
    {
      name: 'occasionTags',
      type: 'array',
      title: 'Occasion Tags',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Anniversary', value: 'Anniversary' },
          { title: 'Birthday', value: 'Birthday' },
          { title: 'Wedding', value: 'Wedding' },
          { title: 'Graduation', value: 'Graduation' },
          { title: 'Proposal', value: 'Proposal' },
          { title: 'Corporate', value: 'Corporate' },
          { title: 'General Gift', value: 'General Gift' },
        ],
      },
    },
    {
      name: 'whatsappInquiryText',
      type: 'text',
      title: 'Custom WhatsApp Inquiry Text',
      description: 'Override default inquiry message for this product',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'images.0',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title,
        subtitle: `₦${subtitle?.toLocaleString('en-NG') || 'No price'}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Price (Low to High)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Price (High to Low)',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
  ],
};
```

---

## 2. Category Schema

**Path:** `sanity/schema/category.ts`

```typescript
export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Category Name',
      validation: (R) => R.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name' },
      validation: (R) => R.required(),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Short category tagline (1-2 sentences)',
    },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: { hotspot: true },
    },
    {
      name: 'displayOrder',
      type: 'number',
      title: 'Display Order',
      description: '1 = first, higher numbers appear later',
      initialValue: 99,
    },
    {
      name: 'isActive',
      type: 'boolean',
      title: 'Active?',
      description: 'Show/hide category without deleting',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'displayOrder',
      media: 'coverImage',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title,
        subtitle: `Order: ${subtitle}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
};
```

---

## 3. Testimonial Schema

**Path:** `sanity/schema/testimonial.ts`

```typescript
export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'customerName',
      type: 'string',
      title: 'Customer Name',
      description: 'First name or initials only — privacy protection',
      validation: (R) => R.required(),
    },
    {
      name: 'location',
      type: 'string',
      title: 'Location',
      description: 'Nigerian city — e.g. Lagos, Abuja, Port Harcourt',
    },
    {
      name: 'productType',
      type: 'string',
      title: 'Product Type',
      description: 'e.g. Acrylic Frame, Gold Necklace',
    },
    {
      name: 'reviewText',
      type: 'text',
      title: 'Review Text',
      validation: (R) => R.required(),
    },
    {
      name: 'rating',
      type: 'number',
      title: 'Rating (1-5)',
      validation: (R) => R.required().min(1).max(5).error('Rating must be between 1 and 5'),
    },
    {
      name: 'isVisible',
      type: 'boolean',
      title: 'Visible on Site?',
      description: 'Approve before displaying publicly',
      initialValue: false,
    },
    {
      name: 'date',
      type: 'date',
      title: 'Date',
      options: { dateFormat: 'DD/MM/YYYY' },
    },
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'rating',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title,
        subtitle: `Rating: ${subtitle}/5 ${subtitle >= 4 ? '★' : ''}`,
      };
    },
  },
  initialValue: {
    isVisible: false,
  },
};
```

---

## 4. SiteSettings Schema (Singleton)

**Path:** `sanity/schema/siteSettings.ts`

```typescript
export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // No create/delete — singleton
  fields: [
    {
      name: 'heroHeadline',
      type: 'string',
      title: 'Hero Headline',
      description: 'Main headline on the homepage',
    },
    {
      name: 'heroSubheadline',
      type: 'string',
      title: 'Hero Subheadline',
      description: 'Secondary text below headline',
    },
    {
      name: 'heroCTAPrimary',
      type: 'string',
      title: 'Primary CTA Label',
      description: 'Button that takes users to product gallery',
      initialValue: 'Explore the Collection',
    },
    {
      name: 'heroCTASecondary',
      type: 'string',
      title: 'Secondary CTA Label',
      description: 'Button that opens WhatsApp',
      initialValue: 'Chat on WhatsApp',
    },
    {
      name: 'aboutText',
      type: 'array',
      title: 'About Text',
      description: 'Brand story and Fechi\'s narrative',
      of: [{ type: 'block' }],
    },
    {
      name: 'aboutImage',
      type: 'image',
      title: 'About Image',
      description: 'Image displayed alongside about text',
      options: { hotspot: true },
    },
    {
      name: 'whatsappNumber',
      type: 'string',
      title: 'WhatsApp Number',
      description: 'Nigerian format: +234XXXXXXXXXX',
      validation: (R) =>
        R.required()
          .regex(/^\+234\d{10}$/, 'Must be +234 followed by 10 digits')
          .error('Please enter a valid Nigerian WhatsApp number starting with +234'),
    },
    {
      name: 'instagramHandle',
      type: 'string',
      title: 'Instagram Handle',
      description: 'Without the @ — e.g. photoframesbyvf',
    },
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
};
```

---

## 5. Schema Registration

**Path:** `sanity/schema/index.ts`

```typescript
import product from './product';
import category from './category';
import testimonial from './testimonial';
import siteSettings from './siteSettings';

export const schemaTypes = [product, category, testimonial, siteSettings];
```

---

## 6. Sanity Configuration

**Path:** `sanity/sanity.config.ts`

```typescript
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schema';

export default defineConfig({
  name: 'default',
  title: 'Photoframes by VF',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
```

---

## 7. Validation Rules Summary

| Schema | Required Fields | Special Validation |
|--------|-----------------|-------------------|
| **Product** | name, slug, category, description, emotionalHeadline, price, images, availability | price ≥ 0 |
| **Category** | name, slug | none |
| **Testimonial** | customerName, reviewText, rating | rating 1-5 |
| **SiteSettings** | whatsappNumber | regex `/^\+234\d{10}$/` |

---

## 8. GROQ Query Examples

```typescript
// Get all visible products
const products = await client.fetch(`
  *[_type == "product" && defined(slug.current)] {
    name,
    "slug": slug.current,
    price,
    images[]{
      asset->{
        url
      }
    },
    category->{
      name,
      "slug": slug.current
    }
  }
`);

// Get site settings
const settings = await client.fetch(`
  *[_type == "siteSettings"][0] {
    whatsappNumber,
    instagramHandle,
    heroHeadline,
    heroSubheadline
  }
`);

// Get approved testimonials
const testimonials = await client.fetch(`
  *[_type == "testimonial" && isVisible == true] | order(date desc) {
    customerName,
    location,
    productType,
    reviewText,
    rating,
    date
  }
`);
```

---

## 9. Admin Notes for Fechi (Non-Technical)

| Task | Instructions |
|------|--------------|
| **Add product** | Click "Product" → "Create new" → Fill required fields (red asterisks) → Publish |
| **Update price** | Find product → Edit "Price (₦)" field → Enter number only (e.g. 25000) → Publish |
| **Hide product** | Find product → Toggle "Availability" to "Unavailable" → Publish |
| **Update WhatsApp** | Go to "Site Settings" → Edit "WhatsApp Number" → Enter +234XXXXXXXXXX → Publish |
| **Approve testimonial** | Find testimonial → Check "Visible on Site?" → Publish |
