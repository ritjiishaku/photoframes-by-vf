type TrackableEvent =
  | { type: 'whatsapp_click'; inquiryType: string; productSlug?: string }
  | { type: 'product_view'; productSlug: string; categorySlug?: string }
  | { type: 'category_click'; categorySlug: string }
  | { type: 'hero_cta'; label: string }
  | { type: 'instagram_click' }
  | { type: 'scroll_depth'; depth: 25 | 50 | 75 | 100 };

/**
 * Track an analytics event by posting to the analytics API route.
 * Always fails silently — never breaks the user experience.
 *
 * @param event - the event to track
 */
export async function trackEvent(event: TrackableEvent): Promise<void> {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch {
    // Analytics must never break the user experience — fail silently
  }
}
