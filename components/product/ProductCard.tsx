'use client';

import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { PriceTag } from '@/components/ui/PriceTag';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { trackEvent } from '@/lib/analytics';
import type { Product } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/client';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.imageUrl ? urlFor(product.imageUrl) : null;

  return (
    <article className="group break-inside-avoid mb-4 bg-surface border border-outline-variant overflow-hidden">
      <Link
        href={`/products/${product.slug.current}`}
        className="block relative aspect-[3/4] overflow-hidden"
        onClick={() => {
          trackEvent({
            type: 'product_view',
            productSlug: product.slug.current,
            categorySlug: product.category?.slug?.current,
          });
        }}
      >
        {imageUrl && (
          <ImageWithFallback
            src={imageUrl}
            alt={`${product.name} — ${product.category?.name ?? 'Photoframes by VF'}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}

        {product.occasionTags && product.occasionTags.length > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-on-primary font-body text-xs font-medium px-2 py-1">
            {product.occasionTags[0]}
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug.current}`}>
          <h3 className="font-heading text-lg font-medium text-on-surface group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <PriceTag amount={product.price} className="mt-1 block" />

        <WhatsAppButton
          type="product_specific"
          label="Inquire"
          productName={product.name}
          productCategory={product.category?.name}
          className="mt-3 w-full text-center text-sm border text-on-surface border-outline hover:bg-primary hover:text-on-primary hover:border-primary"
        />
      </div>
    </article>
  );
}
