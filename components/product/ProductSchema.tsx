import type { Product } from '@/lib/sheets/types';
import { imageUrl } from '@/lib/sheets/utils';

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
    description: product.description || product.emotional_headline,
    image: product.image_url ? imageUrl(product.image_url) : undefined,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'NGN',
      availability: availabilityMap[product.availability] ?? 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photoframesbyvf.vercel.app'}/products/${product.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
