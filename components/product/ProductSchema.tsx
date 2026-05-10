import type { Product } from '@/lib/sanity/types';
import { formatNaira } from '@/lib/format';
import { urlFor } from '@/lib/sanity/client';

interface ProductSchemaProps {
  product: Product;
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const availabilityMap: Record<string, string> = {
    in_stock: 'https://schema.org/InStock',
    made_to_order: 'https://schema.org/PreOrder',
    unavailable: 'https://schema.org/OutOfStock',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? product.emotionalHeadline,
    image: product.images?.[0] ? urlFor(product.images[0]) : undefined,
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'NGN',
      availability: availabilityMap[product.availability] ?? 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photoframesbyvf.vercel.app'}/products/${product.slug.current}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
