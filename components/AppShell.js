import Head from "next/head";

export default function AppShell({ children, topBar, sidebar }) {
  return (
    <main className="min-h-screen">
      <Head>
        <title>FontStash - Personal Font Playground</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Preview and explore your local font files with a creative, gorgeous UI. Drop fonts into public/fonts and play."
        />
        <meta name="theme-color" content="#6366f1" />
        <meta property="og:title" content="FontStash - Personal Font Playground" />
        <meta property="og:description" content="Preview and explore your local font files with a creative, gorgeous UI." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FontStash - Personal Font Playground" />
        <meta name="twitter:description" content="Preview and explore your local font files with a creative, gorgeous UI." />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </Head>

      {topBar}
      {sidebar}

      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </main>
  );
}
