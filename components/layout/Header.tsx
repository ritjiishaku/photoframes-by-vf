import Link from 'next/link';
import { NAV_LINKS } from '@/lib/constants';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-outline-variant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        <Link
          href="/"
          className="font-heading text-lg md:text-xl font-semibold text-primary tracking-tight"
        >
          Photoframes<span className="text-on-surface"> by VF</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Navigation />
      </div>
    </header>
  );
}
