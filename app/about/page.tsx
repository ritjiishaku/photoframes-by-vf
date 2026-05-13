import Image from 'next/image';
import { getSiteSettings } from '@/lib/sheets/queries';
import { imageUrl } from '@/lib/sheets/utils';
import type { Metadata } from 'next';
import { FadeIn } from '@/components/ui/FadeIn';

export const metadata: Metadata = {
  title: 'Our Story | Giftshop by VF',
  description:
    'Discover the story behind Giftshop by VF — a Nigerian brand crafting premium custom acrylic frames and gold-layered jewellery for life\'s most cherished milestones.',
  openGraph: {
    title: 'Our Story | Giftshop by VF',
    description:
      'Discover the craftsmanship and heart behind Giftshop by VF.',
    type: 'website',
    locale: 'en_NG',
  },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <FadeIn>
        <h1 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight mb-12">
          Our Story
        </h1>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
        {settings?.about_image && (
          <FadeIn direction="left">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-variant shadow-lg">
              <Image
                src={imageUrl(settings.about_image)}
                alt="Giftshop by VF — behind the craft"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        )}

        <FadeIn direction="right" delay={0.2}>
          <div className="font-body text-on-surface-variant text-lg leading-relaxed whitespace-pre-line">
            {settings?.about_text?.trim()
              ? settings.about_text
              : (
                <div className="space-y-6">
                  <p>
                    At Giftshop by VF, we believe every moment is a milestone that
                    deserves to be preserved with elegance. What began as a personal
                    passion for capturing life&apos;s beauty has evolved into a
                    premier destination for bespoke acrylic frames and exquisite
                    gold-layered jewellery.
                  </p>
                  <p>
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
                </div>
              )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
