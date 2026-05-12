import { getTestimonials } from '@/lib/sheets/queries';
import { StarRating } from '@/components/ui/StarRating';
import { VideoEmbed } from '@/components/ui/VideoEmbed';
import { TestimonialsFilter } from './TestimonialsFilter';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Testimonials',
  description:
    'Hear from our customers across Nigeria. Real reviews of our premium custom acrylic frames, gold-layered jewellery, and personalised gifts.',
  openGraph: {
  title: 'Testimonials',
    description:
      'Real reviews from happy customers — see why Photoframes by VF is Nigeria\'s trusted choice for custom gifts.',
    type: 'website',
    locale: 'en_NG',
  },
};

const FILTERS = [
  { label: 'All Reviews', value: 'all' },
  { label: 'Text Reviews', value: 'text' },
  { label: 'Video Reviews', value: 'video' },
  { label: 'Text & Video', value: 'both' },
] as const;

function TestimonialCard({ t }: { t: Awaited<ReturnType<typeof getTestimonials>>[number] }) {
  return (
    <div className="bg-surface p-6 border border-outline-variant">
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
        <strong className="font-medium text-on-surface">
          {t.customer_name}
        </strong>
        {t.location && <span> — {t.location}</span>}
        {t.product_type && <span> · {t.product_type}</span>}
      </footer>

      {t.date && (
        <time className="mt-2 block font-body text-xs text-on-surface-variant">
          {t.date}
        </time>
      )}
    </div>
  );
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-medium text-on-surface tracking-tight mb-2">
        What Our Customers Say
      </h1>
      <p className="font-body text-on-surface-variant mb-8">
        Real reviews from real customers across Nigeria.
      </p>

      {testimonials.length === 0 ? (
        <p className="font-body text-on-surface-variant">
          Reviews are coming soon. Check back to hear from our happy customers.
        </p>
      ) : (
        <>
          <TestimonialsFilter filters={FILTERS} />
          <div
            id="testimonials-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="testimonial-card"
                data-review-type={t.review_type}
              >
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
