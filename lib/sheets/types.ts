export interface Product {
  name: string;
  slug: string;
  category: string;
  emotional_headline: string;
  description: string;
  price: number;
  availability: 'in_stock' | 'made_to_order' | 'unavailable';
  occasion_tags: string[];
  is_customisable: boolean;
  customisation_note: string | null;
  image_url: string;
  is_visible: boolean;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  cover_image_url: string;
  display_order: number;
  is_active: boolean;
}

export type ReviewType = 'text' | 'video' | 'both';

export interface Testimonial {
  customer_name: string;
  location: string | null;
  product_type: string | null;
  review_text: string;
  rating: number;
  is_visible: boolean;
  date: string;
  review_type: ReviewType;
  video_url: string | null;
}

export interface SiteSettings {
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  about_text: string;
  about_image?: string;
  whatsapp_number: string;
  instagram_handle: string;
}
