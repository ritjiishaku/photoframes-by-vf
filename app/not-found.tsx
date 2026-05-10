import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Photoframes by VF',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4">
        404
      </h1>
      <p className="font-body text-lg text-on-surface-variant max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block bg-primary text-on-primary font-body font-medium px-6 py-3 transition-colors duration-200 hover:bg-primary-container"
      >
        Back to Home
      </Link>
    </div>
  );
}
