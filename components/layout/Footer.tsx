import Link from 'next/link';
import { NAV_LINKS, FOOTER_COPYRIGHT, INSTAGRAM_URL } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-inverse-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link
              href="/"
              className="font-heading text-xl font-semibold text-primary"
            >
              Photoframes by VF
            </Link>
            <p className="mt-3 font-body text-sm text-inverse-on-surface opacity-80 leading-relaxed max-w-xs">
              Premium custom acrylic photo frames and non-tarnish gold-layered jewellery.
              Crafted for love, milestones, and moments worth keeping.
            </p>
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

        <div className="mt-12 pt-8 border-t border-inverse-on-surface/20">
          <p className="font-body text-xs text-inverse-on-surface opacity-60 text-center">
            {FOOTER_COPYRIGHT}
          </p>
        </div>
      </div>
    </footer>
  );
}
