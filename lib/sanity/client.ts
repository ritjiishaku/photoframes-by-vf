import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

const isConfigured = Boolean(projectId);

function makeClient(token?: string) {
  if (!isConfigured) return null;
  return createClient({
    projectId: projectId!,
    dataset,
    apiVersion: '2024-03-01',
    useCdn: !token,
    token,
    perspective: 'published',
  });
}

export const client = makeClient();
export const serverClient = makeClient(process.env.SANITY_API_TOKEN);

let builder: ReturnType<typeof imageUrlBuilder> | null = null;
if (client) {
  builder = imageUrlBuilder(client);
}

export function urlFor(source: SanityImageSource): string {
  if (!builder) return '';
  return builder.image(source).url();
}
