import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { insertAnalyticsEvent } from '@/lib/db/queries';

const eventSchema = z.object({
  type: z.enum([
    'whatsapp_click',
    'product_view',
    'category_click',
    'hero_cta',
    'instagram_click',
    'scroll_depth',
  ]),
  productSlug: z.string().optional(),
  categorySlug: z.string().optional(),
  inquiryType: z.string().optional(),
  label: z.string().optional(),
  depth: z.number().int().min(25).max(100).optional(),
});

function getTrafficSource(request: NextRequest): string {
  const referrer = request.headers.get('referer') ?? '';
  const utmSource = request.nextUrl.searchParams.get('utm_source');

  if (utmSource) return utmSource;
  if (referrer.includes('instagram')) return 'instagram';
  if (referrer.includes('wa.me') || referrer.includes('whatsapp')) return 'whatsapp_share';
  if (referrer) return 'referral';
  return 'direct';
}

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await request.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid event data', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const event = parsed.data;
    const trafficSource = getTrafficSource(request);
    const userAgent = request.headers.get('user-agent') ?? undefined;
    const sessionId = request.cookies.get('session_id')?.value ?? undefined;

    await insertAnalyticsEvent({
      event_type: event.type,
      product_slug: event.productSlug ?? null,
      category_slug: event.categorySlug ?? null,
      inquiry_type: event.inquiryType ?? null,
      traffic_source: trafficSource,
      scroll_depth: event.depth ?? null,
      session_id: sessionId ?? null,
      user_agent: userAgent ?? null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[analytics] Error processing event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
