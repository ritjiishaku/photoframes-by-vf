'use client';

import { useState, useCallback } from 'react';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, text, url, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareData = {
      title,
      text: text || `Check out ${title} on Giftshop by VF`,
      url: url || (typeof window !== 'undefined' ? window.location.href : ''),
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }, [title, text, url]);

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 border border-outline-variant font-body font-medium transition-all duration-200 hover:bg-surface-container hover:border-outline active:scale-95 ${className}`}
      aria-label="Share product"
    >
      {copied ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-sm uppercase tracking-wide">Copied!</span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span className="text-sm uppercase tracking-wide">Share</span>
        </>
      )}
    </button>
  );
}
