import { ARIA_STAR_RATING } from '@/lib/constants';

interface StarRatingProps {
  rating: number;
  max?: number;
}

export function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={ARIA_STAR_RATING(rating)}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={i < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
          aria-hidden="true"
        >
          <path d="M8 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L8 10.47l-3.52 1.88.67-3.93-2.85-2.78 3.94-.57L8 1.5z" />
        </svg>
      ))}
    </span>
  );
}
