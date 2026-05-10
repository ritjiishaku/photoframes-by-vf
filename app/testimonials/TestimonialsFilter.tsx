'use client';

import { useCallback } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface TestimonialsFilterProps {
  filters: readonly FilterOption[];
}

export function TestimonialsFilter({ filters }: TestimonialsFilterProps) {
  const handleFilter = useCallback((value: string) => {
    const cards = document.querySelectorAll<HTMLElement>('.testimonial-card');

    cards.forEach(card => {
      const type = card.dataset.reviewType;
      if (value === 'all' || type === value) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }, []);

  return (
    <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter testimonials by type">
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => handleFilter(f.value)}
          role="tab"
          aria-selected={f.value === 'all'}
          className="px-4 py-2 font-body text-sm border border-outline-variant bg-surface text-on-surface hover:bg-surface-variant transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
