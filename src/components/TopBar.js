import { useState, useRef, useEffect } from "react";
import { useFontStore } from "@/lib/store/useFontStore";
import ViewModeToggle from "@/components/ViewModeToggle";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { MagnifyingGlassIcon, XIcon, CommandIcon } from "@phosphor-icons/react";

export default function TopBar({
  query,
  setQuery,
  viewMode,
  setViewMode,
}) {
  const { setCommandOpen } = useFontStore();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));

    const handleSlash = (e) => {
      if (e.key === "/" && document.activeElement && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        if (searchInputRef.current) searchInputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleSlash);
    return () => window.removeEventListener("keydown", handleSlash);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-xl border-b border-border/80 transition-colors">
      <div className="max-w-380 mx-auto px-3.5 sm:px-6 md:px-8 h-14 sm:h-15 flex items-center justify-between gap-3">
        <button
          type="button"
          className="flex items-center gap-2.5 select-none shrink-0 group cursor-pointer active:scale-[0.97] transition-transform duration-140 bg-transparent border-0 p-0"
          onClick={() => setQuery("")}
          title="Reset search / FontStash home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="FontStash Logo"
            width={24}
            height={24}
            className="w-6 h-6 shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-bold text-sm text-text tracking-tight font-sans group-hover:text-primary transition-colors duration-150">
            FontStash
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-2 rounded sm:w-48 md:w-64 h-8.5 px-3 border border-border bg-panel/70 focus-within:border-text focus-within:bg-card focus-within:shadow-xs transition-all duration-150 group">
            <MagnifyingGlassIcon size={14} className="text-muted group-focus-within:text-text transition-colors duration-150 shrink-0" />
            <input
              ref={searchInputRef}
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

          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`sm:hidden w-8.5 h-8.5 rounded border flex items-center justify-center transition-all duration-140 cursor-pointer active:scale-95 ${
              mobileSearchOpen ? "bg-text text-bg border-text shadow-xs" : "border-border text-muted bg-panel/70"
            }`}
            title="Search fonts"
          >
            <MagnifyingGlassIcon size={15} />
          </button>

          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

          <button
            onClick={() => setCommandOpen(true)}
            className="hidden md:flex h-8.5 px-3 rounded border border-border bg-card hover:bg-panel hover:border-text text-xs text-text items-center gap-2 cursor-pointer transition-all duration-140 active:scale-95 group shadow-2xs"
            title={`Open Command Palette (${isMac ? "⌘K" : "Ctrl+K"})`}
          >
            <CommandIcon size={14} className="text-muted group-hover:text-text transition-colors duration-150" />
            <span className="font-sans font-medium text-text">Command</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-panel border border-border text-muted select-none group-hover:border-text/40 group-hover:text-text transition-colors duration-150 font-medium">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>

          <ThemeSwitcher />
        </div>
      </div>

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
