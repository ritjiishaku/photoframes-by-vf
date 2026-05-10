'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface ProductViewTrackerProps {
  productSlug: string;
  categorySlug?: string;
}

export function ProductViewTracker({
  productSlug,
  categorySlug,
}: ProductViewTrackerProps) {
  useEffect(() => {
    trackEvent({
      type: 'product_view',
      productSlug,
      categorySlug,
    });
  }, [productSlug, categorySlug]);

  return null;
}
