import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/sanity/types';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <p className="font-body text-on-surface-variant col-span-full text-center py-16">
        No products found in this category.
      </p>
    );
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
