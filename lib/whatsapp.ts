type InquiryType = 'product_specific' | 'general' | 'custom_order' | 'corporate';

interface WhatsAppContext {
  productName?: string;
  productCategory?: string;
}

const messages: Record<InquiryType, string> = {
  product_specific:
    "Hello! I'm interested in {productAndCategory}. Could you share more details, availability, and pricing? Thank you.",
  general:
    'Hello! I came across Photoframes by VF and would love to know more about your products. Could you help me?',
  custom_order:
    "Hello! I'd like to place a custom order with Photoframes by VF. Could we discuss the details?",
  corporate:
    "Hello! I'm interested in bulk/corporate orders from Photoframes by VF. Could we discuss options and pricing?",
};

function buildMessage(type: InquiryType, context?: WhatsAppContext): string {
  if (type === 'product_specific') {
    const parts: string[] = [];
    if (context?.productName) {
      parts.push(context.productName);
    } else {
      parts.push('one of your products');
    }
    if (context?.productCategory) {
      parts.push(`(${context.productCategory})`);
    }
    return messages.product_specific.replace(
      '{productAndCategory}',
      parts.join(' '),
    );
  }

  return messages[type];
}

/**
 * Build a WhatsApp deep link for the given inquiry type and context.
 * Single source of truth for ALL wa.me URLs in the application.
 * Reads the WhatsApp number from NEXT_PUBLIC_WHATSAPP_NUMBER env var.
 *
 * @param type - type of inquiry
 * @param context - optional product context
 * @returns wa.me deep link with pre-filled message
 * @throws Error if NEXT_PUBLIC_WHATSAPP_NUMBER is not set
 */
export function buildWhatsAppUrl(
  type: InquiryType,
  context?: WhatsAppContext,
): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!number) {
    throw new Error(
      'NEXT_PUBLIC_WHATSAPP_NUMBER is not set. Check .env.local and .env.example.',
    );
  }

  const message = buildMessage(type, context);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number.replace('+', '')}?text=${encoded}`;
}
