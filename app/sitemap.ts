import { getProductSlugs, getCategorySlugs } from '@/lib/sanity/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photoframesbyvf.vercel.app';

export default async function sitemap() {
  const [productSlugs, categorySlugs] = await Promise.all([
    getProductSlugs(),
    getCategorySlugs(),
  ]);

  const staticPages = [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/products`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/testimonials`, lastModified: new Date() },
  ];

  const productPages = productSlugs.map((s) => ({
    url: `${BASE_URL}/products/${s.slug}`,
    lastModified: new Date(),
  }));

  const categoryPages = categorySlugs.map((s) => ({
    url: `${BASE_URL}/categories/${s.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
