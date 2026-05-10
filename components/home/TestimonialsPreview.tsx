import Link from 'next/link';
import { getLatestTestimonials } from '@/lib/sheets/queries';
import { StarRating } from '@/components/ui/StarRating';
import { VideoEmbed } from '@/components/ui/VideoEmbed';

export async function TestimonialsPreview() {
  const testimonials = await getLatestTestimonials();

  if (!testimonials.length) return null;

  return (
    <section className="py-16 md:py-20 bg-surface-variant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight mb-10">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-surface p-6 border border-outline-variant">
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
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/testimonials"
            className="font-body font-medium text-sm text-primary hover:text-primary-container transition-colors uppercase tracking-wide"
          >
            Read All Reviews
          </Link>
        </div>
      </div>
    </section>
  );
}
