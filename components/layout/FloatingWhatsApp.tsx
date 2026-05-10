'use client';

import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { ARIA_WHATSAPP_FLOAT } from '@/lib/constants';

export function FloatingWhatsApp() {
  const handleClick = () => {
    trackEvent({ type: 'whatsapp_click', inquiryType: 'general' });
  };

  const href = (() => {
    try {
      return buildWhatsAppUrl('general');
    } catch {
      return '#';
    }
  })();

  return (
    <a
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ARIA_WHATSAPP_FLOAT}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary-container shadow-lg flex items-center justify-center transition-colors duration-200"
    >
      <WhatsAppIcon className="w-7 h-7 text-on-primary" />
    </a>
  );
}
