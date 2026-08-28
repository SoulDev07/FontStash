import { useState } from "react";
import { useFontStore } from "@/stores/useFontStore";
import ViewModeToggle from "@/components/ViewModeToggle";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { MagnifyingGlassIcon, XIcon, SparkleIcon, CommandIcon } from "@phosphor-icons/react";

export default function TopBar({
  query,
  setQuery,
  viewMode,
  setViewMode,
}) {
  const { setCommandOpen } = useFontStore();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-xl border-b border-border/80 transition-colors">
      <div className="max-w-[1520px] mx-auto px-3.5 sm:px-6 md:px-8 h-14 sm:h-15 flex items-center justify-between gap-3">
        {/* Brand with Bespoke Vector Logo */}
        <div className="flex items-center gap-2.5 select-none shrink-0">
          <div
            className="flex items-center gap-2.5 group cursor-pointer active:scale-95 transition-transform duration-120"
            onClick={() => setQuery("")}
            title="Reset search / FontStash home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="FontStash Logo"
              width={24}
              height={24}
              className="w-6 h-6 shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[-4deg]"
            />
            <span className="font-bold text-sm text-text tracking-tight font-sans group-hover:text-primary transition-colors duration-150">
              FontStash
            </span>
          </div>
        </div>

        {/* Global Controls, Search & Theme */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Desktop Search bar */}
          <div className="hidden sm:flex items-center gap-2 rounded sm:w-48 md:w-64 h-8.5 px-3 border border-border bg-panel/70 focus-within:border-text focus-within:bg-card focus-within:shadow-xs transition-all duration-150 group">
            <MagnifyingGlassIcon size={14} className="text-muted group-focus-within:text-text transition-colors duration-150 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search typefaces..."
              className="w-full text-xs font-medium bg-transparent outline-none text-text placeholder:text-muted truncate"
            />
            {query ? (
              <button
                onClick={() => setQuery("")}
                className="p-0.5 rounded text-muted hover:text-text hover:rotate-90 cursor-pointer active:scale-90 transition-all duration-150 shrink-0"
                title="Clear search"
              >
                <XIcon size={12} />
              </button>
            ) : (
              <kbd className="hidden lg:inline text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-card border border-border text-muted select-none shrink-0 transition-opacity duration-150 group-focus-within:opacity-40">
                /
              </kbd>
            )}
          </div>

          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`sm:hidden w-8 h-8 rounded border flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 ${
              mobileSearchOpen || query
                ? "bg-card border-text text-text shadow-xs"
                : "border-border text-muted hover:text-text hover:border-text/60 bg-panel/60"
            }`}
            title="Search fonts"
          >
            <MagnifyingGlassIcon size={15} />
          </button>

          {/* Actions / Command Trigger Button */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden md:flex items-center gap-1.5 h-8.5 px-2.5 rounded border border-border bg-panel text-xs text-text hover:bg-card hover:border-text cursor-pointer transition-all duration-140 active:scale-95 select-none shrink-0 group"
            title="Open Command Palette (Ctrl+K / ⌘K)"
          >
            <SparkleIcon size={13} className="text-primary group-hover:scale-115 group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-medium">Actions</span>
            <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-card border border-border text-muted inline-flex items-center gap-0.5 group-hover:border-text/40 transition-colors">
              <CommandIcon size={9} className="shrink-0" />
              <span>K</span>
            </kbd>
          </button>

          <div className="shrink-0">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          <div className="shrink-0">
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Drawer */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-3.5 pb-3 pt-1 border-t border-border/60 bg-card animate-drawer-down">
          <div className="flex items-center gap-2.5 h-9 px-3 rounded border border-border bg-panel/80 focus-within:border-text">
            <MagnifyingGlassIcon size={14} className="text-muted shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search typefaces by name or format..."
              className="w-full text-xs font-medium bg-transparent outline-none text-text placeholder:text-muted"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded text-muted hover:text-text hover:rotate-90 cursor-pointer active:scale-90 transition-all duration-150"
              >
                <XIcon size={12} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
