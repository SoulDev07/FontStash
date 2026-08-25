import { useState, useMemo } from "react";
import { useFontStore } from "@/stores/useFontStore";
import {
  DownloadSimpleIcon,
  CopyIcon,
  CheckIcon,
  HeartIcon,
  ColumnsIcon,
} from "@phosphor-icons/react";

export default function FontRow({ font, text, settings }) {
  const { fontFamily, originalName, format } = font;
  const [copied, setCopied] = useState(false);
  const {
    favorites,
    toggleFavorite,
    compareIds,
    toggleCompare,
    setActiveSpecimenFont,
    showToast,
  } = useFontStore();

  const isFav = favorites.includes(font.id);
  const isCompared = compareIds.includes(font.id);

  const preview = useMemo(
    () => text?.trim() || "The quick brown fox jumps over the lazy dog",
    [text]
  );

  const previewStyle = {
    fontFamily: `'${fontFamily}', ui-sans-serif, system-ui`,
    fontSize: settings ? `${settings.fontSize}px` : undefined,
    lineHeight: settings ? settings.lineHeight : undefined,
    letterSpacing: settings ? `${settings.letterSpacing}px` : undefined,
    textAlign: settings ? settings.alignment : undefined,
    textTransform: settings?.transform !== "none" ? settings?.transform : undefined,
  };

  const getFormatLabel = () => font.formatLabel || originalName.split(".").pop()?.toUpperCase() || "";
  const cleanTitle = originalName.replace(/\.[^.]+$/, "");
  const isCommercial = font.license === "Commercial";

  const copyCssSnippet = () => {
    const css = `@font-face {\n  font-family: '${cleanTitle}';\n  src: url('${font.url || `/fonts/${originalName}`}') format('${format}');\n  font-display: swap;\n}`;
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      showToast(`Copied CSS for ${cleanTitle}`);
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

  return (
    <div className="group w-full bg-card hover:bg-panel/40 transition-colors">
      <div className="flex min-w-[760px] items-center px-4 py-3.5 gap-4">
        {/* Font family & license column */}
        <div
          className="w-72 shrink-0 flex items-center justify-between gap-3 pr-4 border-r border-border cursor-pointer"
          onClick={() => setActiveSpecimenFont(font)}
        >
          <div className="truncate min-w-0">
            <h4
              className="text-sm font-bold text-text group-hover:text-primary transition-colors truncate"
              title={originalName}
            >
              {cleanTitle}
            </h4>
            <span className="text-[11px] font-mono text-muted font-medium">
              {font.extension?.toUpperCase() || getFormatLabel()}
            </span>
          </div>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 font-semibold ${
              isCommercial
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-panel text-text border-border"
            }`}
          >
            {isCommercial ? "Commercial" : "Free"}
          </span>
        </div>

        {/* Live preview column */}
        <div
          onClick={() => setActiveSpecimenFont(font)}
          className="flex-1 px-4 truncate min-w-0 text-text cursor-pointer leading-normal"
          style={previewStyle}
          title="Click to open specimen inspector"
        >
          {preview}
        </div>

        {/* Quick action buttons */}
        <div className="w-36 shrink-0 flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              toggleFavorite(font.id);
              showToast(isFav ? "Removed from favorites" : "Added to favorites");
            }}
            className={`w-7 h-7 rounded border transition-colors flex items-center justify-center cursor-pointer ${
              isFav
                ? "bg-danger/15 border-danger text-danger"
                : "border-border text-muted hover:text-danger hover:border-danger bg-panel/50"
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
            className={`w-7 h-7 rounded border transition-colors flex items-center justify-center cursor-pointer ${
              isCompared
                ? "bg-primary/15 border-primary text-primary"
                : "border-border text-muted hover:text-primary hover:border-primary bg-panel/50"
            }`}
            title={isCompared ? "In compare workbench" : "Add to compare"}
          >
            <ColumnsIcon size={14} weight={isCompared ? "fill" : "regular"} />
          </button>

          <button
            onClick={copyCssSnippet}
            className="w-7 h-7 rounded border border-border text-muted hover:text-primary hover:border-primary bg-panel/50 flex items-center justify-center transition-colors cursor-pointer"
            title="Copy @font-face CSS"
          >
            {copied ? <CheckIcon size={13} className="text-success" weight="bold" /> : <CopyIcon size={13} />}
          </button>

          <button
            onClick={handleDownload}
            className="w-7 h-7 rounded border border-border bg-panel text-text hover:bg-card hover:border-text flex items-center justify-center cursor-pointer transition-colors"
            title="Download font file"
          >
            <DownloadSimpleIcon size={14} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
