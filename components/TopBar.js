import Image from "next/image";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ViewModeToggle from "@/components/ViewModeToggle";
import { MagnifyingGlassIcon, PencilSimpleIcon } from "@phosphor-icons/react";

export default function TopBar({ query, setQuery, sample, setSample, viewMode, setViewMode }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-backdrop-filter:bg-bg/60 bg-bg/70 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="relative flex items-center gap-3">
          <Image src="/logo.svg" alt="FontStash" width={32} height={32} className="rounded-xl shadow-soft" />
          <h1 className="text-xl font-semibold tracking-tight text-text flex items-center gap-1">
            FontStash
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
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
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
