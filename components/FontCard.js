import { useState } from "react";
import { useFontStore } from "@/stores/useFontStore";
import {
  DownloadSimpleIcon,
  CopyIcon,
  CheckIcon,
  HeartIcon,
  ColumnsIcon,
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
  };

  const getCreator = () => {
    if (font.isCustom) return "Custom Upload";
    if (originalName.toLowerCase().includes("cascadia")) return "Microsoft Typography";
    if (originalName.toLowerCase().includes("inter")) return "Rasmus Andersson";
    if (originalName.toLowerCase().includes("fira")) return "Mozilla Foundation";
    if (originalName.toLowerCase().includes("roboto")) return "Google Design";
    if (originalName.toLowerCase().includes("ibm")) return "IBM Design";
    if (originalName.toLowerCase().includes("poppins")) return "Indian Type Foundry";
    if (originalName.toLowerCase().includes("lato")) return "Łukasz Dziedzic";
    if (originalName.toLowerCase().includes("consol")) return "Microsoft Corp";
    if (originalName.toLowerCase().includes("saira")) return "Omnibus-Type";
    if (originalName.toLowerCase().includes("rethink")) return "Google Fonts";
    return "Open Foundry";
  };

  const getSubset = () => font.subset || "A-Z a-z 0-9 @!$%&*";
  const getLicense = () => font.license || "Free";
  const getFormatLabel = () => font.extension?.toUpperCase() || font.formatLabel || originalName.split(".").pop()?.toUpperCase() || "";

  const copyCssSnippet = () => {
    const cleanName = originalName.replace(/\.[^.]+$/, "");
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

  const cleanTitle = originalName.replace(/\.[^.]+$/, "");
  const isCommercial = getLicense() === "Commercial";

  return (
    <div className="bg-card border border-border rounded flex flex-col overflow-hidden hover:border-text/60 transition-colors group">
      {/* Header */}
      <div className="p-4 pb-3 flex items-start justify-between gap-3 border-b border-border bg-panel/30">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setActiveSpecimenFont(font)}>
          <h3
            className="font-bold text-sm text-text truncate group-hover:text-primary transition-colors"
            title={cleanTitle}
          >
            {font.family || cleanTitle}
          </h3>
          <p className="text-[11px] text-muted font-mono mt-0.5 truncate">
            {getCreator()}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-border bg-panel text-text">
            {getFormatLabel()}
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
              isCommercial
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-panel text-text border-border"
            }`}
          >
            {getLicense()}
          </span>
        </div>
      </div>

      {/* Direct Typography Specimen Canvas (No nested redundant boxes) */}
      <div
        onClick={() => setActiveSpecimenFont(font)}
        className="p-5 min-h-[130px] flex items-center justify-center cursor-pointer hover:bg-panel/20 transition-colors"
        title="Click to open specimen inspector"
      >
        <div className="w-full break-words text-text leading-normal" style={previewStyle}>
          {text || "The quick brown fox jumps over the lazy dog"}
        </div>
      </div>

      {/* Characters subset row */}
      <div className="px-4 py-2 border-t border-border bg-panel/20 flex items-center justify-between text-[11px] text-muted font-mono select-none">
        <span className="truncate max-w-[180px] font-medium">{getSubset()}</span>
        <span className="text-[10px] text-muted">Full Glyphs</span>
      </div>

      {/* Action footer */}
      <div className="mt-auto px-4 py-3 bg-panel/40 border-t border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownload}
            className="btn text-xs h-8 px-2.5 sm:px-3 rounded border border-border bg-panel text-text hover:bg-card hover:border-text inline-flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
            title={`Download ${originalName}`}
          >
            <DownloadSimpleIcon size={14} weight="bold" />
            <span className="hidden xs:inline sm:inline">Download</span>
          </button>

          <button
            onClick={() => {
              toggleFavorite(font.id);
              showToast(isFav ? "Removed from favorites" : "Added to favorites");
            }}
            className={`w-8 h-8 rounded border transition-colors flex items-center justify-center cursor-pointer ${
              isFav
                ? "bg-danger/15 border-danger text-danger"
                : "border-border text-muted hover:text-danger hover:border-danger bg-card"
            }`}
            title={isFav ? "Favorited" : "Add to favorites"}
          >
            <HeartIcon size={14} weight={isFav ? "fill" : "regular"} />
          </button>

          <button
            onClick={() => {
              toggleCompare(font.id);
              showToast(isCompared ? "Removed from compare" : "Added to compare list");
            }}
            className={`w-8 h-8 rounded border transition-colors flex items-center justify-center cursor-pointer ${
              isCompared
                ? "bg-primary/15 border-primary text-primary"
                : "border-border text-muted hover:text-primary hover:border-primary bg-card"
            }`}
            title={isCompared ? "In compare workbench" : "Add to compare"}
          >
            <ColumnsIcon size={14} weight={isCompared ? "fill" : "regular"} />
          </button>

          {font.isCustom && (
            <button
              onClick={() => {
                removeCustomFont(font.id);
                showToast(`Removed custom font ${cleanTitle}`);
              }}
              className="w-8 h-8 rounded border border-border text-muted hover:text-danger hover:border-danger bg-card flex items-center justify-center cursor-pointer"
              title="Delete custom font"
            >
              <TrashIcon size={14} />
            </button>
          )}
        </div>

        <button
          onClick={copyCssSnippet}
          className="btn text-xs px-2.5 py-1.5 rounded border border-border bg-card inline-flex items-center gap-1 cursor-pointer font-mono"
          title="Copy @font-face CSS snippet"
        >
          {copied ? (
            <>
              <CheckIcon size={13} className="text-success" weight="bold" />
              <span className="text-success font-sans">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon size={13} />
              <span>CSS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
