const DRIVE_FILE_RE = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
const DRIVE_OPEN_RE = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
const DRIVE_ID_RE = /[?&]id=([a-zA-Z0-9_-]+)/;
const LH_ID_RE = /lh[0-9]+\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/;

function extractDriveId(url: string): string | null {
  const m = url.match(DRIVE_FILE_RE) ?? url.match(DRIVE_OPEN_RE) ?? url.match(DRIVE_ID_RE) ?? url.match(LH_ID_RE);
  return m?.[1] ?? null;
}

export function imageUrl(url: string): string {
  if (!url) return '/fallback-product.svg';

  const id = extractDriveId(url);
  if (id) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
  }

  return url;
}
