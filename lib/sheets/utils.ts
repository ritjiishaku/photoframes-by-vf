/**
 * Returns a direct image URL.
 * In Google Sheets mode, image_url is already a direct URL string.
 */
export function imageUrl(url: string): string {
  return url || '/fallback-product.svg';
}
