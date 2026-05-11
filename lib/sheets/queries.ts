import { getSheetRows } from './client';
import type { Product, Category, Testimonial, SiteSettings, ReviewType } from './types';

export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await getSheetRows('Products');
    return rows.map(rowToProduct).filter(p => p.is_visible);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug === slug) ?? null;
}

export async function getProductSlugs(): Promise<{ slug: string }[]> {
  const products = await getProducts();
  return products.map(p => ({ slug: p.slug }));
}

export async function getCategories(): Promise<Category[]> {
  try {
    const rows = await getSheetRows('Categories');
    return rows
      .map(rowToCategory)
      .filter(c => c.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug) ?? null;
}

export async function getCategorySlugs(): Promise<{ slug: string }[]> {
  const categories = await getCategories();
  return categories.map(c => ({ slug: c.slug }));
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.category === categorySlug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const rows = await getSheetRows('Testimonials');
    return rows.map(rowToTestimonial).filter(t => t.is_visible);
  } catch {
    return [];
  }
}

export async function getLatestTestimonials(): Promise<Testimonial[]> {
  const all = await getTestimonials();
  return all.slice(0, 5);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const rows = await getSheetRows('Site Settings');
    if (!rows.length) return null;

    const map = Object.fromEntries(rows.map(([key, value]) => [key, value]));

    return {
      hero_headline: map['hero_headline'] ?? '',
      hero_subheadline: map['hero_subheadline'] ?? '',
      hero_cta_primary: map['hero_cta_primary'] ?? 'Explore the Collection',
      hero_cta_secondary: map['hero_cta_secondary'] ?? 'Chat on WhatsApp',
      about_text: map['about_text'] ?? '',
      about_image: map['about_image'] ?? undefined,
      whatsapp_number: map['whatsapp_number'] ?? '',
      instagram_handle: map['instagram_handle'] ?? '',
    };
  } catch {
    return null;
  }
}

function rowToProduct(row: string[]): Product {
  return {
    name: row[0] ?? '',
    slug: row[1] ?? '',
    category: row[2] ?? '',
    emotional_headline: row[3] ?? '',
    description: row[4] ?? '',
    price: Number(row[5] ?? 0),
    availability: (row[6] ?? 'unavailable') as Product['availability'],
    occasion_tags: (row[7] ?? '').split(',').map(t => t.trim()).filter(Boolean),
    is_customisable: row[8]?.toUpperCase() === 'TRUE',
    customisation_note: row[9] ?? null,
    image_url: row[10] ?? '',
    is_visible: row[11]?.toUpperCase() === 'TRUE',
  };
}

function rowToCategory(row: string[]): Category {
  return {
    name: row[0] ?? '',
    slug: row[1] ?? '',
    description: row[2] ?? '',
    cover_image_url: row[3] ?? '',
    display_order: Number(row[4] ?? 99),
    is_active: row[5]?.toUpperCase() === 'TRUE',
  };
}

function rowToTestimonial(row: string[]): Testimonial {
  const rawType = (row[7] ?? 'text').toLowerCase();
  const validTypes: ReviewType[] = ['text', 'video', 'both'];

  return {
    customer_name: row[0] ?? '',
    location: row[1] ?? null,
    product_type: row[2] ?? null,
    review_text: row[3] ?? '',
    rating: Number(row[4] ?? 5),
    is_visible: row[5]?.toUpperCase() === 'TRUE',
    date: row[6] ?? '',
    review_type: validTypes.includes(rawType as ReviewType) ? (rawType as ReviewType) : 'text',
    video_url: row[8] ?? null,
  };
}
