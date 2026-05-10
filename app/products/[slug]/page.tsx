import { getProductBySlug, getProductSlugs } from '@/lib/sanity/queries';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductSchema } from '@/components/product/ProductSchema';
import { ProductViewTracker } from '@/components/product/ProductViewTracker';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { urlFor } from '@/lib/sanity/client';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: `${product.name} | Photoframes by VF`,
    description:
      product.description?.slice(0, 160) ??
      `Premium ${product.category?.name ?? 'custom frame'} — ${product.name}. Inquire on WhatsApp.`,
    openGraph: {
      title: `${product.name} | Photoframes by VF`,
      description:
        product.description?.slice(0, 160) ??
        `Premium ${product.category?.name ?? 'custom frame'} by Photoframes by VF.`,
      type: 'website',
      locale: 'en_NG',
      images: product.images?.[0]
        ? [{ url: urlFor(product.images[0]), width: 1200, height: 1500 }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductSchema product={product} />
      <ProductViewTracker
        productSlug={product.slug.current}
        categorySlug={product.category?.slug?.current}
      />
      <ProductDetail product={product} />
    </>
  );
}
