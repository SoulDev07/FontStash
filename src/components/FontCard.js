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

function FontCard({ font, text, settings, id }) {
  const { fontFamily, originalName, format } = font;
  const [copied, setCopied] = useState(false);

  const isFav = useFontStore((state) => state.favorites.includes(font.id));
  const isCompared = useFontStore((state) => state.compareIds.includes(font.id));
  const toggleFavorite = useFontStore((state) => state.toggleFavorite);
  const toggleCompare = useFontStore((state) => state.toggleCompare);
  const setActiveSpecimenFont = useFontStore((state) => state.setActiveSpecimenFont);
  const removeCustomFont = useFontStore((state) => state.removeCustomFont);
  const showToast = useFontStore((state) => state.showToast);

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

  const cleanTitle = font.family || originalName.replace(/\.[^.]+$/, '');

  return (
    <div
      id={id || `font-${font.id}`}
      className="card hover:border-text group flex h-[240px] flex-col overflow-hidden rounded transition-colors duration-150 select-none sm:h-[248px]"
    >
      <div className="border-border bg-panel/30 flex h-[54px] shrink-0 items-center justify-between gap-3 border-b px-4 py-2.5">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setActiveSpecimenFont(font)}>
          <div className="flex items-center gap-2 truncate">
            <h3
              className="text-text truncate text-sm font-bold underline-offset-2 group-hover:underline"
              title={cleanTitle}
            >
              {cleanTitle}
            </h3>
            <span
              className="bg-panel border-border text-muted shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold"
              suppressHydrationWarning
            >
              {getFormatLabel()}
            </span>
          </div>
          <p
            className="text-muted mt-0.5 truncate font-mono text-[11px]"
            title={`${font.style || 'Normal'} • ${font.weight || 400}`}
          >
            {font.style || 'Normal'} &bull; {font.weight || 400}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => {
              toggleFavorite(font.id);
              showToast(isFav ? 'Removed from favorites' : 'Added to favorites');
            }}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-colors active:scale-[0.97] ${
              isFav
                ? 'bg-text text-bg border-text'
                : 'border-border text-muted hover:text-text hover:border-text bg-card'
            }`}
            title={isFav ? 'Favorited' : 'Favorite'}
          >
            <HeartIcon size={13} weight={isFav ? 'fill' : 'regular'} />
          </button>

          <button
            onClick={() => {
              toggleCompare(font.id);
              showToast(isCompared ? 'Removed from compare' : 'Added to compare list');
            }}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-colors active:scale-[0.97] ${
              isCompared
                ? 'bg-text text-bg border-text'
                : 'border-border text-muted hover:text-text hover:border-text bg-card'
            }`}
            title={isCompared ? 'In compare workbench' : 'Compare'}
          >
            <ScalesIcon size={13} weight={isCompared ? 'fill' : 'regular'} />
          </button>

          <button
            onClick={copyCssSnippet}
            className="border-border text-muted hover:text-text hover:border-text bg-card flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-colors active:scale-[0.97]"
            title="Copy @font-face CSS"
          >
            {copied ? <CheckIcon size={12} weight="bold" /> : <CopyIcon size={12} />}
          </button>

          <button
            onClick={handleDownload}
            className="border-border text-muted hover:text-text hover:border-text bg-card flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-colors active:scale-[0.97]"
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
              className="border-border text-muted hover:text-danger hover:border-danger bg-card flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-colors active:scale-[0.97]"
              title="Delete font"
            >
              <TrashIcon size={12} />
            </button>
          )}
        </div>
      </div>

      <div
        onClick={() => setActiveSpecimenFont(font)}
        className="hover:bg-panel/15 flex min-h-0 flex-1 cursor-pointer items-center justify-center overflow-hidden p-4 transition-colors sm:p-5"
        title="Click to inspect typeface"
      >
        <div
          className="text-text max-h-full w-full overflow-hidden leading-normal"
          style={previewStyle}
        >
          {text || 'The quick brown fox jumps over the lazy dog.'}
        </div>
      </div>

      <div className="border-border/60 bg-panel/20 text-muted mt-auto flex h-[36px] shrink-0 items-center justify-between border-t px-4 py-2 font-mono text-[11px] select-none">
        <span>
          {font.numGlyphs
            ? `${font.numGlyphs} Glyphs`
            : font.unitsPerEm
              ? `UPM ${font.unitsPerEm}`
              : 'Typeface'}
        </span>
        <button
          onClick={() => setActiveSpecimenFont(font)}
          className="text-muted hover:text-text cursor-pointer text-[10px] hover:underline"
        >
          Inspect &rarr;
        </button>
      </div>
    </div>
  );
}

export default memo(FontCard);
