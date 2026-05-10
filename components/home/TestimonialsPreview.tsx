import Link from 'next/link';
import { getLatestTestimonials } from '@/lib/sanity/queries';
import { StarRating } from '@/components/ui/StarRating';

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
          {testimonials.map((t) => (
            <blockquote
              key={t._id}
              className="bg-surface p-6 border border-outline-variant"
            >
              <StarRating rating={t.rating} />
              <p className="mt-3 font-accent text-lg italic text-on-surface leading-relaxed">
                &ldquo;{t.reviewText}&rdquo;
              </p>
              <footer className="mt-4 font-body text-sm text-on-surface-variant">
                <strong className="font-medium text-on-surface">{t.customerName}</strong>
                {t.location && <span> — {t.location}</span>}
                {t.productType && <span> · {t.productType}</span>}
              </footer>
            </blockquote>
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
