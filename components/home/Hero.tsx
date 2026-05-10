import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings } from '@/lib/sheets/queries';
import { imageUrl } from '@/lib/sheets/utils';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

export async function Hero() {
  const settings = await getSiteSettings();

  const headline = settings?.hero_headline ?? 'Celebrate love with a frame that lasts forever.';
  const subheadline = settings?.hero_subheadline ?? 'Premium custom acrylic frames and gold-layered jewellery \u2014 made for your moment.';
  const ctaPrimary = settings?.hero_cta_primary ?? 'Explore the Collection';
  const ctaSecondary = settings?.hero_cta_secondary ?? 'Chat on WhatsApp';

  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-b from-surface-container-lowest via-background to-surface overflow-hidden">
      {settings?.about_image && (
        <Image
          src={imageUrl(settings.about_image)}
          alt="Photoframes by VF \u2014 premium custom frames and jewellery"
          fill
          priority
          className="object-cover opacity-10"
          sizes="100vw"
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-2xl">
          <span className="inline-block font-body text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-6">
            Premium Gifts, Crafted with Love
          </span>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-medium text-on-surface leading-[1.1] tracking-tight">
            {headline}
          </h1>

          <p className="mt-5 font-body text-lg text-on-surface-variant max-w-xl leading-relaxed">
            {subheadline}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-block bg-primary text-on-primary font-body font-medium px-8 py-3 transition-all duration-200 hover:bg-primary-container hover:text-on-primary-container shadow-md hover:shadow-lg"
            >
              {ctaPrimary}
            </Link>

            <WhatsAppButton
              type="general"
              label={ctaSecondary}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
