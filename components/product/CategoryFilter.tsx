'use client';

import { trackEvent } from '@/lib/analytics';
import type { Category } from '@/lib/sheets/types';

interface CategoryFilterProps {
  categories: Category[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryFilter({
  categories,
  activeSlug,
  onSelect,
}: CategoryFilterProps) {
  const handleSelect = (slug: string | null) => {
    if (slug !== activeSlug) {
      trackEvent({
        type: 'category_click',
        categorySlug: slug ?? 'all',
      });
      onSelect(slug);
    }
  };

  return (
    <nav
      className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-none"
      role="tablist"
      aria-label="Filter by category"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeSlug === null}
        onClick={() => handleSelect(null)}
        className={`shrink-0 font-body text-sm font-medium px-4 py-2 transition-colors duration-200 ${
          activeSlug === null
            ? 'bg-primary text-on-primary'
            : 'bg-surface-variant text-on-surface-variant hover:bg-outline-variant'
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.slug}
          type="button"
          role="tab"
          aria-selected={activeSlug === category.slug}
          onClick={() => handleSelect(category.slug)}
          className={`shrink-0 font-body text-sm font-medium px-4 py-2 transition-colors duration-200 ${
            activeSlug === category.slug
              ? 'bg-primary text-on-primary'
              : 'bg-surface-variant text-on-surface-variant hover:bg-outline-variant'
          }`}
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
}
