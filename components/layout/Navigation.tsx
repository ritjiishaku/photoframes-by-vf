'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, ARIA_MOBILE_MENU_OPEN, ARIA_MOBILE_MENU_CLOSE } from '@/lib/constants';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    const firstFocusable = document.querySelector<HTMLElement>(
      '[role="dialog"] a, [role="dialog"] button',
    );
    firstFocusable?.focus();

    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="md:hidden w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
        aria-label={isOpen ? ARIA_MOBILE_MENU_CLOSE : ARIA_MOBILE_MENU_OPEN}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="7" x2="21" y2="7" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={close}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm" />
          <div
            className="absolute top-16 right-0 w-72 max-w-[85vw] bg-surface border-l border-outline-variant shadow-2xl p-8 min-h-[calc(100vh-4rem)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className={`font-body text-lg font-medium transition-colors py-3 border-b border-outline-variant/50 last:border-none ${
                      isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
