'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { PriceTag } from '@/components/ui/PriceTag';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { FadeIn } from '@/components/ui/FadeIn';
import { ProductCard } from '@/components/product/ProductCard';
import { imageUrl } from '@/lib/sheets/utils';
import type { Product } from '@/lib/sheets/types';

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
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

const trustBadges = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Delivery across Nigeria',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    label: 'Premium quality materials',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    label: 'Handcrafted with care',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    label: 'Custom options available',
  },
];

export function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = useCallback(() => setLightboxOpen(true), []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    if (lightboxOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, closeLightbox]);

  const descriptionParagraphs = product.description
    ? product.description.split(/\n\n+/).filter(Boolean)
    : [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <FadeIn direction="none" className="mb-6">
          <nav className="flex items-center gap-2 font-body text-sm text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link
                  href={`/categories/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.category}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-on-surface truncate max-w-[200px]">{product.name}</span>
          </nav>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <FadeIn direction="none" className="md:sticky md:top-28 md:self-start">
            <button
              type="button"
              onClick={openLightbox}
              className="relative aspect-[4/5] overflow-hidden bg-surface-variant w-full group cursor-zoom-in"
              aria-label="Enlarge product image"
            >
              {product.image_url && (
                <ImageWithFallback
                  src={imageUrl(product.image_url)}
                  alt={`${product.name} — ${product.category || 'Photoframes by VF'}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-surface/90 text-on-surface font-body text-sm px-4 py-2">
                  Click to enlarge
                </span>
              </div>
            </button>
          </FadeIn>

          <div className="flex flex-col gap-6">
            <FadeIn direction="up">
              {product.category && (
                <p className="font-body text-sm text-on-surface-variant uppercase tracking-wide">
                  {product.category}
                </p>
              )}

              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-on-surface tracking-tight mt-1">
                {product.name}
              </h1>

              {product.emotional_headline && (
                <p className="font-accent text-lg md:text-xl italic text-primary mt-2">
                  {product.emotional_headline}
                </p>
              )}

              <PriceTag amount={product.price} className="mt-4 text-xl md:text-2xl" />
              <div className="flex flex-nowrap items-center gap-2 mt-2">
                <span
                  className={`font-body text-xs font-medium px-3 py-1 whitespace-nowrap ${
                    availabilityColors[product.availability] ?? ''
                  }`}
                >
                  {availabilityLabels[product.availability] ?? product.availability}
                </span>
                {product.is_customisable && (
                  <span className="font-body text-xs font-medium px-3 py-1 whitespace-nowrap bg-surface-variant text-on-surface-variant">
                    Customisable
                  </span>
                )}
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <hr className="border-outline-variant" />
            </FadeIn>

            {descriptionParagraphs.length > 0 && (
              <FadeIn direction="up" delay={0.15}>
                <div className="space-y-4">
                  <h2 className="font-heading text-xl font-medium text-on-surface">Description</h2>
                  {descriptionParagraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className="font-body text-on-surface-variant leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </FadeIn>
            )}

            {product.is_customisable && product.customisation_note && (
              <FadeIn direction="up" delay={0.2}>
                <div className="p-5 bg-surface-container border border-outline-variant">
                  <div className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5 shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <div>
                      <p className="font-body text-sm font-medium text-on-surface">
                        Customisation Note
                      </p>
                      <p className="font-body text-sm text-on-surface-variant mt-1">
                        {product.customisation_note}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            <FadeIn direction="up" delay={0.25}>
              <hr className="border-outline-variant" />
            </FadeIn>

            {product.occasion_tags && product.occasion_tags.length > 0 && (
              <FadeIn direction="up" delay={0.25}>
                <div>
                  <h3 className="font-body text-sm font-medium text-on-surface uppercase tracking-wide mb-3">
                    Perfect for
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.occasion_tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-body text-xs font-medium px-3 py-1.5 border border-primary/30 text-primary bg-primary/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            <FadeIn direction="up" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-3">
                <WhatsAppButton
                  type="product_specific"
                  label="Inquire on WhatsApp"
                  productName={product.name}
                  productCategory={product.category}
                  className="flex-1 text-center py-3.5"
                  variant="primary"
                />
                <ShareButton
                  title={product.name}
                  text={product.emotional_headline || undefined}
                />
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.35}>
              <div className="grid grid-cols-2 gap-4 p-5 bg-surface-variant/50 border border-outline-variant">
                {trustBadges.map((badge) => (
                  <div key={badge.label} className="flex items-center gap-3">
                    <span className="text-primary shrink-0">{badge.icon}</span>
                    <span className="font-body text-sm text-on-surface-variant">{badge.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <FadeIn direction="up" className="mt-16 md:mt-20">
            <hr className="border-outline-variant mb-10" />
            <h2 className="font-heading text-2xl md:text-3xl font-medium text-on-surface tracking-tight mb-8">
              You May Also Like
            </h2>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.slug} product={rp} />
              ))}
            </div>
          </FadeIn>
        )}
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && product.image_url && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Product image enlarged"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2"
            aria-label="Close"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <ImageWithFallback
              src={imageUrl(product.image_url)}
              alt={product.name}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
