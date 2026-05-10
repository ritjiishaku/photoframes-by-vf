import { getCategoryBySlug, getCategorySlugs, getProductsByCategory } from '@/lib/sheets/queries';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 1800;

export async function generateStaticParams() {
  try {
    const slugs = await getCategorySlugs();
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};

  return {
    title: `${category.name} | Photoframes by VF`,
    description:
      category.description?.slice(0, 160) ??
      `Browse our ${category.name} collection — premium custom frames and personalised gifts by Photoframes by VF.`,
    openGraph: {
      title: `${category.name} | Photoframes by VF`,
      description:
        category.description?.slice(0, 160) ??
        `Explore the ${category.name} collection by Photoframes by VF.`,
      type: 'website',
      locale: 'en_NG',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const [category, products] = await Promise.all([
    getCategoryBySlug(params.slug),
    getProductsByCategory(params.slug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight">
        {category.name}
      </h1>

      {category.description && (
        <p className="mt-2 font-body text-on-surface-variant max-w-2xl">
          {category.description}
        </p>
      )}

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
