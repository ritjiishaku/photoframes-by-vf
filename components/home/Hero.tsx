import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings } from '@/lib/sheets/queries';
import { imageUrl } from '@/lib/sheets/utils';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { FadeIn } from '@/components/ui/FadeIn';
import { 
  DEFAULT_HERO_CTA_PRIMARY, 
  DEFAULT_HERO_CTA_SECONDARY,
  SITE_DESCRIPTION 
} from '@/lib/constants';

export async function Hero() {
  const settings = await getSiteSettings();

  const headline = settings?.hero_headline ?? 'Crafting Timeless Keepsakes for the Moments That Matter.';
  const subheadline = settings?.hero_subheadline ?? SITE_DESCRIPTION;
  const ctaPrimary = settings?.hero_cta_primary ?? DEFAULT_HERO_CTA_PRIMARY;
  const ctaSecondary = settings?.hero_cta_secondary ?? DEFAULT_HERO_CTA_SECONDARY;

  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-b from-surface-container-lowest via-background to-surface overflow-hidden">
      {settings?.about_image && (
        <Image
          src={imageUrl(settings.about_image)}
          alt="Photoframes by VF — premium custom frames and jewellery"
          fill
          priority
          className="object-cover opacity-15"
          sizes="100vw"
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-2xl">
          <FadeIn delay={0.1}>
            <span className="inline-block font-body text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-6">
              Premium Gifts, Crafted with Love
            </span>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-medium text-on-surface leading-[1.1] tracking-tight">
              {headline}
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="mt-5 font-body text-lg text-on-surface-variant max-w-xl leading-relaxed">
              {subheadline}
            </p>
          </FadeIn>

          <FadeIn delay={0.4} direction="up">
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="btn-gold font-body font-medium px-8 py-3"
              >
                {ctaPrimary}
              </Link>

              <WhatsAppButton
                type="general"
                label={ctaSecondary}
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
