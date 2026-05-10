import { getSiteSettings } from './queries';

export async function syncWhatsAppNumber(): Promise<void> {
  try {
    const settings = await getSiteSettings();
    if (settings?.whatsapp_number) {
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = settings.whatsapp_number;
    }
  } catch {
    // Silently skip — env var stays as-is if sheet is unreachable
  }
}
