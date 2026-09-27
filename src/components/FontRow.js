import { useState, useMemo, memo } from "react";
import { useFontStore } from "@/lib/store/useFontStore";
import {
  DownloadSimpleIcon,
  CopyIcon,
  CheckIcon,
  HeartIcon,
  ScalesIcon,
  TrashIcon,
} from "@phosphor-icons/react";

function FontRow({ font, text, settings, id }) {
  const { fontFamily, originalName, format } = font;
  const [copied, setCopied] = useState(false);

  const isFav = useFontStore((state) => state.favorites.includes(font.id));
  const isCompared = useFontStore((state) => state.compareIds.includes(font.id));
  const toggleFavorite = useFontStore((state) => state.toggleFavorite);
  const toggleCompare = useFontStore((state) => state.toggleCompare);
  const setActiveSpecimenFont = useFontStore((state) => state.setActiveSpecimenFont);
  const removeCustomFont = useFontStore((state) => state.removeCustomFont);
  const showToast = useFontStore((state) => state.showToast);

  const preview = useMemo(
    () => text.trim() || "The quick brown fox jumps over the lazy dog",
    [text]
  );

  const previewStyle = useMemo(
    () => ({
      fontFamily: `'${fontFamily}', ui-sans-serif, system-ui`,
      fontSize: `${settings.fontSize}px`,
      lineHeight: settings.lineHeight,
      letterSpacing: `${settings.letterSpacing}px`,
      textAlign: settings.alignment,
      textTransform: settings.transform,
      wordBreak: "break-word",
      overflowWrap: "break-word",
    }),
    [fontFamily, settings.fontSize, settings.lineHeight, settings.letterSpacing, settings.alignment, settings.transform]
  );

  const getFormatLabel = () => font.formatLabel || font.extension.toUpperCase();
  const cleanTitle = font.family || originalName.replace(/\.[^.]+$/, "");

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

  return (
    <div id={id || `font-${font.id}`} className="group w-full bg-card hover:bg-panel/40 transition-colors duration-150">
      <div className="hidden md:flex min-w-210 items-center px-4 h-[64px] max-h-[64px] gap-5 overflow-hidden">
        <div
          className="w-72 shrink-0 flex items-center justify-between gap-3 pr-4 border-r border-border cursor-pointer h-full"
          onClick={() => setActiveSpecimenFont(font)}
        >
          <div className="truncate min-w-0">
            <h4
              className="text-sm font-bold text-text group-hover:text-primary transition-colors truncate"
              title={cleanTitle}
            >
              {cleanTitle}
            </h4>
            <p className="text-[11px] font-mono text-muted font-medium truncate mt-0.5" title={`${font.style || "Normal"} • ${font.weight || 400}`}>
              {font.style || "Normal"} &bull; {font.weight || 400}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="tag tag-accent text-[10px]" suppressHydrationWarning>
              {getFormatLabel()}
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveSpecimenFont(font)}
          className="flex-1 px-3 truncate min-w-0 h-full flex items-center text-text cursor-pointer leading-normal select-none overflow-hidden"
          style={previewStyle}
          title="Click to inspect typeface"
        >
          <span className="truncate w-full block">{preview}</span>
        </div>

        <div className="w-44 shrink-0 flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              toggleFavorite(font.id);
              showToast(isFav ? "Removed from favorites" : "Added to favorites");
            }}
            className={`w-7 h-7 rounded border transition-colors duration-150 flex items-center justify-center cursor-pointer active:scale-[0.97] ${
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
            className={`w-7 h-7 rounded border transition-colors duration-150 flex items-center justify-center cursor-pointer active:scale-[0.97] ${
              isCompared
                ? "bg-primary/15 border-primary text-primary"
                : "border-border text-muted hover:text-primary hover:border-primary bg-panel/50"
            }`}
            title={isCompared ? "In compare workbench" : "Add to compare"}
          >
            <ScalesIcon size={14} weight={isCompared ? "fill" : "regular"} />
          </button>

          <button
            onClick={copyCssSnippet}
            className="w-7 h-7 rounded border border-border text-muted hover:text-primary hover:border-primary bg-panel/50 flex items-center justify-center transition-colors duration-150 cursor-pointer active:scale-[0.97]"
            title="Copy @font-face CSS"
          >
            {copied ? <CheckIcon size={12} className="text-success" weight="bold" /> : <CopyIcon size={12} />}
          </button>

          <button
            onClick={handleDownload}
            className="w-7 h-7 rounded border border-border bg-panel text-text hover:bg-card hover:border-primary hover:text-primary flex items-center justify-center cursor-pointer transition-colors duration-150 active:scale-[0.97]"
            title="Download font file"
          >
            <DownloadSimpleIcon size={12} weight="bold" />
          </button>

          {font.isCustom && (
            <button
              onClick={() => {
                removeCustomFont(font.id);
                showToast(`Removed ${cleanTitle}`);
              }}
              className="w-7 h-7 rounded border border-border text-muted hover:text-danger hover:border-danger bg-panel/50 flex items-center justify-center transition-colors duration-150 cursor-pointer active:scale-[0.97]"
              title="Delete font"
            >
              <TrashIcon size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex md:hidden flex-col p-3.5 gap-2 border-b border-border h-[148px] justify-between overflow-hidden">
        <div className="flex items-start justify-between gap-2 shrink-0">
          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setActiveSpecimenFont(font)}>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-bold text-text truncate">{cleanTitle}</h4>
              <span className="tag tag-accent text-[9px]" suppressHydrationWarning>
                {getFormatLabel()}
              </span>
            </div>
            <p className="text-[11px] font-mono text-muted truncate mt-0.5">
              {font.style || "Normal"} &bull; {font.weight || 400}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                toggleFavorite(font.id);
                showToast(isFav ? "Removed from favorites" : "Added to favorites");
              }}
              className={`w-7 h-7 rounded border flex items-center justify-center cursor-pointer active:scale-[0.97] ${
                isFav
                  ? "bg-danger/15 border-danger text-danger"
                  : "border-border text-muted hover:text-danger bg-panel/50"
              }`}
            >
              <HeartIcon size={13} weight={isFav ? "fill" : "regular"} />
            </button>
            <button
              onClick={() => {
                toggleCompare(font.id);
                showToast(isCompared ? "Removed from compare" : "Added to compare list");
              }}
              className={`w-7 h-7 rounded border flex items-center justify-center cursor-pointer active:scale-[0.97] ${
                isCompared
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border text-muted hover:text-primary bg-panel/50"
              }`}
            >
              <ScalesIcon size={13} weight={isCompared ? "fill" : "regular"} />
            </button>
          </div>
        </div>

        <div
          onClick={() => setActiveSpecimenFont(font)}
          className="flex-1 min-h-0 py-1 text-text cursor-pointer leading-normal select-none overflow-hidden flex items-center"
          style={previewStyle}
        >
          <span className="truncate w-full block">{preview}</span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          <span className="text-[10px] font-mono text-muted">
            {font.numGlyphs ? `${font.numGlyphs} Glyphs` : font.formatLabel}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={copyCssSnippet}
              className="btn text-xs px-2 py-0.5 rounded border border-border bg-card inline-flex items-center gap-1 cursor-pointer font-mono hover:text-primary hover:border-primary"
            >
              {copied ? <CheckIcon size={11} className="text-success" /> : <CopyIcon size={11} />}
              <span>CSS</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn text-xs px-2 py-0.5 rounded border border-border bg-panel text-text hover:bg-card hover:text-primary hover:border-primary inline-flex items-center gap-1 cursor-pointer"
            >
              <DownloadSimpleIcon size={11} weight="bold" />
              <span>Download</span>
            </button>
            {font.isCustom && (
              <button
                onClick={() => {
                  removeCustomFont(font.id);
                  showToast(`Removed ${cleanTitle}`);
                }}
                className="btn text-xs px-2 py-0.5 rounded border border-border text-muted hover:text-danger hover:border-danger bg-panel/50 inline-flex items-center gap-1 cursor-pointer"
                title="Delete font"
              >
                <TrashIcon size={11} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(FontRow);
