import { Hero } from '@/components/home/Hero';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { TestimonialsPreview } from '@/components/home/TestimonialsPreview';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <TestimonialsPreview />
    </>
  );
}
