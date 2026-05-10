import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Playfair_Display } from 'next/font/google';

import '@/styles/tokens.css';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';

const heading = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

const accent = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-accent',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Photoframes by VF — Premium Custom Frames & Gold Jewellery',
    template: '%s | Photoframes by VF',
  },
  description:
    'Premium custom acrylic photo frames and non-tarnish gold-layered jewellery in Nigeria. Crafted for love, milestones, and moments worth keeping.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    siteName: 'Photoframes by VF',
    type: 'website',
    locale: 'en_NG',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${accent.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
