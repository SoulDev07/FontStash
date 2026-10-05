import {
  DownloadSimpleIcon,
  CopyIcon,
  CheckIcon,
  HeartIcon,
  ScalesIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { useState, useMemo, memo } from 'react';

import { useFontStore } from '@/lib/store/useFontStore';

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
    () => text.trim() || 'The quick brown fox jumps over the lazy dog',
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
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
    }),
    [
      fontFamily,
      settings.fontSize,
      settings.lineHeight,
      settings.letterSpacing,
      settings.alignment,
      settings.transform,
    ]
  );

  const getFormatLabel = () => font.formatLabel || font.extension.toUpperCase();
  const cleanTitle = font.family || originalName.replace(/\.[^.]+$/, '');

  const copyCssSnippet = () => {
    const cleanName = font.family || originalName.replace(/\.[^.]+$/, '');
    const css = `@font-face {\n  font-family: '${cleanName}';\n  src: url('${font.url || `/fonts/${originalName}`}') format('${format}');\n  font-display: swap;\n}`;
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      showToast(`Copied CSS for ${cleanName}`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = font.url || `/fonts/${originalName}`;
    link.download = originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${originalName}`);
  };

  return (
    <div
      id={id || `font-${font.id}`}
      className="group bg-card hover:bg-panel/40 w-full transition-colors duration-150"
    >
      <div className="hidden h-[64px] max-h-[64px] min-w-210 items-center gap-5 overflow-hidden px-4 md:flex">
        <div
          className="border-border flex h-full w-72 shrink-0 cursor-pointer items-center justify-between gap-3 border-r pr-4"
          onClick={() => setActiveSpecimenFont(font)}
        >
          <div className="min-w-0 truncate">
            <h4
              className="text-text group-hover:text-primary truncate text-sm font-bold transition-colors"
              title={cleanTitle}
            >
              {cleanTitle}
            </h4>
            <p
              className="text-muted mt-0.5 truncate font-mono text-[11px] font-medium"
              title={`${font.style || 'Normal'} • ${font.weight || 400}`}
            >
              {font.style || 'Normal'} &bull; {font.weight || 400}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <span className="tag tag-accent text-[10px]" suppressHydrationWarning>
              {getFormatLabel()}
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveSpecimenFont(font)}
          className="text-text flex h-full min-w-0 flex-1 cursor-pointer items-center truncate overflow-hidden px-3 leading-normal select-none"
          style={previewStyle}
          title="Click to inspect typeface"
        >
          <span className="block w-full truncate">{preview}</span>
        </div>

        <div className="flex w-44 shrink-0 items-center justify-end gap-1.5">
          <button
            onClick={() => {
              toggleFavorite(font.id);
              showToast(isFav ? 'Removed from favorites' : 'Added to favorites');
            }}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-colors duration-150 active:scale-[0.97] ${
              isFav
                ? 'bg-danger/15 border-danger text-danger'
                : 'border-border text-muted hover:text-danger hover:border-danger bg-panel/50'
            }`}
            title={isFav ? 'Favorited' : 'Add to favorites'}
          >
            <HeartIcon size={14} weight={isFav ? 'fill' : 'regular'} />
          </button>

          <button
            onClick={() => {
              toggleCompare(font.id);
              showToast(isCompared ? 'Removed from compare' : 'Added to compare list');
            }}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-colors duration-150 active:scale-[0.97] ${
              isCompared
                ? 'bg-primary/15 border-primary text-primary'
                : 'border-border text-muted hover:text-primary hover:border-primary bg-panel/50'
            }`}
            title={isCompared ? 'In compare workbench' : 'Add to compare'}
          >
            <ScalesIcon size={14} weight={isCompared ? 'fill' : 'regular'} />
          </button>

          <button
            onClick={copyCssSnippet}
            className="border-border text-muted hover:text-primary hover:border-primary bg-panel/50 flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-colors duration-150 active:scale-[0.97]"
            title="Copy @font-face CSS"
          >
            {copied ? (
              <CheckIcon size={12} className="text-success" weight="bold" />
            ) : (
              <CopyIcon size={12} />
            )}
          </button>

          <button
            onClick={handleDownload}
            className="border-border bg-panel text-text hover:bg-card hover:border-primary hover:text-primary flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-colors duration-150 active:scale-[0.97]"
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
              className="border-border text-muted hover:text-danger hover:border-danger bg-panel/50 flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-colors duration-150 active:scale-[0.97]"
              title="Delete font"
            >
              <TrashIcon size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="border-border flex h-[148px] flex-col justify-between gap-2 overflow-hidden border-b p-3.5 md:hidden">
        <div className="flex shrink-0 items-start justify-between gap-2">
          <div
            className="min-w-0 flex-1 cursor-pointer"
            onClick={() => setActiveSpecimenFont(font)}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <h4 className="text-text truncate text-sm font-bold">{cleanTitle}</h4>
              <span className="tag tag-accent text-[9px]" suppressHydrationWarning>
                {getFormatLabel()}
              </span>
            </div>
            <p className="text-muted mt-0.5 truncate font-mono text-[11px]">
              {font.style || 'Normal'} &bull; {font.weight || 400}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => {
                toggleFavorite(font.id);
                showToast(isFav ? 'Removed from favorites' : 'Added to favorites');
              }}
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded border active:scale-[0.97] ${
                isFav
                  ? 'bg-danger/15 border-danger text-danger'
                  : 'border-border text-muted hover:text-danger bg-panel/50'
              }`}
            >
              <HeartIcon size={13} weight={isFav ? 'fill' : 'regular'} />
            </button>
            <button
              onClick={() => {
                toggleCompare(font.id);
                showToast(isCompared ? 'Removed from compare' : 'Added to compare list');
              }}
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded border active:scale-[0.97] ${
                isCompared
                  ? 'bg-primary/15 border-primary text-primary'
                  : 'border-border text-muted hover:text-primary bg-panel/50'
              }`}
            >
              <ScalesIcon size={13} weight={isCompared ? 'fill' : 'regular'} />
            </button>
          </div>
        </div>

        <div
          onClick={() => setActiveSpecimenFont(font)}
          className="text-text flex min-h-0 flex-1 cursor-pointer items-center overflow-hidden py-1 leading-normal select-none"
          style={previewStyle}
        >
          <span className="block w-full truncate">{preview}</span>
        </div>

        <div className="border-border/50 flex items-center justify-between gap-2 border-t pt-2">
          <span className="text-muted font-mono text-[10px]">
            {font.numGlyphs ? `${font.numGlyphs} Glyphs` : font.formatLabel}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={copyCssSnippet}
              className="btn border-border bg-card hover:text-primary hover:border-primary inline-flex cursor-pointer items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs"
            >
              {copied ? <CheckIcon size={11} className="text-success" /> : <CopyIcon size={11} />}
              <span>CSS</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn border-border bg-panel text-text hover:bg-card hover:text-primary hover:border-primary inline-flex cursor-pointer items-center gap-1 rounded border px-2 py-0.5 text-xs"
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
                className="btn border-border text-muted hover:text-danger hover:border-danger bg-panel/50 inline-flex cursor-pointer items-center gap-1 rounded border px-2 py-0.5 text-xs"
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
