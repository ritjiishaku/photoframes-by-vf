'use client';

import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

interface WhatsAppButtonProps {
  type: 'product_specific' | 'general' | 'custom_order' | 'corporate';
  label?: string;
  productName?: string;
  productCategory?: string;
  className?: string;
}

export function WhatsAppButton({
  type,
  label = 'Chat on WhatsApp',
  productName,
  productCategory,
  className = '',
}: WhatsAppButtonProps) {
  const handleClick = () => {
    trackEvent({
      type: 'whatsapp_click',
      inquiryType: type,
      productSlug: productName,
    });
    const url = buildWhatsAppUrl(type, { productName, productCategory });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-block font-body font-medium px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors duration-200 ${className}`}
    >
      {label}
    </button>
  );
}
