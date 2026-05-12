'use client';

import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { PriceTag } from '@/components/ui/PriceTag';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { trackEvent } from '@/lib/analytics';
import type { Product } from '@/lib/sheets/types';
import { imageUrl } from '@/lib/sheets/utils';
import { FadeIn } from '@/components/ui/FadeIn';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imgUrl = product.image_url ? imageUrl(product.image_url) : null;

  return (
    <FadeIn direction="up">
      <article className="group break-inside-avoid mb-6 bg-surface border border-outline-variant overflow-hidden transition-shadow hover:shadow-md">
        <Link
          href={`/products/${product.slug}`}
          className="block relative aspect-[3/4] overflow-hidden"
          onClick={() => {
            trackEvent({
              type: 'product_view',
              productSlug: product.slug,
              categorySlug: product.category,
            });
          }}
        >
          {imgUrl && (
            <ImageWithFallback
              src={imgUrl}
              alt={`${product.name} — ${product.category || 'Photoframes by VF'}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {product.occasion_tags && product.occasion_tags.length > 0 && (
            <span className="absolute top-2 left-2 bg-primary text-on-primary font-body text-[10px] uppercase tracking-wider font-semibold px-2 py-1 shadow-sm">
              {product.occasion_tags[0]}
            </span>
          )}
        </Link>

        <div className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-heading text-lg font-medium text-on-surface group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
          <PriceTag amount={product.price} className="mt-1 block text-on-surface-variant font-medium" />

          <WhatsAppButton
            type="product_specific"
            label="Inquire"
            productName={product.name}
            productCategory={product.category}
            variant="outline"
            className="mt-4 w-full text-center text-xs py-2 uppercase tracking-wide"
          />
        </div>
      </article>
    </FadeIn>
  );
}
