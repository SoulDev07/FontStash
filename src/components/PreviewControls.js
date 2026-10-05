import {
  TextTIcon,
  SlidersIcon,
  FunnelIcon,
  ArrowCounterClockwiseIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  HeartIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useState, useRef, useEffect } from 'react';

import { useFontStore } from '@/lib/store/useFontStore';

const DEFAULT_SETTINGS = {
  sampleText: 'The quick brown fox jumps over the lazy dog.',
  fontSize: 24,
  lineHeight: 1.5,
  letterSpacing: 0,
  alignment: 'left',
  transform: 'none',
};

const presets = [
  ['Pangram', 'The quick brown fox jumps over the lazy dog.'],
  ['Headline', 'Grumpy wizards make toxic brew for the evil queen.'],
  ['Paragraph', 'Typography is the craft of endowing human language with a durable visual form.'],
  ['Numerals', '0123456789'],
  ['Punctuation', '!@#$%^&*()_+{}|:"<>?[];\',.'],
];

export default function PreviewControls({ settings, updateSetting }) {
  const {
    extensions,
    toggleFilter,
    sort,
    setSort,
    categoryFilter,
    setCategoryFilter,
    favoritesOnly,
    setFavoritesOnly,
    clearAllFilters,
  } = useFontStore();

  const [showControls, setShowControls] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    if (showFilter) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [showFilter]);

  const reset = () => {
    Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => updateSetting(key, value));
  };

  const isDefault =
    settings.fontSize === DEFAULT_SETTINGS.fontSize &&
    settings.lineHeight === DEFAULT_SETTINGS.lineHeight &&
    settings.letterSpacing === DEFAULT_SETTINGS.letterSpacing &&
    settings.alignment === DEFAULT_SETTINGS.alignment &&
    settings.transform === DEFAULT_SETTINGS.transform;

  const activeFiltersCount =
    extensions.length +
    (categoryFilter !== 'all' ? 1 : 0) +
    (favoritesOnly ? 1 : 0) +
    (sort !== 'index' ? 1 : 0);

  return (
    <section className="card rounded p-3 shadow-xs transition-colors">
      <div className="flex flex-col gap-2.5">
        <div className="border-border bg-card focus-within:border-text focus-within:ring-text/20 flex h-9.5 w-full items-center gap-2.5 rounded border px-3 shadow-2xs transition-all duration-150 focus-within:ring-1">
          <TextTIcon size={16} className="text-muted shrink-0" />
          <input
            value={settings.sampleText}
            onChange={(e) => updateSetting('sampleText', e.target.value)}
            placeholder="Type preview text..."
            className="text-text placeholder:text-muted w-full bg-transparent text-xs font-medium outline-none"
            aria-label="Preview text"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 scrollbar-none items-center gap-1.5 overflow-x-auto py-0.5 pr-1">
            {presets.map(([label, value]) => {
              const isActive = settings.sampleText === value;
              return (
                <button
                  key={label}
                  onClick={() => updateSetting('sampleText', value)}
                  className={`h-7 shrink-0 cursor-pointer rounded border px-2.5 font-mono text-xs font-medium whitespace-nowrap transition-colors duration-140 active:scale-[0.97] ${
                    isActive
                      ? 'bg-text text-bg border-text shadow-xs'
                      : 'bg-card border-border text-text/80 hover:text-text hover:border-text hover:bg-panel'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter((prev) => !prev)}
                className={`inline-flex h-7 cursor-pointer items-center gap-1.5 rounded border px-2.5 text-xs font-medium transition-colors duration-140 active:scale-[0.97] ${
                  showFilter || activeFiltersCount > 0
                    ? 'bg-text text-bg border-text shadow-xs'
                    : 'bg-card border-border text-text hover:bg-panel hover:border-text'
                }`}
                title="Filter and sort fonts"
              >
                <FunnelIcon size={13} weight={activeFiltersCount > 0 ? 'fill' : 'regular'} />
                <span className="hidden sm:inline">Filter</span>
                {activeFiltersCount > 0 && (
                  <span
                    className={`py-0.2 rounded-xs px-1.5 font-mono text-[10px] ${
                      showFilter || activeFiltersCount > 0
                        ? 'bg-bg text-text font-bold'
                        : 'bg-panel text-muted'
                    }`}
                  >
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {showFilter && (
                <div className="card animate-popover bg-card border-border absolute right-0 z-50 mt-1.5 w-72 max-w-[calc(100vw-32px)] rounded border p-3.5 shadow-2xl shadow-black/60">
                  <div className="border-border mb-3 flex items-center justify-between border-b pb-2">
                    <span className="text-muted flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider uppercase">
                      <FunnelIcon size={12} />
                      Filter &amp; Sort
                    </span>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-primary flex cursor-pointer items-center gap-1 text-[10px] font-bold hover:underline active:scale-95"
                      >
                        <XIcon size={10} />
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-muted mb-1.5 font-mono text-[10px] font-bold tracking-wider uppercase">
                      Classification
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'sans', label: 'Sans' },
                        { id: 'serif', label: 'Serif' },
                        { id: 'mono', label: 'Mono' },
                        { id: 'display', label: 'Display' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCategoryFilter(cat.id)}
                          className={`cursor-pointer rounded-sm border px-2 py-0.5 text-xs transition-colors active:scale-95 ${
                            categoryFilter === cat.id
                              ? 'bg-text text-bg border-text font-semibold shadow-xs'
                              : 'bg-panel border-border text-muted hover:text-text hover:border-text'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-muted mb-1.5 font-mono text-[10px] font-bold tracking-wider uppercase">
                      File Formats
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['ttf', 'otf', 'woff', 'woff2'].map((ext) => {
                        const isChecked = extensions.includes(ext);
                        return (
                          <button
                            key={ext}
                            onClick={() => toggleFilter(ext)}
                            className={`flex cursor-pointer items-center gap-1.5 rounded-sm border px-2 py-1 text-left font-mono text-xs transition-colors select-none active:scale-[0.98] ${
                              isChecked
                                ? 'bg-panel border-text text-text font-bold'
                                : 'bg-panel/40 border-border text-muted hover:text-text hover:border-border/80'
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-xs border ${isChecked ? 'bg-text border-text' : 'border-border'}`}
                            />
                            <span>{ext.toUpperCase()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-muted mb-1.5 font-mono text-[10px] font-bold tracking-wider uppercase">
                      Collections
                    </p>
                    <button
                      onClick={() => setFavoritesOnly(!favoritesOnly)}
                      className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm border px-2 py-1.5 text-xs transition-colors select-none active:scale-[0.98] ${
                        favoritesOnly
                          ? 'bg-danger/15 border-danger text-danger font-semibold'
                          : 'bg-panel/40 border-border text-muted hover:text-text'
                      }`}
                    >
                      <HeartIcon size={12} weight={favoritesOnly ? 'fill' : 'regular'} />
                      <span>
                        {favoritesOnly ? 'Showing Favorites Only' : 'Show Favorites Only'}
                      </span>
                    </button>
                  </div>

                  <div>
                    <p className="text-muted mb-1.5 font-mono text-[10px] font-bold tracking-wider uppercase">
                      Sort Order
                    </p>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="border-border bg-panel text-text focus:border-text w-full cursor-pointer rounded border px-2.5 py-1.5 text-xs transition-colors outline-none"
                    >
                      <option value="index">Default Order</option>
                      <option value="az">Alphabetical (A &rarr; Z)</option>
                      <option value="za">Alphabetical (Z &rarr; A)</option>
                      <option value="glyphs">Glyph Count (Most first)</option>
                      <option value="type">File Format (Extension)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowControls(!showControls)}
              className={`inline-flex h-7 cursor-pointer items-center gap-1.5 rounded border px-2.5 text-xs font-medium transition-colors duration-140 active:scale-[0.97] ${
                showControls
                  ? 'bg-text text-bg border-text shadow-xs'
                  : 'bg-card border-border text-text hover:bg-panel hover:border-text'
              }`}
            >
              <SlidersIcon size={13} />
              <span className="hidden sm:inline">Inspector</span>
            </button>
          </div>
        </div>

        {showControls && (
          <div className="border-border animate-drawer-down flex flex-col gap-2.5 border-t pt-2.5">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
              {/* Size */}
              <div className="bg-panel/50 border-border/60 flex items-center justify-between gap-2.5 rounded border px-2.5 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
                <span className="text-muted w-14 font-mono text-xs font-medium sm:w-auto">
                  Size:
                </span>
                <input
                  type="range"
                  min="8"
                  max="120"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                  className="range-slider flex-1 sm:w-28"
                />
                <span className="text-text bg-panel border-border min-w-[44px] shrink-0 rounded border px-1.5 py-0.5 text-center font-mono text-xs font-bold">
                  {settings.fontSize}px
                </span>
              </div>

              {/* Leading / Line height */}
              <div className="bg-panel/50 border-border/60 flex items-center justify-between gap-2.5 rounded border px-2.5 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
                <span
                  className="text-muted w-16 font-mono text-xs font-medium sm:w-auto"
                  title="Leading (Line Height)"
                >
                  Leading:
                </span>
                <input
                  type="range"
                  min="0.8"
                  max="3"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => updateSetting('lineHeight', Number(e.target.value))}
                  className="range-slider flex-1 sm:w-24"
                />
                <span className="text-text bg-panel border-border min-w-[38px] shrink-0 rounded border px-1.5 py-0.5 text-center font-mono text-xs font-bold">
                  {settings.lineHeight}
                </span>
              </div>

              {/* Tracking / Letter spacing */}
              <div className="bg-panel/50 border-border/60 flex items-center justify-between gap-2.5 rounded border px-2.5 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
                <span
                  className="text-muted w-16 font-mono text-xs font-medium sm:w-auto"
                  title="Tracking (Letter Spacing)"
                >
                  Tracking:
                </span>
                <input
                  type="range"
                  min="-10"
                  max="40"
                  value={settings.letterSpacing}
                  onChange={(e) => updateSetting('letterSpacing', Number(e.target.value))}
                  className="range-slider flex-1 sm:w-24"
                />
                <span className="text-text bg-panel border-border min-w-[42px] shrink-0 rounded border px-1.5 py-0.5 text-center font-mono text-xs font-bold">
                  {settings.letterSpacing}px
                </span>
              </div>
            </div>

            {/* Alignment & Transforms */}
            <div className="border-border/40 flex flex-wrap items-center justify-between gap-2 border-t pt-1 sm:flex-nowrap sm:border-0">
              <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
                <div className="border-border bg-panel flex items-center rounded border p-0.5">
                  {[
                    { align: 'left', icon: TextAlignLeftIcon },
                    { align: 'center', icon: TextAlignCenterIcon },
                    { align: 'right', icon: TextAlignRightIcon },
                    { align: 'justify', icon: TextAlignJustifyIcon },
                  ].map(({ align, icon: Icon }) => (
                    <button
                      key={align}
                      onClick={() => updateSetting('alignment', align)}
                      className={`cursor-pointer rounded p-1.5 transition-colors duration-120 active:scale-[0.97] ${
                        settings.alignment === align
                          ? 'bg-text text-bg shadow-xs'
                          : 'text-muted hover:text-text'
                      }`}
                      title={`Align ${align}`}
                    >
                      <Icon size={13} />
                    </button>
                  ))}
                </div>

                <select
                  value={settings.transform}
                  onChange={(e) => updateSetting('transform', e.target.value)}
                  className="border-border bg-panel text-text focus:border-text h-7.5 rounded border px-2.5 text-xs font-medium transition-colors outline-none"
                >
                  <option value="none">Normal Case</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                  <option value="capitalize">Title Case</option>
                </select>
              </div>

              {!isDefault && (
                <button
                  onClick={reset}
                  className="border-border text-muted hover:text-text hover:border-text ml-auto inline-flex h-7.5 cursor-pointer items-center gap-1 rounded border px-2 text-xs font-medium transition-colors duration-120 active:scale-[0.97] sm:ml-0"
                  title="Reset settings"
                >
                  <ArrowCounterClockwiseIcon size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
