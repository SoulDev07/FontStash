import {
  XIcon,
  CopyIcon,
  CheckIcon,
  DownloadSimpleIcon,
  HeartIcon,
  ScalesIcon,
  FileImageIcon,
} from '@phosphor-icons/react';
import { useState, useRef } from 'react';

import { useFontExport } from '@/hooks/useFontExport';
import { useFontStore } from '@/lib/store/useFontStore';

export default function FontSpecimenModal() {
  const font = useFontStore((state) => state.activeSpecimenFont);
  const setActiveSpecimenFont = useFontStore((state) => state.setActiveSpecimenFont);
  const isFav = useFontStore((state) => (font ? state.favorites.includes(font.id) : false));
  const isCompared = useFontStore((state) => (font ? state.compareIds.includes(font.id) : false));
  const toggleFavorite = useFontStore((state) => state.toggleFavorite);
  const toggleCompare = useFontStore((state) => state.toggleCompare);
  const showToast = useFontStore((state) => state.showToast);

  const [copied, setCopied] = useState(false);
  const [sample, setSample] = useState('Sphinx of black quartz, judge my vow.');
  const [activeTab, setActiveTab] = useState('waterfall');
  const modalContentRef = useRef(null);

  const { exportPng, exporting: exportingPng } = useFontExport(modalContentRef);

  if (!font) return null;

  const cleanTitle = font.family || font.originalName.replace(/\.[^.]+$/, '');

  const waterfallSizes = [14, 18, 24, 32, 48, 64, 80];

  const glyphSubsets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    punctuation: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
  };

  const copyCss = () => {
    const css = `@font-face {\n  font-family: '${font.family || cleanTitle}';\n  src: url('${font.url || `/fonts/${font.originalName}`}') format('${font.format}');\n  font-display: swap;\n}`;
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      showToast(`Copied CSS for ${cleanTitle}`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportPng = () => {
    exportPng(`${cleanTitle}-specimen`);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = font.url || `/fonts/${font.originalName}`;
    link.download = font.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${font.originalName}`);
  };

  return (
    <div className="animate-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 backdrop-blur-xs sm:p-4 md:p-6">
      <div
        className="fixed inset-0"
        onClick={() => setActiveSpecimenFont(null)}
        aria-hidden="true"
      />

      <div className="card animate-modal relative z-10 flex h-[88vh] max-h-[840px] min-h-[520px] w-full max-w-260 flex-col overflow-hidden rounded shadow-2xl shadow-black/60 sm:h-[84vh]">
        <div className="border-border bg-panel/30 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b p-4 pb-3 sm:p-5">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h2 className="text-text truncate text-lg font-bold">{cleanTitle}</h2>
              <span className="tag tag-accent text-[10px]">
                {font.formatLabel || (font.extension ? font.extension.toUpperCase() : '')}
              </span>
              {font.numGlyphs && <span className="tag text-[10px]">{font.numGlyphs} Glyphs</span>}
            </div>
            <p className="text-muted truncate font-mono text-[11px] sm:text-xs">
              Weight: {font.weight || 400} &bull; Style: {font.style || 'Normal'}
              {font.designer
                ? ` • Designer: ${font.designer}`
                : font.manufacturer
                  ? ` • Foundry: ${font.manufacturer}`
                  : ''}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={() => {
                toggleFavorite(font.id);
                showToast(isFav ? 'Removed from favorites' : 'Added to favorites');
              }}
              className={`cursor-pointer rounded border p-1.5 transition-all duration-150 active:scale-90 ${
                isFav
                  ? 'bg-danger/15 border-danger text-danger'
                  : 'border-border text-muted hover:text-danger hover:border-danger bg-card'
              }`}
              title={isFav ? 'Favorited' : 'Favorite'}
            >
              <HeartIcon size={14} weight={isFav ? 'fill' : 'regular'} />
            </button>

            <button
              onClick={() => {
                toggleCompare(font.id);
                showToast(isCompared ? 'Removed from compare' : 'Added to compare list');
              }}
              className={`cursor-pointer rounded border p-1.5 transition-all duration-150 active:scale-90 ${
                isCompared
                  ? 'bg-primary/15 border-primary text-primary'
                  : 'border-border text-muted hover:text-primary hover:border-primary bg-card'
              }`}
              title={isCompared ? 'In compare workbench' : 'Compare'}
            >
              <ScalesIcon size={14} weight={isCompared ? 'fill' : 'regular'} />
            </button>

            <button
              onClick={copyCss}
              className="border-border text-muted hover:text-text hover:border-text bg-card inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1.5 font-mono text-xs transition-all duration-150 active:scale-95"
              title="Copy @font-face CSS snippet"
            >
              {copied ? <CheckIcon size={13} className="text-success" /> : <CopyIcon size={13} />}
              <span>CSS</span>
            </button>

            <button
              onClick={handleDownload}
              className="border-border text-muted hover:text-text hover:border-text bg-card inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1.5 font-mono text-xs transition-all duration-150 active:scale-95"
              title="Download font file"
            >
              <DownloadSimpleIcon size={13} />
              <span>Download</span>
            </button>

            <button
              onClick={handleExportPng}
              disabled={exportingPng}
              className="border-border text-muted hover:text-text hover:border-text bg-card inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1.5 font-mono text-xs transition-all duration-150 active:scale-95 disabled:opacity-50"
              title="Export as PNG"
            >
              <FileImageIcon size={13} />
              <span>{exportingPng ? '...' : 'PNG'}</span>
            </button>

            <button
              onClick={() => setActiveSpecimenFont(null)}
              className="border-border hover:bg-panel text-muted hover:text-text ml-0.5 cursor-pointer rounded border p-1.5 transition-all duration-150 active:scale-90"
              aria-label="Close modal"
            >
              <XIcon size={15} />
            </button>
          </div>
        </div>

        <div className="border-border bg-panel/20 flex min-h-[44px] shrink-0 flex-col items-stretch justify-between gap-2.5 border-b px-4 py-2 sm:flex-row sm:items-center sm:px-5">
          <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
            {[
              { id: 'waterfall', label: 'Waterfall' },
              { id: 'glyphs', label: 'Glyphs' },
              { id: 'editorial', label: 'Editorial' },
              { id: 'metadata', label: 'Metadata' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95 ${
                  activeTab === tab.id
                    ? 'bg-primary text-bg shadow-xs'
                    : 'text-muted hover:text-text hover:bg-panel'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab !== 'metadata' ? (
            <input
              type="text"
              value={sample}
              onChange={(e) => setSample(e.target.value)}
              placeholder="Type sample text..."
              className="text-text bg-card border-border focus:border-primary w-full rounded border px-2.5 py-1 text-xs transition-colors outline-none sm:w-60"
            />
          ) : (
            <div className="text-muted hidden font-mono text-[11px] sm:block">
              Technical Typeface Parameters
            </div>
          )}
        </div>

        <div
          ref={modalContentRef}
          className="bg-card min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:space-y-5 sm:p-6"
        >
          {activeTab === 'waterfall' && (
            <div className="space-y-3">
              {waterfallSizes.map((size) => (
                <div
                  key={size}
                  className="border-border/50 hover:bg-panel/20 flex flex-col gap-2 overflow-hidden rounded border-b px-2 py-1 pb-3 transition-colors sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <span className="text-muted w-10 shrink-0 font-mono text-[10px] font-medium sm:w-12 sm:text-[11px]">
                    {size}px
                  </span>
                  <div
                    style={{
                      fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui`,
                      fontSize: `${size}px`,
                      lineHeight: 1.2,
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                    className="text-text w-full break-words"
                  >
                    {sample}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'glyphs' && (
            <div className="space-y-4 sm:space-y-5">
              {Object.entries(glyphSubsets).map(([name, chars]) => (
                <div key={name}>
                  <span className="text-muted mb-2 block font-mono text-[10px] font-bold tracking-wider uppercase">
                    {name} ({chars.length})
                  </span>
                  <div className="xs:grid-cols-6 grid grid-cols-4 gap-1.5 sm:grid-cols-8 md:grid-cols-13">
                    {chars.split('').map((c, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          navigator.clipboard.writeText(c);
                          showToast(`Copied glyph '${c}'`);
                        }}
                        className="border-border bg-panel/30 hover:border-primary hover:bg-card group flex min-h-[48px] cursor-pointer flex-col items-center justify-center rounded border p-2 transition-all duration-120 select-none active:scale-90"
                        title={`Click to copy: ${c}`}
                      >
                        <span
                          style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                          className="text-text text-xl transition-transform group-hover:scale-110"
                        >
                          {c}
                        </span>
                        <span className="text-muted mt-1 font-mono text-[8px] opacity-70">
                          {c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'editorial' && (
            <div className="card space-y-3 rounded p-5 sm:space-y-4 sm:p-6">
              <h1
                style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                className="text-text text-2xl leading-tight font-bold tracking-tight sm:text-4xl"
              >
                The quick brown fox jumps over the lazy dog
              </h1>
              <p
                style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                className="text-text/90 max-w-2xl text-sm leading-relaxed sm:text-base"
              >
                Typography is the craft of endowing human language with a durable visual form. A
                typeface is not merely a costume worn by a thought; it is the physical architecture
                of reading itself. When proportion, stroke modulation, and spatial density achieve
                balance, the interface ceases to be an obstacle and becomes transparent.
              </p>
              <div
                style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                className="text-muted border-border flex flex-wrap gap-2.5 border-t pt-3 font-mono text-[11px]"
              >
                <span>0123456789</span>
                <span>&bull;</span>
                <span>!@#$%^&*()_+</span>
                <span>&bull;</span>
                <span>Ligatures: fi fl ff ffi</span>
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2.5 font-mono text-xs sm:grid-cols-2">
                <div className="border-border bg-panel/30 space-y-1 rounded border p-3">
                  <span className="text-muted block text-[10px] font-bold uppercase">
                    Font Family
                  </span>
                  <span className="text-text block truncate text-xs font-semibold">
                    {font.family || font.originalName}
                  </span>
                </div>
                <div className="border-border bg-panel/30 space-y-1 rounded border p-3">
                  <span className="text-muted block text-[10px] font-bold uppercase">
                    Style / Subfamily
                  </span>
                  <span className="text-text block truncate text-xs font-semibold">
                    {font.subfamily || font.style || 'Normal'}
                  </span>
                </div>
                <div className="border-border bg-panel/30 space-y-1 rounded border p-3">
                  <span className="text-muted block text-[10px] font-bold uppercase">
                    Weight Class
                  </span>
                  <span className="text-text text-xs font-semibold">{font.weight || 400}</span>
                </div>
                <div className="border-border bg-panel/30 space-y-1 rounded border p-3">
                  <span className="text-muted block text-[10px] font-bold uppercase">
                    Format & Extension
                  </span>
                  <span className="text-text text-xs font-semibold">
                    {font.formatLabel || (font.extension ? font.extension.toUpperCase() : '')} (
                    {font.format})
                  </span>
                </div>
                {font.numGlyphs && (
                  <div className="border-border bg-panel/30 space-y-1 rounded border p-3">
                    <span className="text-muted block text-[10px] font-bold uppercase">
                      Total Glyphs
                    </span>
                    <span className="text-text text-xs font-semibold">{font.numGlyphs}</span>
                  </div>
                )}
                {font.unitsPerEm && (
                  <div className="border-border bg-panel/30 space-y-1 rounded border p-3">
                    <span className="text-muted block text-[10px] font-bold uppercase">
                      Units Per EM
                    </span>
                    <span className="text-text text-xs font-semibold">{font.unitsPerEm}</span>
                  </div>
                )}
                {font.version && (
                  <div className="border-border bg-panel/30 space-y-1 rounded border p-3">
                    <span className="text-muted block text-[10px] font-bold uppercase">
                      Version
                    </span>
                    <span className="text-text block truncate text-xs font-semibold">
                      {font.version}
                    </span>
                  </div>
                )}
                {font.designer && (
                  <div className="border-border bg-panel/30 space-y-1 rounded border p-3">
                    <span className="text-muted block text-[10px] font-bold uppercase">
                      Designer
                    </span>
                    <span className="text-text text-xs font-semibold">{font.designer}</span>
                    {font.designerURL && (
                      <a
                        href={font.designerURL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary block truncate text-[11px] hover:underline"
                      >
                        {font.designerURL}
                      </a>
                    )}
                  </div>
                )}
                {font.manufacturer && (
                  <div className="border-border bg-panel/30 space-y-1 rounded border p-3">
                    <span className="text-muted block text-[10px] font-bold uppercase">
                      Manufacturer / Foundry
                    </span>
                    <span className="text-text text-xs font-semibold">{font.manufacturer}</span>
                    {font.vendorURL && (
                      <a
                        href={font.vendorURL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary block truncate text-[11px] hover:underline"
                      >
                        {font.vendorURL}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {font.copyright && (
                <div className="border-border bg-panel/30 space-y-1 rounded border p-3 font-mono text-xs">
                  <span className="text-muted block text-[10px] font-bold uppercase">
                    Copyright
                  </span>
                  <span className="text-text leading-relaxed">{font.copyright}</span>
                </div>
              )}

              {font.license && (
                <div className="border-border bg-panel/30 space-y-1 rounded border p-3 font-mono text-xs">
                  <span className="text-muted block text-[10px] font-bold uppercase">
                    License Description
                  </span>
                  <p className="text-text max-h-40 overflow-y-auto leading-relaxed whitespace-pre-line">
                    {font.license}
                  </p>
                  {font.licenseURL && (
                    <a
                      href={font.licenseURL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary block truncate pt-1 text-[11px] hover:underline"
                    >
                      {font.licenseURL}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
