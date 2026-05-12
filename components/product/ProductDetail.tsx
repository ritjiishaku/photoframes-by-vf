'use client';

import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { PriceTag } from '@/components/ui/PriceTag';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { imageUrl } from '@/lib/sheets/utils';
import type { Product } from '@/lib/sheets/types';

interface ProductDetailProps {
  product: Product;
}

const availabilityLabels: Record<string, string> = {
  in_stock: 'In Stock',
  made_to_order: 'Made to Order',
  unavailable: 'Unavailable',
};

const availabilityColors: Record<string, string> = {
  in_stock: 'text-on-primary-container bg-primary-container',
  made_to_order: 'text-on-tertiary-container bg-tertiary-container',
  unavailable: 'text-on-error-container bg-error-container',
};

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-variant">
            {product.image_url && (
              <ImageWithFallback
                src={imageUrl(product.image_url)}
                alt={`${product.name} — ${product.category || 'Photoframes by VF'}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {product.category && (
            <p className="font-body text-sm text-on-surface-variant uppercase tracking-wide mb-1">
              {product.category}
            </p>
          )}

          <h1 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight">
            {product.name}
          </h1>

          {product.emotional_headline && (
            <p className="mt-2 font-accent text-lg italic text-primary">
              {product.emotional_headline}
            </p>
          )}

          <PriceTag amount={product.price} className="mt-4 text-xl" />

          <div className="mt-4 flex gap-2">
            <span
              className={`inline-block font-body text-xs font-medium px-3 py-1 ${
                availabilityColors[product.availability] ?? ''
              }`}
            >
              {availabilityLabels[product.availability] ?? product.availability}
            </span>

            {product.is_customisable && (
              <span className="inline-block font-body text-xs font-medium px-3 py-1 bg-surface-variant text-on-surface-variant">
                Customisable
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 font-body text-on-surface-variant leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          {product.is_customisable && product.customisation_note && (
            <div className="mt-4 p-4 bg-surface-variant border border-outline-variant">
              <p className="font-body text-sm font-medium text-on-surface">
                Customisation Note
              </p>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                {product.customisation_note}
              </p>
            </div>
          )}

          {product.occasion_tags && product.occasion_tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.occasion_tags.map((tag) => (
                <span
                  key={tag}
                  className="font-body text-xs font-medium px-3 py-1 border border-outline-variant text-on-surface-variant"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <WhatsAppButton
              type="product_specific"
              label="Inquire on WhatsApp"
              productName={product.name}
              productCategory={product.category}
              className="flex-1 text-center"
              variant="primary"
            />
            <ShareButton
              title={product.name}
              text={product.emotional_headline || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
