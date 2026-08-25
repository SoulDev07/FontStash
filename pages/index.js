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
    licenses,
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
      const found =
        !q ||
        [font.originalName, font.family, font.style, font.formatLabel].some((v) =>
          v?.toLowerCase().includes(q)
        );
      return (
        found &&
        (!extensions.length || extensions.includes(font.extension)) &&
        (!licenses.length || licenses.includes(font.license))
      );
    });

    return matches.sort((a, b) => {
      if (sort === "az") return (a.family || a.originalName).localeCompare(b.family || b.originalName);
      if (sort === "za") return (b.family || b.originalName).localeCompare(a.family || a.originalName);
      if (sort === "type") return (a.extension || "").localeCompare(b.extension || "");
      return (a.index || 0) - (b.index || 0);
    });
  }, [allFonts, query, extensions, licenses, sort]);

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-white transition-colors duration-300">
      <Head>
        <title>FontStash — Local Typography Studio & Playground</title>
        <meta name="description" content="Local-first font playground and typography inspector. Private, offline, zero cloud uploads." />
      </Head>

      {/* Full-window Drag & Drop Font Ingestion */}
      <DragDropOverlay />

      {/* Raycast-style Command Palette (⌘K) */}
      <CommandPalette allFonts={allFonts} />

      {/* Single Font Deep Inspection Modal */}
      <FontSpecimenModal />

      {/* Micro-interaction Toast */}
      <Toast />

      {/* Studio Screen */}
      <div className="px-4 sm:px-6 md:px-8 max-w-[1500px] mx-auto flex flex-col gap-5 pb-16">
        <TopBar
          query={query}
          setQuery={setQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <PreviewControls
          query={query}
          setQuery={setQuery}
          settings={settings}
          updateSetting={updateSetting}
          fontsCount={filteredFonts.length}
          extensions={extensions}
          licenses={licenses}
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
      </div>
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
    files = fs.readdirSync(fontsDir);
  } catch {}
  
  const list = getFontsMetaFromFiles(files);
  return { props: { fontsMeta: list } };
}
