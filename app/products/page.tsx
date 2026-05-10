import { getProducts, getCategories } from '@/lib/sanity/queries';
import { ProductsPageClient } from '@/components/product/ProductsPageClient';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Products | Photoframes by VF',
  description:
    'Browse our collection of premium custom acrylic frames, gold-layered jewellery, and personalised gifts. Perfect for weddings, anniversaries, birthdays, and corporate gifting.',
  openGraph: {
    title: 'Products | Photoframes by VF',
    description:
      'Browse premium custom frames, gold-layered jewellery, and personalised gifts.',
    type: 'website',
    locale: 'en_NG',
  },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight mb-6">
        Our Collection
      </h1>

      <ProductsPageClient products={products} categories={categories} />
    </div>
  );
}
