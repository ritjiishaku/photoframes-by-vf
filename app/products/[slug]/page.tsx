import { getProductBySlug, getProductSlugs } from '@/lib/sheets/queries';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductSchema } from '@/components/product/ProductSchema';
import { ProductViewTracker } from '@/components/product/ProductViewTracker';
import { imageUrl } from '@/lib/sheets/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 900;

export async function generateStaticParams() {
  try {
    const slugs = await getProductSlugs();
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
      title: product.name,
    description:
      product.description?.slice(0, 160) ??
      `Premium ${product.category || 'custom frame'} — ${product.name}. Inquire on WhatsApp.`,
    openGraph: {
      title: product.name,
      description:
        product.description?.slice(0, 160) ??
        `Premium ${product.category || 'custom frame'} by Photoframes by VF.`,
      type: 'website',
      locale: 'en_NG',
      images: product.image_url
        ? [{ url: imageUrl(product.image_url), width: 1200, height: 1500 }]
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
        productSlug={product.slug}
        categorySlug={product.category}
      />
      <ProductDetail product={product} />
    </>
  );
}
