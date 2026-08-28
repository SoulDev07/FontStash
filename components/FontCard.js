import { useState } from "react";
import { useFontStore } from "@/stores/useFontStore";
import {
  DownloadSimpleIcon,
  CopyIcon,
  CheckIcon,
  HeartIcon,
  ScalesIcon,
  TrashIcon,
} from "@phosphor-icons/react";

export default function FontCard({ font, text, settings }) {
  const { fontFamily, originalName, format } = font;
  const [copied, setCopied] = useState(false);
  const {
    favorites,
    toggleFavorite,
    compareIds,
    toggleCompare,
    setActiveSpecimenFont,
    removeCustomFont,
    showToast,
  } = useFontStore();

  const isFav = favorites.includes(font.id);
  const isCompared = compareIds.includes(font.id);

  const previewStyle = {
    fontFamily: `'${fontFamily}', ui-sans-serif, system-ui`,
    fontSize: settings ? `${settings.fontSize}px` : undefined,
    lineHeight: settings ? settings.lineHeight : undefined,
    letterSpacing: settings ? `${settings.letterSpacing}px` : undefined,
    textAlign: settings ? settings.alignment : undefined,
    textTransform: settings?.transform !== "none" ? settings?.transform : undefined,
    wordBreak: "break-word",
    overflowWrap: "break-word",
  };

  const getFormatLabel = () => font.extension?.toUpperCase() || font.formatLabel || originalName.split(".").pop()?.toUpperCase() || "";

  const copyCssSnippet = () => {
    const cleanName = font.family || originalName.replace(/\.[^.]+$/, "");
    const css = `@font-face {\n  font-family: '${cleanName}';\n  src: url('${font.url || `/fonts/${originalName}`}') format('${format}');\n  font-display: swap;\n}`;
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      showToast(`Copied CSS for ${cleanName}`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = font.url || `/fonts/${originalName}`;
    link.download = originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${originalName}`);
  };

  const cleanTitle = font.family || originalName.replace(/\.[^.]+$/, "");

  return (
    <div className="card rounded flex flex-col h-[240px] sm:h-[248px] hover:border-text transition-colors duration-150 group overflow-hidden select-none">
      {/* Fixed Header */}
      <div className="h-[54px] shrink-0 px-4 py-2.5 flex items-center justify-between gap-3 border-b border-border bg-panel/30">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setActiveSpecimenFont(font)}>
          <div className="flex items-center gap-2 truncate">
            <h3
              className="font-bold text-sm text-text truncate group-hover:underline underline-offset-2"
              title={cleanTitle}
            >
              {cleanTitle}
            </h3>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-panel border border-border text-muted shrink-0" suppressHydrationWarning>
              {getFormatLabel()}
            </span>
          </div>
          <p className="text-[11px] text-muted font-mono truncate mt-0.5" title={`${font.style || "Normal"} • ${font.weight || 400}`}>
            {font.style || "Normal"} &bull; {font.weight || 400}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              toggleFavorite(font.id);
              showToast(isFav ? "Removed from favorites" : "Added to favorites");
            }}
            className={`w-7 h-7 rounded border transition-colors flex items-center justify-center cursor-pointer active:scale-90 ${
              isFav
                ? "bg-text text-bg border-text"
                : "border-border text-muted hover:text-text hover:border-text bg-card"
            }`}
            title={isFav ? "Favorited" : "Favorite"}
          >
            <HeartIcon size={13} weight={isFav ? "fill" : "regular"} />
          </button>

          <button
            onClick={() => {
              toggleCompare(font.id);
              showToast(isCompared ? "Removed from compare" : "Added to compare list");
            }}
            className={`w-7 h-7 rounded border transition-colors flex items-center justify-center cursor-pointer active:scale-90 ${
              isCompared
                ? "bg-text text-bg border-text"
                : "border-border text-muted hover:text-text hover:border-text bg-card"
            }`}
            title={isCompared ? "In compare workbench" : "Compare"}
          >
            <ScalesIcon size={13} weight={isCompared ? "fill" : "regular"} />
          </button>

          <button
            onClick={copyCssSnippet}
            className="w-7 h-7 rounded border border-border text-muted hover:text-text hover:border-text bg-card flex items-center justify-center cursor-pointer active:scale-90 transition-colors"
            title="Copy @font-face CSS"
          >
            {copied ? <CheckIcon size={12} weight="bold" /> : <CopyIcon size={12} />}
          </button>

          <button
            onClick={handleDownload}
            className="w-7 h-7 rounded border border-border text-muted hover:text-text hover:border-text bg-card flex items-center justify-center cursor-pointer active:scale-90 transition-colors"
            title="Download font file"
          >
            <DownloadSimpleIcon size={12} weight="bold" />
          </button>

          {font.isCustom && (
            <button
              onClick={() => {
                removeCustomFont(font.id);
                showToast(`Removed custom font ${cleanTitle}`);
              }}
              className="w-7 h-7 rounded border border-border text-muted hover:text-danger hover:border-danger bg-card flex items-center justify-center cursor-pointer active:scale-90 transition-colors"
              title="Delete custom font"
            >
              <TrashIcon size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Typography Specimen Canvas - Flexible bounded container */}
      <div
        onClick={() => setActiveSpecimenFont(font)}
        className="flex-1 min-h-0 p-4 sm:p-5 flex items-center justify-center cursor-pointer hover:bg-panel/15 transition-colors overflow-hidden"
        title="Click to open full specimen inspector"
      >
        <div className="w-full text-text leading-normal max-h-full overflow-hidden" style={previewStyle}>
          {text || "The quick brown fox jumps over the lazy dog."}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="h-[36px] shrink-0 mt-auto px-4 py-2 border-t border-border/60 bg-panel/20 flex items-center justify-between text-[11px] font-mono text-muted select-none">
        <span>
          {font.numGlyphs ? `${font.numGlyphs} Glyphs` : font.unitsPerEm ? `UPM ${font.unitsPerEm}` : "Typeface"}
        </span>
        <button
          onClick={() => setActiveSpecimenFont(font)}
          className="text-[10px] text-muted hover:text-text cursor-pointer hover:underline"
        >
          Inspect &rarr;
        </button>
      </div>
    </div>
  );
}

