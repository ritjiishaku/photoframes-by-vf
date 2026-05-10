import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { getSiteSettings } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About | Photoframes by VF',
  description:
    'Discover the story behind Photoframes by VF — a Nigerian brand crafting premium custom acrylic frames, gold-layered jewellery, and personalised gifts for life\'s most cherished moments.',
  openGraph: {
    title: 'About | Photoframes by VF',
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
        {settings?.aboutImage && (
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-variant">
            <Image
              src={urlFor(settings.aboutImage)}
              alt="Photoframes by VF — behind the craft"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="font-body text-on-surface-variant leading-relaxed">
          {settings?.aboutText ? (
            <PortableText value={settings.aboutText} />
          ) : (
            <>
              <p className="mb-4">
                At Photoframes by VF, we believe every moment deserves to be
                preserved beautifully. What started as a passion for capturing
                memories has grown into a brand dedicated to crafting premium
                custom acrylic frames, gold-layered jewellery, and personalised
                gifts.
              </p>
              <p className="mb-4">
                Founded by Fechi Godwin, our mission is to help you celebrate
                life&apos;s milestones — from weddings and anniversaries to
                graduations and corporate achievements — with pieces that are as
                unique as your story.
              </p>
              <p>
                Every product is thoughtfully designed, handcrafted with care,
                and finished with the quality that love deserves. We serve
                customers across Nigeria, bringing a touch of elegance to every
                home and occasion.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
