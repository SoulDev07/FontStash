import { useEffect, useMemo } from "react";
import Head from "next/head";
import TopBar from "@/components/TopBar";
import PreviewControls from "@/components/PreviewControls";
import FontExplorer from "@/components/FontExplorer";
import FontCompareView from "@/components/FontCompareView";
import CommandPalette from "@/components/CommandPalette";
import FontSpecimenModal from "@/components/FontSpecimenModal";
import DragDropOverlay from "@/components/DragDropOverlay";
import Toast from "@/components/ui/Toast";
import EmptyState from "@/components/EmptyState";
import { useFontRegistration } from "@/hooks/useFontRegistration";
import { useFontStore } from "@/stores/useFontStore";

export default function Home({ fontsMeta = [] }) {
  const {
    settings,
    updateSetting,
    viewMode,
    setViewMode,
    query,
    setQuery,
    extensions,
    categoryFilter,
    favoritesOnly,
    customOnly,
    favorites,
    sort,
    setSort,
    toggleFilter,
    customFonts,
    hydrate,
  } = useFontStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Combine static fonts from public/fonts with any client-stored custom fonts
  const allFonts = useMemo(() => {
    return [...customFonts, ...fontsMeta];
  }, [customFonts, fontsMeta]);

  useFontRegistration(allFonts);

  // Filter and sort fonts
  const filteredFonts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = allFonts.filter((font) => {
      const name = (font.family || font.originalName || "").toLowerCase();

      // Search match
      const searchMatch =
        !q ||
        [font.originalName, font.family, font.style, font.formatLabel, font.designer, font.manufacturer].some((v) =>
          v?.toLowerCase().includes(q)
        );

      if (!searchMatch) return false;

      // Extension / Format match
      if (extensions.length && !extensions.includes(font.extension)) {
        return false;
      }

      // Favorites only filter
      if (favoritesOnly && !favorites.includes(font.id)) {
        return false;
      }

      // Custom only filter
      if (customOnly && !font.isCustom) {
        return false;
      }

      // Category filter
      if (categoryFilter && categoryFilter !== "all") {
        const isMono = /mono|code|consolas|courier|typewriter|inconsolata|fira\s*code|jetbrains/i.test(name);
        const isSerif = !isMono && /serif|roman|garamond|times|caslon|georgia|baskerville|bodoni|didot|minion|merriweather|playfair/i.test(name);
        const isDisplay = /display|script|hand|comic|blackletter|stencil|gothic|decorative/i.test(name);
        const isSans = !isMono && !isSerif;

        if (categoryFilter === "mono" && !isMono) return false;
        if (categoryFilter === "serif" && !isSerif) return false;
        if (categoryFilter === "sans" && !isSans) return false;
        if (categoryFilter === "display" && !isDisplay) return false;
      }

      return true;
    });

    return matches.sort((a, b) => {
      if (sort === "az") return (a.family || a.originalName).localeCompare(b.family || b.originalName);
      if (sort === "za") return (b.family || b.originalName).localeCompare(a.family || a.originalName);
      if (sort === "type") return (a.extension || "").localeCompare(b.extension || "");
      if (sort === "glyphs") return (b.numGlyphs || 0) - (a.numGlyphs || 0);
      return (a.index || 0) - (b.index || 0);
    });
  }, [allFonts, query, extensions, categoryFilter, favoritesOnly, customOnly, favorites, sort]);

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-text selection:text-bg">
      <Head>
        <title>FontStash - Local Typography Playground &amp; Workbench</title>
        <meta name="description" content="Local-first typography playground and font inspection workbench. Private, offline, zero cloud uploads." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </Head>

      {/* Full-window Drag & Drop Font Ingestion */}
      <DragDropOverlay />

      {/* Command Palette (⌘K) */}
      <CommandPalette allFonts={allFonts} />

      {/* Single Font Deep Inspection Modal */}
      <FontSpecimenModal />

      {/* Micro-interaction Toast */}
      <Toast />

      {/* Sticky Top Navigation */}
      <TopBar
        query={query}
        setQuery={setQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Canvas */}
      <main className="max-w-[1520px] mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-8 flex flex-col gap-4 sm:gap-7 pb-20">
        <PreviewControls
          query={query}
          setQuery={setQuery}
          settings={settings}
          updateSetting={updateSetting}
          extensions={extensions}
          sort={sort}
          setSort={setSort}
          toggleFilter={toggleFilter}
        />

        {viewMode === "compare" ? (
          <FontCompareView allFonts={allFonts} />
        ) : filteredFonts.length === 0 ? (
          <EmptyState />
        ) : (
          <FontExplorer
            fonts={filteredFonts}
            viewMode={viewMode}
            settings={settings}
          />
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { getFontsMetaFromFiles } = await import("@/utils/fontMetadata");
  const fontsDir = path.join(process.cwd(), "public", "fonts");
  
  let files = [];
  try {
    const walk = (dir, rel = "") => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        const relPath = rel ? `${rel}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          walk(full, relPath);
        } else {
          files.push(relPath);
        }
      }
    };
    walk(fontsDir);
  } catch {}
  
  const list = getFontsMetaFromFiles(files, fontsDir);
  return { props: { fontsMeta: list } };
}
