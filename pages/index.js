import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import FontRow from "@/components/FontRow";
import FontCard from "@/components/FontCard";
import Sidebar from "@/components/Sidebar";
import { registerFontFace } from "@/utils/fontUtils";
import { MagnifyingGlassIcon, PencilSimpleIcon, ListIcon, CardsIcon } from "@phosphor-icons/react";

export default function Home({ fontsMeta = [] }) {
  const [fonts, setFonts] = useState(fontsMeta);
  const [query, setQuery] = useState("");
  const [sample, setSample] = useState("The quick brown fox jumps over the lazy dog");

  // Register @font-face for each public font
  useEffect(() => {
    fonts.forEach((f) => {
      try {
        registerFontFace(f.fontFamily, f.url, f.format);
      } catch {}
    });
  }, [fonts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fonts;
    return fonts.filter((f) => f.originalName.toLowerCase().includes(q) || f.fontFamily.toLowerCase().includes(q));
  }, [fonts, query]);
  const empty = useMemo(() => !filtered || filtered.length === 0, [filtered]);

  const onSidebarSelect = (f) => {
    const el = document.getElementById(`font-${f.id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const [viewMode, setViewMode] = useState("list");

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

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="blob blob-primary" />
        <div className="blob blob-accent" />
      </div>

      <header className="sticky top-0 z-10 backdrop-blur supports-backdrop-filter:bg-bg/60 bg-bg/70 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="relative flex items-center gap-3">
            <Image src="/logo.svg" alt="FontStash" width={32} height={32} className="rounded-xl shadow-soft" />
            <h1
              className="text-xl font-semibold tracking-tight bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--primary), var(--accent))" }}
            >
              FontStash
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 glass-input">
              <MagnifyingGlassIcon size={14} className="text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fonts" className="input-inner w-52" />
            </div>
            <div className="hidden md:flex items-center gap-2 glass-input">
              <PencilSimpleIcon size={14} className="text-muted" />
              <input value={sample} onChange={(e) => setSample(e.target.value)} placeholder="Sample text" className="input-inner w-64" />
            </div>
            <button
              onClick={() => setViewMode((m) => (m === "list" ? "grid" : "list"))}
              className={`toggle-chip ${viewMode}`}
              title="Toggle list/grid"
              aria-label="Toggle list or grid view"
            >
              <span className="icon-wrap">
                <span className={`icon ${viewMode === "list" ? "icon-show" : "icon-hide"}`}>
                  <ListIcon size={14} />
                </span>
                <span className={`icon ${viewMode === "grid" ? "icon-show" : "icon-hide"}`}>
                  <CardsIcon size={14} />
                </span>
              </span>
              <span className="label hidden sm:inline">{viewMode === "list" ? "List" : "Grid"}</span>
            </button>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <Sidebar fonts={fonts} onSelect={onSidebarSelect} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="md:hidden grid gap-3 mb-4">
          <div className="glass-input">
            <MagnifyingGlassIcon size={14} className="text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fonts" className="input-inner flex-1" />
          </div>
          <div className="glass-input">
            <PencilSimpleIcon size={14} className="text-muted" />
            <input value={sample} onChange={(e) => setSample(e.target.value)} placeholder="Sample text" className="input-inner flex-1" />
          </div>
        </div>

        {empty ? (
          <div className="card p-8 text-center text-muted">Add fonts to public/fonts to preview them.</div>
        ) : viewMode === "list" ? (
          <div className="rounded-xl overflow-hidden border border-border/60 fade-in">
            {filtered.map((font, i) => (
              <div id={`font-${font.id}`} key={font.id} className={i % 2 === 0 ? "bg-card/30" : "bg-transparent"}>
                <FontRow font={font} text={sample} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 view-toggle">
            {filtered.map((font) => (
              <div id={`font-${font.id}`} key={font.id} className="view-item">
                <FontCard font={font} text={sample} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// Server-side: load fonts from public/fonts directory
export async function getStaticProps() {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const fontsDir = path.join(process.cwd(), "public", "fonts");
  let files = [];
  try {
    files = fs.readdirSync(fontsDir);
  } catch {
    // no fonts dir or unreadable
  }
  const allowed = [".ttf", ".otf", ".woff", ".woff2"];
  const list = files
    .filter((f) => allowed.some((ext) => f.toLowerCase().endsWith(ext)))
    .map((name, idx) => {
      const url = `/fonts/${name}`;
      const ext = name.split(".").pop()?.toLowerCase();
      const format = ext === "ttf" ? "truetype" : ext === "otf" ? "opentype" : ext;
      const base = name.replace(/\.[^.]+$/, "");
      const id = `${base}-${idx}`;
      const fontFamily = `${base.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 24) || "Font"}-${idx}`;
      return { id, originalName: name, url, format, fontFamily };
    });
  return { props: { fontsMeta: list }, revalidate: 5 };
}
