import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { logAdminChange } from '@/lib/db/queries';

type SanityDocumentType = 'product' | 'category' | 'testimonial' | 'siteSettings';

const documentTypePaths: Record<SanityDocumentType, string[]> = {
  product: ['/products', '/'],
  category: ['/products', '/categories', '/'],
  testimonial: ['/testimonials', '/'],
  siteSettings: ['/', '/about'],
};

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = request.headers.get('x-sanity-webhook-signature') ?? '';
    if (signature !== webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    const docType = body._type as SanityDocumentType | undefined;
    const slug = body.slug?.current as string | undefined;

    if (!docType || !(docType in documentTypePaths)) {
      return NextResponse.json(
        { error: 'Unknown document type' },
        { status: 400 },
      );
    }

    const paths = documentTypePaths[docType];

    for (const path of paths) {
      revalidatePath(path);
    }

    if (slug && docType === 'product') {
      revalidatePath(`/products/${slug}`);
    }

    if (slug && docType === 'category') {
      revalidatePath(`/categories/${slug}`);
    }

    await logAdminChange({
      section: docType,
      field_name: slug ? `slug: ${slug}` : null,
      note: `Sanity webhook revalidated ${paths.length + (slug ? 1 : 0)} paths`,
    });

    return NextResponse.json({ success: true, revalidatedPaths: paths });
  } catch (error) {
    console.error('[webhook] Error processing Sanity webhook:', error);
    return NextResponse.json({ success: true });
  }
}
