import Link from 'next/link';
import { getLatestTestimonials } from '@/lib/sheets/queries';
import { StarRating } from '@/components/ui/StarRating';
import { VideoEmbed } from '@/components/ui/VideoEmbed';
import { FadeIn } from '@/components/ui/FadeIn';

export async function TestimonialsPreview() {
  const testimonials = await getLatestTestimonials();

  if (!testimonials.length) return null;

  return (
    <section className="py-16 md:py-20 bg-surface-variant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight mb-10">
            Kind Words from Our Community
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1} direction="up">
              <div className="bg-surface p-6 border border-outline-variant h-full">
                {t.review_type === 'video' || t.review_type === 'both' ? (
                  t.video_url ? (
                    <div className="mb-4">
                      <VideoEmbed url={t.video_url} title={`${t.customer_name}'s video review`} />
                    </div>
                  ) : null
                ) : null}

                <StarRating rating={t.rating} />

                {t.review_text && (
                  <p className="mt-3 font-accent text-lg italic text-on-surface leading-relaxed">
                    &ldquo;{t.review_text}&rdquo;
                  </p>
                )}

                <footer className="mt-4 font-body text-sm text-on-surface-variant">
                  <strong className="font-medium text-on-surface">{t.customer_name}</strong>
                  {t.location && <span> — {t.location}</span>}
                  {t.product_type && <span> · {t.product_type}</span>}
                </footer>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-10 text-center">
            <Link
              href="/testimonials"
              className="font-body font-medium text-sm text-primary hover:text-primary-container transition-colors uppercase tracking-wide"
            >
              Discover More Stories
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
