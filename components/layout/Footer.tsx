import Link from 'next/link';
import { 
  NAV_LINKS, 
  FOOTER_COPYRIGHT, 
  INSTAGRAM_URL,
  FOOTER_COLLECTIONS,
  TRUST_SIGNALS
} from '@/lib/constants';
import { FadeIn } from '@/components/ui/FadeIn';

export function Footer() {
  return (
    <footer className="bg-inverse-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn direction="up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <Link
                href="/"
                className="font-heading text-xl font-semibold text-primary"
              >
                Giftshop by VF
              </Link>
              <p className="mt-3 font-body text-sm text-inverse-on-surface opacity-80 leading-relaxed max-w-xs">
                Bespoke acrylic frames and non-tarnish gold-layered jewellery,
                meticulously crafted to honor your most significant milestones.
              </p>
            </div>

            <div>
              <h3 className="font-body text-xs font-semibold text-primary uppercase tracking-widest mb-4">
                Shop
              </h3>
              <nav className="flex flex-col gap-3">
                {FOOTER_COLLECTIONS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-body text-sm text-inverse-on-surface opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="font-body text-xs font-semibold text-primary uppercase tracking-widest mb-4">
                Navigate
              </h3>
              <nav className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-body text-sm text-inverse-on-surface opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="font-body text-xs font-semibold text-primary uppercase tracking-widest mb-4">
                Connect
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-inverse-on-surface opacity-80 hover:opacity-100 transition-opacity"
                >
                  Instagram
                </a>
                <a
                  href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-inverse-on-surface opacity-80 hover:opacity-100 transition-opacity"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-b border-inverse-on-surface/10 mb-12">
            {TRUST_SIGNALS.map((signal) => (
              <div key={signal.label} className="text-center md:text-left">
                <h4 className="font-body text-sm font-semibold text-inverse-on-surface">
                  {signal.label}
                </h4>
                <p className="font-body text-xs text-inverse-on-surface opacity-60 mt-1">
                  {signal.description}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <p className="font-body text-xs text-inverse-on-surface opacity-60 text-center">
              {FOOTER_COPYRIGHT}
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
