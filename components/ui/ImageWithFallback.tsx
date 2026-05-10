'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fill,
  width,
  height,
  priority,
  sizes,
  className = '',
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? '/fallback-product.svg' : imgSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => {
        if (!hasError) {
          setImgSrc('/fallback-product.jpg');
          setHasError(true);
        }
      }}
    />
  );
}
