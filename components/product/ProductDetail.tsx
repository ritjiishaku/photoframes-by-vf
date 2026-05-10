'use client';

import { useState } from 'react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { PriceTag } from '@/components/ui/PriceTag';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { urlFor } from '@/lib/sanity/client';
import type { Product } from '@/lib/sanity/types';

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
  const [selectedImage, setSelectedImage] = useState(0);
  const images = product.images ?? [];
  const primaryImage = images[selectedImage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-variant">
            {primaryImage && (
              <ImageWithFallback
                src={urlFor(primaryImage)}
                alt={`${product.name} — ${product.category?.name ?? 'Photoframes by VF'}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images.map((image, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors ${
                    i === selectedImage
                      ? 'border-primary'
                      : 'border-outline-variant hover:border-outline'
                  }`}
                >
                  <ImageWithFallback
                    src={urlFor(image)}
                    alt={`${product.name} view ${i + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {product.category && (
            <p className="font-body text-sm text-on-surface-variant uppercase tracking-wide mb-1">
              {product.category.name}
            </p>
          )}

          <h1 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight">
            {product.name}
          </h1>

          {product.emotionalHeadline && (
            <p className="mt-2 font-accent text-lg italic text-primary">
              {product.emotionalHeadline}
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

            {product.isCustomisable && (
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

          {product.isCustomisable && product.customisationNote && (
            <div className="mt-4 p-4 bg-surface-variant border border-outline-variant">
              <p className="font-body text-sm font-medium text-on-surface">
                Customisation Note
              </p>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                {product.customisationNote}
              </p>
            </div>
          )}

          {product.occasionTags && product.occasionTags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.occasionTags.map((tag) => (
                <span
                  key={tag}
                  className="font-body text-xs font-medium px-3 py-1 border border-outline-variant text-on-surface-variant"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8">
            <WhatsAppButton
              type="product_specific"
              label="Inquire on WhatsApp"
              productName={product.name}
              productCategory={product.category?.name}
              className="w-full text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
