import { useFontStore } from "@/stores/useFontStore";
import ViewModeToggle from "@/components/ViewModeToggle";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { MagnifyingGlassIcon, XIcon, HardDrivesIcon, SparkleIcon } from "@phosphor-icons/react";

export default function TopBar({
  query,
  setQuery,
  viewMode,
  setViewMode,
}) {
  const { storageStats, setCommandOpen } = useFontStore();

  return (
    <header className="sticky top-0 z-20 bg-bg border-b border-border py-2.5">
      <div className="w-full flex items-center justify-between gap-3 flex-wrap">
        {/* Brand & Local Storage Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-[11px]">
              FS
            </span>
            <span className="font-bold text-sm text-text tracking-tight">FontStash</span>
          </div>

          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-panel text-[11px] font-mono text-muted font-medium"
            title={`Client-Side IndexedDB Storage: ${storageStats.usageMB} MB of ${storageStats.quotaGB || storageStats.quotaMB} used`}
          >
            <HardDrivesIcon size={12} className="text-primary" />
            <span>Local DB: {storageStats.usageMB} MB</span>
          </div>
        </div>

        {/* Global Controls, Search & Theme */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
          {/* ⌘K Trigger Button */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden md:flex items-center gap-2 h-8 px-2.5 rounded border border-border bg-panel text-xs text-text hover:bg-panel/80 hover:border-text cursor-pointer transition-colors"
            title="Open Command Palette (⌘K)"
          >
            <SparkleIcon size={13} className="text-primary" />
            <span className="font-medium">Actions</span>
            <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-card border border-border text-muted">⌘K</kbd>
          </button>

          {/* Search bar */}
          <div className="flex items-center gap-2 rounded flex-1 sm:flex-initial sm:w-44 lg:w-60 h-8 px-2.5 border border-border bg-panel/60 focus-within:border-primary">
            <MagnifyingGlassIcon size={14} className="text-muted shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fonts..."
              className="w-full text-xs font-medium bg-transparent outline-none text-text placeholder:text-muted"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-0.5 rounded text-muted hover:text-text cursor-pointer"
                title="Clear search"
              >
                <XIcon size={11} />
              </button>
            )}
          </div>

          <div className="shrink-0">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          <div className="shrink-0">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
