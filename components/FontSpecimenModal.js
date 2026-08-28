import { useState } from "react";
import { useFontStore } from "@/stores/useFontStore";
import {
  XIcon,
  CopyIcon,
  CheckIcon,
  DownloadSimpleIcon,
  HeartIcon,
  ScalesIcon,
} from "@phosphor-icons/react";

export default function FontSpecimenModal() {
  const {
    activeSpecimenFont: font,
    setActiveSpecimenFont,
    favorites,
    toggleFavorite,
    compareIds,
    toggleCompare,
    showToast,
  } = useFontStore();
  const [copied, setCopied] = useState(false);
  const [sample, setSample] = useState("Sphinx of black quartz, judge my vow.");
  const [activeTab, setActiveTab] = useState("waterfall");

  if (!font) return null;

  const isFav = favorites.includes(font.id);
  const isCompared = compareIds.includes(font.id);
  const cleanTitle = font.family || font.originalName.replace(/\.[^.]+$/, "");

  const waterfallSizes = [14, 18, 24, 32, 48, 64, 80];

  const glyphSubsets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    punctuation: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
  };

  const copyCss = () => {
    const css = `@font-face {\n  font-family: '${font.family || cleanTitle}';\n  src: url('${font.url || `/fonts/${font.originalName}`}') format('${font.format}');\n  font-display: swap;\n}`;
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      showToast(`Copied CSS for ${cleanTitle}`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = font.url || `/fonts/${font.originalName}`;
    link.download = font.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${font.originalName}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-backdrop">
      <div
        className="fixed inset-0"
        onClick={() => setActiveSpecimenFont(null)}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[1040px] h-[88vh] sm:h-[84vh] max-h-[840px] min-h-[520px] card rounded shadow-2xl shadow-black/60 flex flex-col overflow-hidden z-10 animate-modal">
        {/* Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-panel/30 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-lg font-bold text-text truncate">
                {cleanTitle}
              </h2>
              <span className="tag tag-accent text-[10px]">
                {font.formatLabel || font.extension?.toUpperCase()}
              </span>
              {font.numGlyphs && (
                <span className="tag text-[10px]">
                  {font.numGlyphs} Glyphs
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-muted font-mono truncate">
              Weight: {font.weight || 400} &bull; Style: {font.style || "Normal"}
              {font.designer ? ` • Designer: ${font.designer}` : font.manufacturer ? ` • Foundry: ${font.manufacturer}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                toggleFavorite(font.id);
                showToast(isFav ? "Removed from favorites" : "Added to favorites");
              }}
              className={`p-1.5 rounded border transition-all duration-150 cursor-pointer active:scale-90 ${
                isFav
                  ? "bg-danger/15 border-danger text-danger"
                  : "border-border text-muted hover:text-danger hover:border-danger bg-card"
              }`}
              title={isFav ? "Favorited" : "Favorite font"}
            >
              <HeartIcon size={15} weight={isFav ? "fill" : "regular"} />
            </button>

            <button
              onClick={() => {
                toggleCompare(font.id);
                showToast(isCompared ? "Removed from compare" : "Added to compare list");
              }}
              className={`p-1.5 rounded border transition-all duration-150 cursor-pointer active:scale-90 ${
                isCompared
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border text-muted hover:text-primary hover:border-primary bg-card"
              }`}
              title={isCompared ? "In compare bench" : "Compare with other fonts"}
            >
              <ScalesIcon size={15} weight={isCompared ? "fill" : "regular"} />
            </button>

            <button
              onClick={copyCss}
              className="btn text-xs px-2.5 py-1 rounded border border-border bg-card inline-flex items-center gap-1 cursor-pointer font-mono hover:border-primary hover:text-primary"
            >
              {copied ? <CheckIcon size={12} className="text-success" weight="bold" /> : <CopyIcon size={12} />}
              <span>{copied ? "Copied" : "Copy CSS"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="btn text-xs px-3 py-1 rounded border border-border bg-panel text-text hover:bg-card hover:border-primary hover:text-primary inline-flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <DownloadSimpleIcon size={13} weight="bold" />
              <span>Download</span>
            </button>

            <button
              onClick={() => setActiveSpecimenFont(null)}
              className="p-1.5 rounded border border-border hover:bg-panel text-muted hover:text-text cursor-pointer ml-0.5 active:scale-90 transition-all duration-150"
              aria-label="Close modal"
            >
              <XIcon size={15} />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-4 sm:px-5 py-2 border-b border-border bg-panel/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0 min-h-[44px]">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 sm:pb-0">
            {[
              { id: "waterfall", label: "Waterfall" },
              { id: "glyphs", label: "Glyphs" },
              { id: "editorial", label: "Editorial" },
              { id: "metadata", label: "Metadata" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs px-2.5 py-1 rounded transition-all duration-150 cursor-pointer active:scale-95 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-white font-bold shadow-xs"
                    : "text-muted hover:text-text hover:bg-panel"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab !== "metadata" ? (
            <input
              type="text"
              value={sample}
              onChange={(e) => setSample(e.target.value)}
              placeholder="Type sample text..."
              className="text-xs text-text bg-card border border-border px-2.5 py-1 rounded w-full sm:w-60 outline-none focus:border-primary transition-colors"
            />
          ) : (
            <div className="hidden sm:block text-[11px] font-mono text-muted">
              Technical Typeface Parameters
            </div>
          )}
        </div>

        {/* Modal Body Content - Fixed scrollable container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4 sm:space-y-5">
          {activeTab === "waterfall" && (
            <div className="space-y-3">
              {waterfallSizes.map((size) => (
                <div
                  key={size}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 pb-3 border-b border-border/50 hover:bg-panel/20 px-2 py-1 rounded transition-colors overflow-hidden"
                >
                  <span className="text-[10px] sm:text-[11px] font-mono text-muted w-10 sm:w-12 shrink-0 font-medium">
                    {size}px
                  </span>
                  <div
                    style={{
                      fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui`,
                      fontSize: `${size}px`,
                      lineHeight: 1.2,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                    className="text-text break-words w-full"
                  >
                    {sample}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "glyphs" && (
            <div className="space-y-4 sm:space-y-5">
              {Object.entries(glyphSubsets).map(([name, chars]) => (
                <div key={name}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted block mb-2 font-bold">
                    {name} ({chars.length})
                  </span>
                  <div className="grid grid-cols-4 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-13 gap-1.5">
                    {chars.split("").map((c, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          navigator.clipboard.writeText(c);
                          showToast(`Copied glyph '${c}'`);
                        }}
                        className="rounded border border-border bg-panel/30 p-2 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-card active:scale-90 transition-all duration-120 group select-none min-h-[48px]"
                        title={`Click to copy: ${c}`}
                      >
                        <span
                          style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                          className="text-xl text-text transition-transform group-hover:scale-110"
                        >
                          {c}
                        </span>
                        <span className="text-[8px] font-mono text-muted mt-1 opacity-70">
                          {c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "editorial" && (
            <div className="card rounded p-5 sm:p-6 space-y-3 sm:space-y-4">
              <h1
                style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                className="text-2xl sm:text-4xl font-bold tracking-tight text-text leading-tight"
              >
                The quick brown fox jumps over the lazy dog
              </h1>
              <p
                style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                className="text-sm sm:text-base text-text/90 leading-relaxed max-w-2xl"
              >
                Typography is the craft of endowing human language with a durable visual form. A typeface is not merely a costume worn by a thought; it is the physical architecture of reading itself. When proportion, stroke modulation, and spatial density achieve balance, the interface ceases to be an obstacle and becomes transparent.
              </p>
              <div
                style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                className="text-[11px] font-mono text-muted flex flex-wrap gap-2.5 pt-3 border-t border-border"
              >
                <span>0123456789</span>
                <span>&bull;</span>
                <span>!@#$%^&*()_+</span>
                <span>&bull;</span>
                <span>Ligatures: fi fl ff ffi</span>
              </div>
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded border border-border bg-panel/30 space-y-1">
                  <span className="text-[10px] uppercase text-muted font-bold block">Font Family</span>
                  <span className="text-text font-semibold text-xs truncate block">{font.family || font.originalName}</span>
                </div>
                <div className="p-3 rounded border border-border bg-panel/30 space-y-1">
                  <span className="text-[10px] uppercase text-muted font-bold block">Style / Subfamily</span>
                  <span className="text-text font-semibold text-xs truncate block">{font.subfamily || font.style || "Normal"}</span>
                </div>
                <div className="p-3 rounded border border-border bg-panel/30 space-y-1">
                  <span className="text-[10px] uppercase text-muted font-bold block">Weight Class</span>
                  <span className="text-text font-semibold text-xs">{font.weight || 400}</span>
                </div>
                <div className="p-3 rounded border border-border bg-panel/30 space-y-1">
                  <span className="text-[10px] uppercase text-muted font-bold block">Format & Extension</span>
                  <span className="text-text font-semibold text-xs">{font.formatLabel || font.extension?.toUpperCase()} ({font.format})</span>
                </div>
                {font.numGlyphs && (
                  <div className="p-3 rounded border border-border bg-panel/30 space-y-1">
                    <span className="text-[10px] uppercase text-muted font-bold block">Total Glyphs</span>
                    <span className="text-text font-semibold text-xs">{font.numGlyphs}</span>
                  </div>
                )}
                {font.unitsPerEm && (
                  <div className="p-3 rounded border border-border bg-panel/30 space-y-1">
                    <span className="text-[10px] uppercase text-muted font-bold block">Units Per EM</span>
                    <span className="text-text font-semibold text-xs">{font.unitsPerEm}</span>
                  </div>
                )}
                {font.version && (
                  <div className="p-3 rounded border border-border bg-panel/30 space-y-1">
                    <span className="text-[10px] uppercase text-muted font-bold block">Version</span>
                    <span className="text-text font-semibold text-xs truncate block">{font.version}</span>
                  </div>
                )}
                {font.designer && (
                  <div className="p-3 rounded border border-border bg-panel/30 space-y-1">
                    <span className="text-[10px] uppercase text-muted font-bold block">Designer</span>
                    <span className="text-text font-semibold text-xs">{font.designer}</span>
                    {font.designerURL && (
                      <a href={font.designerURL} target="_blank" rel="noreferrer" className="text-primary block hover:underline text-[11px] truncate">
                        {font.designerURL}
                      </a>
                    )}
                  </div>
                )}
                {font.manufacturer && (
                  <div className="p-3 rounded border border-border bg-panel/30 space-y-1">
                    <span className="text-[10px] uppercase text-muted font-bold block">Manufacturer / Foundry</span>
                    <span className="text-text font-semibold text-xs">{font.manufacturer}</span>
                    {font.vendorURL && (
                      <a href={font.vendorURL} target="_blank" rel="noreferrer" className="text-primary block hover:underline text-[11px] truncate">
                        {font.vendorURL}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {font.copyright && (
                <div className="p-3 rounded border border-border bg-panel/30 space-y-1 text-xs font-mono">
                  <span className="text-[10px] uppercase text-muted font-bold block">Copyright</span>
                  <span className="text-text leading-relaxed">{font.copyright}</span>
                </div>
              )}

              {font.license && (
                <div className="p-3 rounded border border-border bg-panel/30 space-y-1 text-xs font-mono">
                  <span className="text-[10px] uppercase text-muted font-bold block">License Description</span>
                  <p className="text-text whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">{font.license}</p>
                  {font.licenseURL && (
                    <a href={font.licenseURL} target="_blank" rel="noreferrer" className="text-primary block hover:underline text-[11px] pt-1 truncate">
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
