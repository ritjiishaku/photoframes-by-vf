import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/sheets/queries';
import { imageUrl } from '@/lib/sheets/utils';
import { FadeIn } from '@/components/ui/FadeIn';

export async function FeaturedCategories() {
  const categories = await getCategories();

  if (!categories.length) return null;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-on-background tracking-tight mb-10">
            Curated Collections
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, i) => (
            <FadeIn key={category.slug} delay={i * 0.1} direction="up">
              <Link
                href={`/categories/${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden bg-surface-variant"
              >
                {category.cover_image_url && (
                  <Image
                    src={imageUrl(category.cover_image_url)}
                    alt={`${category.name} — Photoframes by VF`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-heading text-lg font-semibold text-inverse-on-surface">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
