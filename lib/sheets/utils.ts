export function imageUrl(url: string): string {
  if (!url) return '/fallback-product.svg';

  // Convert Google Drive share links to direct image URLs
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const driveMatch = url.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
  );
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  // Convert short drive.google.com/open?id= links
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }

  return url;
}
