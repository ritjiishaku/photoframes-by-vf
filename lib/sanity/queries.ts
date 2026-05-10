import { client } from './client';
import type { Product, Category, Testimonial, SiteSettings, ProductSlug, CategorySlug } from './types';

const productsQuery = `*[_type == "product" && isVisible == true] | order(name asc) {
  _id,
  name,
  slug,
  "category": category->{ _id, name, slug },
  description,
  emotionalHeadline,
  price,
  images,
  isCustomisable,
  customisationNote,
  availability,
  occasionTags,
  whatsappInquiryText,
  "imageUrl": images[0],
}`;

const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  "category": category->{ _id, name, slug },
  description,
  emotionalHeadline,
  price,
  images,
  isCustomisable,
  customisationNote,
  availability,
  occasionTags,
  whatsappInquiryText,
}`;

const productSlugsQuery = `*[_type == "product" && isVisible == true]{ "slug": slug.current }`;

const categoriesQuery = `*[_type == "category" && isActive == true] | order(displayOrder asc) {
  _id,
  name,
  slug,
  description,
  coverImage,
  displayOrder,
  isActive,
}`;

const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  description,
  coverImage,
}`;

const categorySlugsQuery = `*[_type == "category" && isActive == true]{ "slug": slug.current }`;

const productsByCategoryQuery = `*[_type == "product" && isVisible == true && category->slug.current == $slug] | order(name asc) {
  _id,
  name,
  slug,
  "category": category->{ _id, name, slug },
  description,
  emotionalHeadline,
  price,
  images,
  isCustomisable,
  customisationNote,
  availability,
  occasionTags,
  "imageUrl": images[0],
}`;

const testimonialsQuery = `*[_type == "testimonial" && isVisible == true] | order(date desc) {
  _id,
  customerName,
  location,
  productType,
  reviewText,
  rating,
  date,
}`;

const latestTestimonialsQuery = `*[_type == "testimonial" && isVisible == true] | order(date desc) [0...5] {
  _id,
  customerName,
  location,
  productType,
  reviewText,
  rating,
  date,
}`;

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  heroHeadline,
  heroSubheadline,
  heroCTAPrimary,
  heroCTASecondary,
  aboutText,
  aboutImage,
  whatsappNumber,
  instagramHandle,
}`;

function guard() {
  if (!client) {
    throw new Error(
      'NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Check .env.local and .env.example.',
    );
  }
  return client;
}

export async function getProducts(): Promise<Product[]> {
  try {
    return await guard().fetch(productsQuery);
  } catch { return []; }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await guard().fetch(productBySlugQuery, { slug });
  } catch { return null; }
}

export async function getProductSlugs(): Promise<ProductSlug[]> {
  try {
    return await guard().fetch(productSlugsQuery);
  } catch { return []; }
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await guard().fetch(categoriesQuery);
  } catch { return []; }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await guard().fetch(categoryBySlugQuery, { slug });
  } catch { return null; }
}

export async function getCategorySlugs(): Promise<CategorySlug[]> {
  try {
    return await guard().fetch(categorySlugsQuery);
  } catch { return []; }
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  try {
    return await guard().fetch(productsByCategoryQuery, { slug });
  } catch { return []; }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await guard().fetch(testimonialsQuery);
  } catch { return []; }
}

export async function getLatestTestimonials(): Promise<Testimonial[]> {
  try {
    return await guard().fetch(latestTestimonialsQuery);
  } catch { return []; }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await guard().fetch(siteSettingsQuery);
  } catch { return null; }
}
