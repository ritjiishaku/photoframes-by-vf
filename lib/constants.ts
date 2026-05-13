// ── Navigation ─────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Testimonials', href: '/testimonials' },
] as const;

// ── Footer ────────────────────────────────────────
export const FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} Giftshop by VF. All rights reserved.`;
export const FOOTER_COLLECTIONS = [
  { label: 'Acrylic Frames', href: '/categories/acrylic-frames' },
  { label: 'Gold Jewellery', href: '/categories/jewellery' },
  { label: 'Memorial Frames', href: '/categories/memorial-frames' },
  { label: 'Custom Gifts', href: '/categories/custom-gifts' },
] as const;

export const TRUST_SIGNALS = [
  { label: 'Handcrafted Excellence', description: 'Artisan quality in every piece' },
  { label: 'Nationwide Delivery', description: 'Safe shipping across Nigeria' },
  { label: 'Secure Payments', description: 'Protected shopping experience' },
] as const;

// ── Accessibility ──────────────────────────────────
export const ARIA_WHATSAPP_FLOAT = 'Chat with us on WhatsApp';
export const ARIA_WHATSAPP_INLINE = 'Inquire about this product on WhatsApp';
export const ARIA_MOBILE_MENU_OPEN = 'Open navigation menu';
export const ARIA_MOBILE_MENU_CLOSE = 'Close navigation menu';
export const ARIA_STAR_RATING = (rating: number) =>
  `Rated ${rating} out of 5 stars`;

// ── Default CTA Labels (overridden by Sheet Settings where applicable) ──
export const DEFAULT_HERO_CTA_PRIMARY = 'Explore the Collection';
export const DEFAULT_HERO_CTA_SECONDARY = 'Chat with a Specialist';
export const DEFAULT_WHATSAPP_LABEL = 'Start Your Custom Order';

// ── Social ─────────────────────────────────────────
export const INSTAGRAM_HANDLE = 'photoframesbyvf';
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

// ── SEO ────────────────────────────────────────────
export const SITE_NAME = 'Giftshop by VF';
export const SITE_DESCRIPTION =
  'Bespoke acrylic frames and non-tarnish gold-layered jewellery, meticulously crafted to honor your most significant milestones and preserve the beauty of your story.';
export const OG_LOCALE = 'en_NG';
