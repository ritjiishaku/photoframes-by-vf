'use client';

import { useState } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { ProductGrid } from './ProductGrid';
import type { Product } from '@/lib/sheets/types';
import type { Category } from '@/lib/sheets/types';

interface ProductsPageClientProps {
  products: Product[];
  categories: Category[];
}

export function ProductsPageClient({
  products,
  categories,
}: ProductsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <>
      <CategoryFilter
        categories={categories}
        activeSlug={activeCategory}
        onSelect={setActiveCategory}
      />

      <div className="mt-6">
        <ProductGrid products={filtered} />
      </div>
    </>
  );
}
