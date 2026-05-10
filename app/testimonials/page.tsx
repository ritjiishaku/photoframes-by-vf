import { getTestimonials } from '@/lib/sanity/queries';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/format';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Testimonials | Photoframes by VF',
  description:
    'Hear from our customers across Nigeria. Real reviews of our premium custom acrylic frames, gold-layered jewellery, and personalised gifts.',
  openGraph: {
    title: 'Testimonials | Photoframes by VF',
    description:
      'Real reviews from happy customers — see why Photoframes by VF is Nigeria\'s trusted choice for custom gifts.',
    type: 'website',
    locale: 'en_NG',
  },
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight mb-8">
        What Our Customers Say
      </h1>

      {testimonials.length === 0 ? (
        <p className="font-body text-on-surface-variant">
          Reviews are coming soon. Check back to hear from our happy customers.
        </p>
      ) : (
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
                <strong className="font-medium text-on-surface">
                  {t.customerName}
                </strong>
                {t.location && <span> — {t.location}</span>}
                {t.productType && <span> · {t.productType}</span>}
              </footer>

              {t.date && (
                <time className="mt-2 block font-body text-xs text-on-surface-variant">
                  {formatDate(t.date)}
                </time>
              )}
            </blockquote>
          ))}
        </div>
      )}
    </div>
  );
}
