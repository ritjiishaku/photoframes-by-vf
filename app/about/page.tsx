import Image from 'next/image';
import { getSiteSettings } from '@/lib/sheets/queries';
import { imageUrl } from '@/lib/sheets/utils';
import type { Metadata } from 'next';

export const revalidate = 1800;

export const metadata: Metadata = {
    title: 'About',
  description:
    'Discover the story behind Photoframes by VF — a Nigerian brand crafting premium custom acrylic frames, gold-layered jewellery, and personalised gifts for life\'s most cherished moments.',
  openGraph: {
  title: 'About',
    description:
      'Discover the story behind Photoframes by VF — premium custom frames and gifts crafted in Nigeria.',
    type: 'website',
    locale: 'en_NG',
  },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight mb-8">
        Our Story
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        {settings?.about_image && (
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-variant">
            <Image
              src={imageUrl(settings.about_image)}
              alt="Photoframes by VF — behind the craft"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="font-body text-on-surface-variant leading-relaxed whitespace-pre-line">
          {settings?.about_text?.trim()
            ? settings.about_text
            : (
              <>
                <p className="mb-4">
                  At Photoframes by VF, we believe every moment is a milestone that
                  deserves to be preserved with elegance. What began as a personal
                  passion for capturing life&apos;s beauty has evolved into a
                  premier destination for bespoke acrylic frames and exquisite
                  gold-layered jewellery.
                </p>
                <p className="mb-4">
                  Founded by Fechi Godwin, our mission is to help you celebrate
                  the milestones that define your story — from weddings and
                  anniversaries to graduations and professional triumphs. We
                  believe in craftsmanship that speaks of love, excellence, and
                  endurance.
                </p>
                <p>
                  Each piece is thoughtfully designed and handcrafted with
                  uncompromising care, ensuring that your memories are framed in
                  quality that lasts a lifetime. Based in Nigeria, we are proud
                  to bring a touch of timeless sophistication to your home and
                  life.
                </p>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
