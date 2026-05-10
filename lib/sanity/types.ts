import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export interface SanityImage {
  _type: 'image';
  asset: SanityImageSource;
}

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  category: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  description: string;
  emotionalHeadline: string;
  price: number;
  images: SanityImage[];
  isCustomisable: boolean;
  customisationNote?: string;
  availability: 'in_stock' | 'made_to_order' | 'unavailable';
  occasionTags?: string[];
  whatsappInquiryText?: string;
  isVisible: boolean;
  imageUrl?: SanityImage;
}

export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  coverImage?: SanityImage;
  displayOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  _id: string;
  customerName: string;
  location?: string;
  productType?: string;
  reviewText: string;
  rating: number;
  isVisible: boolean;
  date?: string;
}

export interface SiteSettings {
  heroHeadline?: string;
  heroSubheadline?: string;
  heroCTAPrimary?: string;
  heroCTASecondary?: string;
  aboutText?: import('@portabletext/types').TypedObject[];
  aboutImage?: SanityImage;
  whatsappNumber: string;
  instagramHandle?: string;
}

export interface ProductSlug {
  slug: string;
}

export interface CategorySlug {
  slug: string;
}
