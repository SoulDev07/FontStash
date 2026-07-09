import { useState } from "react";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import FontExplorer from "@/components/FontExplorer";
import PreviewControls from "@/components/PreviewControls";
import EmptyState from "@/components/EmptyState";
import { useFontSearch } from "@/hooks/useFontSearch";
import { usePreviewSettings } from "@/hooks/usePreviewSettings";
import { useFontRegistration } from "@/hooks/useFontRegistration";

export default function Home({ fontsMeta = [] }) {
  const { query, setQuery, filtered, empty } = useFontSearch(fontsMeta);
  const { sample, setSample } = usePreviewSettings();
  const [viewMode, setViewMode] = useState("list");

  useFontRegistration(fontsMeta);

  const onSidebarSelect = (f) => {
    const el = document.getElementById(`font-${f.id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AppShell
      topBar={
        <TopBar query={query} setQuery={setQuery} sample={sample} setSample={setSample} viewMode={viewMode} setViewMode={setViewMode} />
      }
      sidebar={<Sidebar fonts={fontsMeta} onSelect={onSidebarSelect} />}
    >
      <PreviewControls query={query} setQuery={setQuery} sample={sample} setSample={setSample} />

      {empty ? <EmptyState /> : <FontExplorer fonts={filtered} viewMode={viewMode} sampleText={sample} />}
    </AppShell>
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
  return { props: { fontsMeta: list }, revalidate: 5 };
}
