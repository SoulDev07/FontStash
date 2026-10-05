import Head from "next/head";
import Link from "next/link";
import { ArrowLeftIcon, TextAaIcon } from "@phosphor-icons/react";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center p-6 text-center select-none">
      <Head>
        <title>404 - Page Not Found | FontStash</title>
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="max-w-md flex flex-col items-center">
        {/* Typographic Glyph Indicator */}
        <div className="w-16 h-16 rounded-2xl bg-panel border border-border flex items-center justify-center text-primary mb-6 shadow-xs">
          <TextAaIcon size={32} weight="bold" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary mb-2">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text mb-3">
          Specimen not found
        </h1>

        <p className="text-sm text-muted leading-relaxed mb-8">
          The page or typography specimen you requested does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="btn btn-primary text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
        >
          <ArrowLeftIcon size={14} weight="bold" />
          <span>Return to playground</span>
        </Link>
      </div>
    </div>
  );
}
