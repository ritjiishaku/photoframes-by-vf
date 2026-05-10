import { formatNaira } from '@/lib/format';

interface PriceTagProps {
  amount: number;
  className?: string;
}

export function PriceTag({ amount, className = '' }: PriceTagProps) {
  return (
    <span className={`font-body font-medium text-primary ${className}`}>
      {formatNaira(amount)}
    </span>
  );
}
