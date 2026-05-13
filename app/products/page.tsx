import { getProducts, getCategories } from '@/lib/sheets/queries';
import { ProductsPageClient } from '@/components/product/ProductsPageClient';
import type { Metadata } from 'next';

export const revalidate = 900;

export const metadata: Metadata = {
  title: 'Our Collection | Giftshop by VF',
  description:
    'Browse our collection of premium custom acrylic frames, gold-layered jewellery, and personalised gifts. Perfect for life\'s most cherished milestones.',
  openGraph: {
    title: 'Our Collection | Giftshop by VF',
    description:
      'Explore premium custom frames and gold-layered jewellery crafted with love.',
    type: 'website',
    locale: 'en_NG',
  },
};

import { FadeIn } from '@/components/ui/FadeIn';

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <FadeIn>
        <h1 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight mb-6">
          Our Collection
        </h1>
      </FadeIn>

      <ProductsPageClient products={products} categories={categories} />
    </div>
  );
}
