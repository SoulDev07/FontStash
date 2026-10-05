import { MagnifyingGlassIcon, XIcon, CommandIcon } from '@phosphor-icons/react';
import { useState, useRef, useEffect } from 'react';

import ThemeSwitcher from '@/components/ThemeSwitcher';
import ViewModeToggle from '@/components/ViewModeToggle';
import { useFontStore } from '@/lib/store/useFontStore';

export default function TopBar({ query, setQuery, viewMode, setViewMode }) {
  const { setCommandOpen } = useFontStore();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));

    const handleSlash = (e) => {
      if (
        e.key === '/' &&
        document.activeElement &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
      ) {
        e.preventDefault();
        if (searchInputRef.current) searchInputRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleSlash);
    return () => window.removeEventListener('keydown', handleSlash);
  }, []);

  return (
    <header className="bg-bg/90 border-border/80 sticky top-0 z-30 border-b backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-14 max-w-380 items-center justify-between gap-3 px-3.5 sm:h-15 sm:px-6 md:px-8">
        <button
          type="button"
          className="group flex shrink-0 cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 transition-transform duration-140 select-none active:scale-[0.97]"
          onClick={() => setQuery('')}
          title="Reset search / FontStash home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="FontStash Logo"
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-text group-hover:text-primary font-sans text-sm font-bold tracking-tight transition-colors duration-150">
            FontStash
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <div className="border-border bg-panel/70 focus-within:border-text focus-within:bg-card group hidden h-8.5 items-center gap-2 rounded border px-3 transition-all duration-150 focus-within:shadow-xs sm:flex sm:w-48 md:w-64">
            <MagnifyingGlassIcon
              size={14}
              className="text-muted group-focus-within:text-text shrink-0 transition-colors duration-150"
            />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search typefaces..."
              className="text-text placeholder:text-muted w-full truncate bg-transparent text-xs font-medium outline-none"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="text-muted hover:text-text shrink-0 cursor-pointer rounded p-0.5 transition-all duration-150 hover:rotate-90 active:scale-90"
                title="Clear search"
              >
                <XIcon size={12} />
              </button>
            ) : (
              <kbd className="bg-card border-border text-muted hidden shrink-0 rounded-xs border px-1.5 py-0.5 font-mono text-[9px] transition-opacity duration-150 select-none group-focus-within:opacity-40 lg:inline">
                /
              </kbd>
            )}
          </div>

          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded border transition-all duration-140 active:scale-95 sm:hidden ${
              mobileSearchOpen
                ? 'bg-text text-bg border-text shadow-xs'
                : 'border-border text-muted bg-panel/70'
            }`}
            title="Search fonts"
          >
            <MagnifyingGlassIcon size={15} />
          </button>

          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

          <button
            onClick={() => setCommandOpen(true)}
            className="border-border bg-card hover:bg-panel hover:border-text text-text group hidden h-8.5 cursor-pointer items-center gap-2 rounded border px-3 text-xs shadow-2xs transition-all duration-140 active:scale-95 md:flex"
            title={`Open Command Palette (${isMac ? '⌘K' : 'Ctrl+K'})`}
          >
            <CommandIcon
              size={14}
              className="text-muted group-hover:text-text transition-colors duration-150"
            />
            <span className="text-text font-sans font-medium">Command</span>
            <kbd className="bg-panel border-border text-muted group-hover:border-text/40 group-hover:text-text rounded-xs border px-1.5 py-0.5 font-mono text-[10px] font-medium transition-colors duration-150 select-none">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>

          <ThemeSwitcher />
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-border/60 bg-card animate-drawer-down border-t px-3.5 pt-1 pb-3 sm:hidden">
          <div className="border-border bg-panel/80 focus-within:border-text flex h-9 items-center gap-2.5 rounded border px-3">
            <MagnifyingGlassIcon size={14} className="text-muted shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search typefaces by name or format..."
              className="text-text placeholder:text-muted w-full bg-transparent text-xs font-medium outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-muted hover:text-text cursor-pointer rounded p-1 transition-all duration-150 hover:rotate-90 active:scale-90"
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
