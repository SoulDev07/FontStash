import { ArrowLeftIcon, TextAaIcon } from '@phosphor-icons/react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="bg-bg text-text flex min-h-screen flex-col items-center justify-center p-6 text-center select-none">
      <Head>
        <title>404 - Page Not Found | FontStash</title>
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="flex max-w-md flex-col items-center">
        {/* Typographic Glyph Indicator */}
        <div className="bg-panel border-border text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-xs">
          <TextAaIcon size={32} weight="bold" />
        </div>

        <span className="text-primary mb-2 font-mono text-xs font-bold tracking-widest uppercase">
          Error 404
        </span>

        <h1 className="text-text mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Specimen not found
        </h1>

        <p className="text-muted mb-8 text-sm leading-relaxed">
          The page or typography specimen you requested does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="btn btn-primary inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold shadow-sm active:scale-95"
        >
          <ArrowLeftIcon size={14} weight="bold" />
          <span>Return to playground</span>
        </Link>
      </div>
    </div>
  );
}
