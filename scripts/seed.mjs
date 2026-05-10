/**
 * Seed script — creates sample categories and products in Sanity.
 * Run: node scripts/seed.mjs
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_TOKEN, NEXT_PUBLIC_SANITY_DATASET in .env.local
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf-8')
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => l.split('=').map((s) => s.trim())),
);
Object.assign(process.env, env);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-03-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function uploadImage(url, filename) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  });
  return asset;
}

const categories = [
  { name: 'Custom Frames', slug: 'custom-frames', description: 'Premium acrylic frames for your most cherished moments', displayOrder: 1 },
  { name: 'Gold Jewellery', slug: 'gold-jewellery', description: 'Non-tarnish gold-layered jewellery pieces', displayOrder: 2 },
];

const products = [
  {
    name: 'Gold Layered Name Necklace',
    slug: 'gold-layered-name-necklace',
    categorySlug: 'gold-jewellery',
    description: 'A stunning gold-layered name necklace crafted to perfection. Personalise with any name and watch your loved one smile. Perfect for anniversaries, birthdays, or just because.',
    emotionalHeadline: 'Wear your love story',
    price: 25000,
    isCustomisable: true,
    customisationNote: 'Send the name you want engraved via WhatsApp after ordering.',
    availability: 'in_stock',
    occasionTags: ['Anniversary', 'Birthday', 'Wedding', 'Proposal', 'General Gift'],
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=750&fit=crop',
  },
  {
    name: 'Personalised Photo Collage Frame',
    slug: 'personalised-photo-collage-frame',
    categorySlug: 'custom-frames',
    description: 'A premium acrylic frame with multiple slots for your favourite photos. Customise the layout and add a engraved message. A timeless keepsake.',
    emotionalHeadline: 'Every picture tells a story',
    price: 35000,
    isCustomisable: true,
    customisationNote: 'Send your photos and layout preference via WhatsApp after ordering.',
    availability: 'in_stock',
    occasionTags: ['Wedding', 'Anniversary', 'Graduation', 'General Gift'],
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=750&fit=crop',
  },
  {
    name: 'Gold Couple Initial Ring',
    slug: 'gold-couple-initial-ring',
    categorySlug: 'gold-jewellery',
    description: 'Elegant gold-layered ring with both your initials. Non-tarnish, comfortable fit, and beautifully packaged. A symbol of your bond.',
    emotionalHeadline: 'Two hearts, one circle',
    price: 18000,
    isCustomisable: true,
    customisationNote: 'Send both initials via WhatsApp after ordering.',
    availability: 'in_stock',
    occasionTags: ['Anniversary', 'Wedding', 'Proposal', 'General Gift'],
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=750&fit=crop',
  },
  {
    name: 'Acrylic Memorial Frame',
    slug: 'acrylic-memorial-frame',
    categorySlug: 'custom-frames',
    description: 'A heartfelt acrylic memorial frame designed to honour and remember loved ones. Comes with space for a photo and a engraved tribute message.',
    emotionalHeadline: 'Forever in our hearts',
    price: 30000,
    isCustomisable: true,
    customisationNote: 'Send the photo and memorial message via WhatsApp after ordering.',
    availability: 'made_to_order',
    occasionTags: ['General Gift'],
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=750&fit=crop',
  },
  {
    name: 'Gold Personalised Bracelet',
    slug: 'gold-personalised-bracelet',
    categorySlug: 'gold-jewellery',
    description: 'A delicate gold-layered bracelet with a personalised charm. Non-tarnish and adjustable. Perfect for layering or wearing solo.',
    emotionalHeadline: 'Adorn every moment',
    price: 22000,
    isCustomisable: true,
    customisationNote: 'Send the name or initial for the charm via WhatsApp after ordering.',
    availability: 'in_stock',
    occasionTags: ['Birthday', 'Anniversary', 'Graduation', 'General Gift'],
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=750&fit=crop',
  },
  {
    name: 'Wedding Portrait Acrylic Frame',
    slug: 'wedding-portrait-acrylic-frame',
    categorySlug: 'custom-frames',
    description: 'A large premium acrylic frame designed specifically for wedding portraits. Crystal-clear finish that makes your photo the centrepiece.',
    emotionalHeadline: 'Your perfect day, perfectly framed',
    price: 45000,
    isCustomisable: false,
    availability: 'made_to_order',
    occasionTags: ['Wedding', 'Anniversary'],
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=750&fit=crop',
  },
  {
    name: 'Gold Earring Set',
    slug: 'gold-earring-set',
    categorySlug: 'gold-jewellery',
    description: 'A set of three gold-layered earring styles — studs, hoops, and drops. Non-tarnish, lightweight, and suitable for all skin types.',
    emotionalHeadline: 'Complete the look',
    price: 28000,
    isCustomisable: false,
    availability: 'in_stock',
    occasionTags: ['Birthday', 'Wedding', 'Graduation', 'General Gift'],
    imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&h=750&fit=crop',
  },
  {
    name: 'Custom Family Photo Frame',
    slug: 'custom-family-photo-frame',
    categorySlug: 'custom-frames',
    description: 'A beautiful acrylic frame customised with your family photo. Add names and a special date to make it truly yours.',
    emotionalHeadline: 'Family, framed in gold',
    price: 32000,
    isCustomisable: true,
    customisationNote: 'Send your photo, names, and date via WhatsApp after ordering.',
    availability: 'in_stock',
    occasionTags: ['Anniversary', 'Birthday', 'General Gift'],
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&h=750&fit=crop',
  },
  {
    name: 'Corporate Gift Acrylic Plaque',
    slug: 'corporate-gift-acrylic-plaque',
    categorySlug: 'custom-frames',
    description: 'Premium acrylic plaque perfect for corporate recognitions, awards, and farewell gifts. Custom engraving with company logo and message.',
    emotionalHeadline: 'Excellence deserves recognition',
    price: 38000,
    isCustomisable: true,
    customisationNote: 'Send logo, names, and message via WhatsApp after ordering. Bulk discounts available.',
    availability: 'made_to_order',
    occasionTags: ['Corporate'],
    imageUrl: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=600&h=750&fit=crop',
  },
  {
    name: 'Gold Anklet',
    slug: 'gold-anklet',
    categorySlug: 'gold-jewellery',
    description: 'A delicate gold-layered anklet with adjustable chain. Non-tarnish, water-resistant, and perfect for everyday wear or special occasions.',
    emotionalHeadline: 'Step out in style',
    price: 15000,
    isCustomisable: false,
    availability: 'in_stock',
    occasionTags: ['Birthday', 'Graduation', 'General Gift'],
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&h=750&fit=crop',
  },
];

async function seed() {
  console.log('Starting seed...\n');

  const categoryIds = {};
  for (const cat of categories) {
    const existing = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug: cat.slug });
    if (existing) {
      console.log(`Category "${cat.name}" already exists, skipping`);
      categoryIds[cat.slug] = existing._id;
    } else {
      const doc = await client.create({
        _type: 'category',
        name: cat.name,
        slug: { _type: 'slug', current: cat.slug },
        description: cat.description,
        displayOrder: cat.displayOrder,
        isActive: true,
      });
      console.log(`Created category: ${cat.name}`);
      categoryIds[cat.slug] = doc._id;
    }
  }

  console.log('');

  let created = 0;
  for (const prod of products) {
    const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: prod.slug });
    if (existing) {
      console.log(`Product "${prod.name}" already exists, skipping`);
      continue;
    }

    let imageAsset;
    try {
      console.log(`  Uploading image for "${prod.name}"...`);
      imageAsset = await uploadImage(prod.imageUrl, `${prod.slug}.jpg`);
    } catch (err) {
      console.error(`  Image upload failed for "${prod.name}" — creating without image`);
    }

    const doc = await client.create({
      _type: 'product',
      name: prod.name,
      slug: { _type: 'slug', current: prod.slug },
      category: { _type: 'reference', _ref: categoryIds[prod.categorySlug] },
      description: prod.description,
      emotionalHeadline: prod.emotionalHeadline,
      price: prod.price,
      images: imageAsset ? [{ _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } }] : [],
      isCustomisable: prod.isCustomisable,
      customisationNote: prod.customisationNote,
      availability: prod.availability,
      occasionTags: prod.occasionTags,
      isVisible: true,
    });
    console.log(`Created product: ${prod.name} (₦${prod.price.toLocaleString()})`);
    created++;
  }

  console.log(`\nDone! Created ${created} new products.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
