import { useState } from "react";
import { useFontStore } from "@/stores/useFontStore";
import {
  XIcon,
  CopyIcon,
  CheckIcon,
  DownloadSimpleIcon,
  HeartIcon,
  ColumnsIcon,
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
  const cleanTitle = font.originalName.replace(/\.[^.]+$/, "");

  const waterfallSizes = [14, 18, 24, 32, 48, 64, 80];

  const glyphSubsets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    punctuation: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
  };

  const copyCss = () => {
    const css = `@font-face {\n  font-family: '${cleanTitle}';\n  src: url('${font.url || `/fonts/${font.originalName}`}') format('${font.format}');\n  font-display: swap;\n}`;
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-pop">
      <div
        className="fixed inset-0"
        onClick={() => setActiveSpecimenFont(null)}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[1040px] max-h-[90vh] rounded border border-border bg-card flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="p-5 pb-3.5 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-panel/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-text">
                {cleanTitle}
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-border bg-card text-muted">
                {font.formatLabel || font.extension?.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-primary/20 bg-primary/10 text-primary">
                {font.license || "Verified"}
              </span>
            </div>
            <p className="text-xs text-muted font-mono">
              Weight: {font.weight || 400} &bull; Style: {font.style || "Normal"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                toggleFavorite(font.id);
                showToast(isFav ? "Removed from favorites" : "Added to favorites");
              }}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isFav
                  ? "bg-danger/15 border-danger text-danger"
                  : "border-border text-muted hover:text-danger hover:border-danger"
              }`}
              title={isFav ? "Favorited" : "Favorite font"}
            >
              <HeartIcon size={14} weight={isFav ? "fill" : "regular"} />
            </button>

            <button
              onClick={() => {
                toggleCompare(font.id);
                showToast(isCompared ? "Removed from compare" : "Added to compare list");
              }}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isCompared
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border text-muted hover:text-primary hover:border-primary"
              }`}
              title={isCompared ? "In compare bench" : "Compare with other fonts"}
            >
              <ColumnsIcon size={14} weight={isCompared ? "fill" : "regular"} />
            </button>

            <button
              onClick={copyCss}
              className="btn text-xs px-2.5 py-1 rounded border border-border bg-card inline-flex items-center gap-1 cursor-pointer"
            >
              {copied ? <CheckIcon size={13} className="text-success" weight="bold" /> : <CopyIcon size={13} />}
              <span>{copied ? "Copied" : "Copy CSS"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="btn text-xs h-8 px-3 rounded border border-border bg-panel text-text hover:bg-card hover:border-text inline-flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
            >
              <DownloadSimpleIcon size={14} weight="bold" />
              <span>Download</span>
            </button>

            <button
              onClick={() => setActiveSpecimenFont(null)}
              className="p-1.5 rounded border border-border hover:bg-panel text-muted hover:text-text cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <XIcon size={15} />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-5 py-2 border-b border-border bg-panel/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {[
              { id: "waterfall", label: "Size Waterfall" },
              { id: "glyphs", label: "Glyph Wall" },
              { id: "editorial", label: "Editorial Layout" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-muted hover:text-text hover:bg-panel"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={sample}
            onChange={(e) => setSample(e.target.value)}
            placeholder="Type sample text..."
            className="text-xs text-text bg-card border border-border px-2.5 py-1 rounded w-60 hidden sm:block outline-none focus:border-primary"
          />
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {activeTab === "waterfall" && (
            <div className="space-y-4">
              {waterfallSizes.map((size) => (
                <div
                  key={size}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-3 pb-3 border-b border-border/50"
                >
                  <span className="text-[11px] font-mono text-muted w-12 shrink-0">
                    {size}px
                  </span>
                  <div
                    style={{
                      fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui`,
                      fontSize: `${size}px`,
                      lineHeight: 1.2,
                    }}
                    className="text-text break-words flex-1"
                  >
                    {sample}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "glyphs" && (
            <div className="space-y-5">
              {Object.entries(glyphSubsets).map(([name, chars]) => (
                <div key={name}>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-2 font-bold">
                    {name} ({chars.length})
                  </span>
                  <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-13 gap-1.5">
                    {chars.split("").map((c, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          navigator.clipboard.writeText(c);
                          showToast(`Copied glyph '${c}'`);
                        }}
                        className="rounded border border-border bg-panel/30 p-2.5 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-card transition-colors group"
                        title={`Click to copy: ${c}`}
                      >
                        <span
                          style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                          className="text-xl text-text"
                        >
                          {c}
                        </span>
                        <span className="text-[9px] font-mono text-muted mt-1 opacity-70">
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
            <div className="rounded border border-border bg-panel/20 p-6 space-y-4">
              <h1
                style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                className="text-3xl sm:text-4xl font-bold tracking-tight text-text leading-tight"
              >
                The quick brown fox jumps over the lazy dog
              </h1>
              <p
                style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                className="text-sm sm:text-base text-text/90 leading-relaxed max-w-[720px]"
              >
                Typography is the craft of endowing human language with a durable visual form. A typeface is not merely a costume worn by a thought; it is the physical architecture of reading itself. When proportion, stroke modulation, and spatial density achieve balance, the interface ceases to be an obstacle and becomes transparent.
              </p>
              <div
                style={{ fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui` }}
                className="text-xs font-mono text-muted flex gap-3 pt-3 border-t border-border"
              >
                <span>0123456789</span>
                <span>&bull;</span>
                <span>!@#$%^&*()_+</span>
                <span>&bull;</span>
                <span>Ligatures: fi fl ff ffi</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
