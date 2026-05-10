'use client';

import { useState } from 'react';

interface VideoEmbedProps {
  url: string;
  title: string;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function VideoEmbed({ url, title }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-body text-sm text-primary hover:text-primary-container transition-colors"
      >
        Watch video review
      </a>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-surface-variant rounded overflow-hidden">
      {!loaded && (
        <button
          onClick={() => setLoaded(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors cursor-pointer z-10"
          aria-label={`Play ${title}`}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}
      {loaded && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      )}
    </div>
  );
}
