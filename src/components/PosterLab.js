import {
  DownloadSimpleIcon,
  CopyIcon,
  CheckIcon,
  ArrowsClockwiseIcon,
  PaintBrushBroadIcon,
} from '@phosphor-icons/react';
import { useState, useRef, useMemo } from 'react';

import { useFontExport } from '@/hooks/useFontExport';
import { useFontStore } from '@/lib/store/useFontStore';

const PRESETS = [
  { id: 'stacked', name: 'Stacked Display' },
  { id: 'editorial', name: 'Swiss Editorial' },
  { id: 'cropped', name: 'Oversized Glyph' },
  { id: 'specimen', name: 'Technical Specimen' },
  { id: 'brutalist', name: 'Industrial Monolith' },
];

import { POSTER_PALETTES } from '@/lib/theme/tokens';

const COLOR_THEMES = POSTER_PALETTES;

export default function PosterLab({ allFonts = [] }) {
  const showToast = useFontStore((state) => state.showToast);
  const posterRef = useRef(null);

  const [selectedFontId, setSelectedFontId] = useState(() =>
    allFonts.length > 0 ? allFonts[0].id : ''
  );
  const [activePreset, setActivePreset] = useState('stacked');
  const [colorIndex, setColorIndex] = useState(0);
  const [headline, setHeadline] = useState('TYPE IN SPACE');
  const [subline, setSubline] = useState('Proportion, density, and cadence in modern design');
  const [caption, setCaption] = useState('FontStash Laboratory • Specimen No. 04');
  const [uppercase, setUppercase] = useState(true);
  const [copiedCss, setCopiedCss] = useState(false);

  const selectedFont = allFonts.find((f) => f.id === selectedFontId) || allFonts[0] || {};
  const displayTitle =
    selectedFont.family ||
    (selectedFont.originalName ? selectedFont.originalName.replace(/\.[^.]+$/, '') : 'Typeface');
  const currentTheme = COLOR_THEMES[colorIndex];
  const fontFamilyName = selectedFont.fontFamily || 'sans-serif';

  const exportOptions = useMemo(() => ({ backgroundColor: currentTheme.bg }), [currentTheme.bg]);
  const { exportPng, exporting } = useFontExport(posterRef, exportOptions);

  const handleExportPng = () => {
    exportPng(`${displayTitle}-poster`);
  };

  const handleCopyCss = () => {
    const css = `@font-face {\n  font-family: '${selectedFont.family || displayTitle}';\n  src: url('${selectedFont.url || `/fonts/${selectedFont.originalName}`}') format('${selectedFont.format || 'truetype'}');\n}\n\n.poster-headline {\n  font-family: '${fontFamilyName}', sans-serif;\n  color: ${currentTheme.text};\n  background-color: ${currentTheme.bg};\n}`;
    navigator.clipboard.writeText(css).then(() => {
      setCopiedCss(true);
      showToast('Copied CSS styles to clipboard');
      setTimeout(() => setCopiedCss(false), 2000);
    });
  };

  return (
    <div className="animate-fade-in flex min-h-[640px] flex-col items-start gap-6 lg:flex-row lg:gap-8">
      {/* Left Column: Controls & Configuration */}
      <div className="card border-border bg-card flex w-full shrink-0 flex-col gap-5 rounded-xl border p-5 shadow-xs lg:w-88">
        <div className="border-border flex items-center gap-2 border-b pb-3">
          <PaintBrushBroadIcon size={18} className="text-primary" weight="bold" />
          <h2 className="text-text text-sm font-semibold tracking-tight">Poster Lab</h2>
        </div>

        {/* Font Selector */}
        <div className="space-y-1.5">
          <label className="text-muted block font-mono text-[11px] font-medium tracking-wider uppercase">
            Active Typeface
          </label>
          <select
            value={selectedFontId}
            onChange={(e) => setSelectedFontId(e.target.value)}
            className="bg-panel border-border text-text focus:border-primary w-full cursor-pointer rounded-md border px-3 py-2 font-sans text-xs transition-colors outline-none"
          >
            {allFonts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.family || f.originalName} (
                {f.formatLabel || (f.extension ? f.extension.toUpperCase() : '')})
              </option>
            ))}
          </select>
        </div>

        {/* Layout Preset */}
        <div className="space-y-1.5">
          <label className="text-muted block font-mono text-[11px] font-medium tracking-wider uppercase">
            Layout Preset
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setActivePreset(preset.id)}
                className={`cursor-pointer rounded border px-2.5 py-1.5 text-left text-xs transition-all duration-120 ${
                  activePreset === preset.id
                    ? 'bg-primary text-bg border-primary font-medium shadow-xs'
                    : 'bg-panel/60 text-muted border-border hover:text-text hover:bg-panel'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette (Zero Gradients) */}
        <div className="space-y-1.5">
          <label className="text-muted block font-mono text-[11px] font-medium tracking-wider uppercase">
            Solid Color Palette
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {COLOR_THEMES.map((theme, idx) => (
              <button
                key={theme.name}
                onClick={() => setColorIndex(idx)}
                className={`flex cursor-pointer items-center justify-between rounded border p-2 text-xs transition-all ${
                  colorIndex === idx
                    ? 'border-primary bg-panel shadow-xs'
                    : 'border-border/70 hover:border-border bg-panel/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 shrink-0 rounded-full border border-black/15"
                    style={{ backgroundColor: theme.bg }}
                  />
                  <div
                    className="h-3 w-3 shrink-0 rounded-full border border-black/15"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <span className="text-text text-[11px] font-medium">{theme.name}</span>
                </div>
                <span className="text-muted font-mono text-[10px]">{theme.bg.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Inputs */}
        <div className="border-border space-y-2 border-t pt-1">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-muted font-mono text-[11px] font-medium tracking-wider uppercase">
                Headline
              </label>
              <button
                onClick={() => setUppercase(!uppercase)}
                className="text-muted hover:text-text cursor-pointer font-mono text-[10px] underline"
              >
                {uppercase ? 'ALL CAPS' : 'As Typed'}
              </button>
            </div>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="bg-panel border-border text-text focus:border-primary w-full rounded border px-2.5 py-1.5 text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted block font-mono text-[11px] font-medium tracking-wider uppercase">
              Subline
            </label>
            <input
              type="text"
              value={subline}
              onChange={(e) => setSubline(e.target.value)}
              className="bg-panel border-border text-text focus:border-primary w-full rounded border px-2.5 py-1.5 text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted block font-mono text-[11px] font-medium tracking-wider uppercase">
              Footer Label
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="bg-panel border-border text-text focus:border-primary w-full rounded border px-2.5 py-1.5 text-xs outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-border flex flex-col gap-2 border-t pt-2">
          <button
            onClick={handleExportPng}
            disabled={exporting}
            className="bg-primary hover:bg-primary/90 text-bg flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold shadow-xs transition-all active:scale-98 disabled:opacity-50"
          >
            {exporting ? (
              <ArrowsClockwiseIcon size={14} className="animate-spin" />
            ) : (
              <DownloadSimpleIcon size={14} weight="bold" />
            )}
            <span>{exporting ? 'Rendering PNG...' : 'Export 2x PNG'}</span>
          </button>

          <button
            onClick={handleCopyCss}
            className="border-border hover:border-text/40 bg-panel text-text flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all active:scale-98"
          >
            {copiedCss ? <CheckIcon size={13} className="text-success" /> : <CopyIcon size={13} />}
            <span>Copy CSS Properties</span>
          </button>
        </div>
      </div>

      {/* Right Column: Poster Preview Frame */}
      <div className="bg-panel/30 border-border/70 flex w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border p-3 sm:p-6">
        <div className="w-full max-w-[540px] overflow-hidden rounded-lg border border-black/10 shadow-2xl">
          <div
            ref={posterRef}
            style={{
              backgroundColor: currentTheme.bg,
              color: currentTheme.text,
            }}
            className="relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden p-6 select-none sm:p-10"
          >
            {/* PRESET 1: STACKED DISPLAY */}
            {activePreset === 'stacked' && (
              <>
                <div
                  className="flex items-center justify-between border-b pb-3 font-mono text-[10px] sm:text-xs"
                  style={{ borderColor: currentTheme.border, color: currentTheme.muted }}
                >
                  <span className="font-bold tracking-wider">{displayTitle.toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: currentTheme.accent }}
                    />
                    <span>SPECIMEN // 2026</span>
                  </div>
                </div>

                <div className="my-auto py-4">
                  <div
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      lineHeight: 0.88,
                      letterSpacing: '-0.04em',
                    }}
                    className={`text-4xl font-bold sm:text-6xl md:text-7xl ${uppercase ? 'uppercase' : ''}`}
                  >
                    {headline}
                  </div>
                  <div
                    className="mt-4 max-w-xs font-mono text-xs leading-relaxed sm:text-sm"
                    style={{ color: currentTheme.muted }}
                  >
                    {subline}
                  </div>
                </div>

                <div
                  className="flex items-end justify-between border-t pt-4 font-mono text-[10px]"
                  style={{ borderColor: currentTheme.border, color: currentTheme.muted }}
                >
                  <div>
                    <div className="font-bold" style={{ color: currentTheme.accent }}>
                      WEIGHT {selectedFont.weight || 400}
                    </div>
                    <div>
                      FORMAT{' '}
                      {selectedFont.formatLabel ||
                        (selectedFont.extension ? selectedFont.extension.toUpperCase() : '')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="tracking-widest">{caption}</div>
                  </div>
                </div>
              </>
            )}

            {/* PRESET 2: SWISS EDITORIAL */}
            {activePreset === 'editorial' && (
              <>
                <div
                  className="flex items-baseline justify-between font-mono text-[11px]"
                  style={{ color: currentTheme.accent }}
                >
                  <span className="font-bold">No. 01 / TYPOGRAPHY</span>
                  <span>{new Date().getFullYear()} ARCHIVE</span>
                </div>

                <div className="my-auto space-y-4">
                  <div
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      lineHeight: 1.05,
                      letterSpacing: '-0.02em',
                    }}
                    className={`text-3xl font-semibold sm:text-5xl ${uppercase ? 'uppercase' : ''}`}
                  >
                    {headline}
                  </div>

                  <div className="h-1 w-12" style={{ backgroundColor: currentTheme.accent }} />

                  <p
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      color: currentTheme.text,
                    }}
                    className="max-w-sm text-sm leading-relaxed font-normal opacity-90 sm:text-base"
                  >
                    {subline}
                  </p>
                </div>

                <div
                  className="flex flex-col justify-between gap-2 border-t pt-3 font-mono text-[10px] sm:flex-row"
                  style={{ borderColor: currentTheme.border, color: currentTheme.muted }}
                >
                  <span>{displayTitle}</span>
                  <span>{caption}</span>
                </div>
              </>
            )}

            {/* PRESET 3: OVERSIZED GLYPH */}
            {activePreset === 'cropped' && (
              <>
                {/* Background Giant Glyph */}
                <div
                  style={{
                    fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                    color: currentTheme.accent,
                    opacity: 0.14,
                    lineHeight: 0.7,
                  }}
                  className="pointer-events-none absolute -right-8 -bottom-8 text-[280px] font-black select-none sm:text-[360px]"
                >
                  {headline.charAt(0) || 'A'}
                </div>

                <div
                  className="relative z-10 flex justify-between font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: currentTheme.muted }}
                >
                  <span>TYPE SYSTEM</span>
                  <span style={{ color: currentTheme.accent }}>FIG. 01</span>
                </div>

                <div className="relative z-10 my-auto">
                  <div
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      lineHeight: 0.95,
                      letterSpacing: '-0.03em',
                    }}
                    className={`text-4xl font-black sm:text-6xl ${uppercase ? 'uppercase' : ''}`}
                  >
                    {headline}
                  </div>
                  <div
                    className="mt-3 max-w-xs font-mono text-xs sm:text-sm"
                    style={{ color: currentTheme.muted }}
                  >
                    {subline}
                  </div>
                </div>

                <div
                  className="relative z-10 flex justify-between border-t pt-3 font-mono text-[10px]"
                  style={{ borderColor: currentTheme.border, color: currentTheme.muted }}
                >
                  <span>{displayTitle}</span>
                  <span>{caption}</span>
                </div>
              </>
            )}

            {/* PRESET 4: TECHNICAL SPECIMEN */}
            {activePreset === 'specimen' && (
              <>
                <div
                  className="flex items-center justify-between border-b pb-2 font-mono text-[10px]"
                  style={{ borderColor: currentTheme.border }}
                >
                  <span
                    className="rounded px-2 py-0.5 font-bold text-white"
                    style={{ backgroundColor: currentTheme.accent }}
                  >
                    TYPE SPECIMEN
                  </span>
                  <span style={{ color: currentTheme.muted }}>{displayTitle}</span>
                </div>

                <div className="my-auto space-y-4">
                  <div
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      lineHeight: 1.0,
                    }}
                    className={`text-3xl font-bold sm:text-5xl ${uppercase ? 'uppercase' : ''}`}
                  >
                    {headline}
                  </div>

                  <div
                    style={{ fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui` }}
                    className="text-xs opacity-80 sm:text-sm"
                  >
                    {subline}
                  </div>

                  <div
                    style={{ fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui` }}
                    className="space-y-1 rounded border p-3 font-mono text-xs tracking-wider"
                    style={{
                      borderColor: currentTheme.border,
                      backgroundColor: currentTheme.panel,
                    }}
                  >
                    <div className="text-[11px] font-bold" style={{ color: currentTheme.accent }}>
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    </div>
                    <div className="text-[11px] opacity-75">abcdefghijklmnopqrstuvwxyz</div>
                    <div className="text-[10px] opacity-60">0123456789 &bull; !@#$%^&*()-=+</div>
                  </div>
                </div>

                <div
                  className="flex justify-between border-t pt-2 font-mono text-[9px]"
                  style={{ borderColor: currentTheme.border, color: currentTheme.muted }}
                >
                  <span>GLYPHS: {selectedFont.numGlyphs || 'STANDARD'}</span>
                  <span>{caption}</span>
                </div>
              </>
            )}

            {/* PRESET 5: INDUSTRIAL MONOLITH */}
            {activePreset === 'brutalist' && (
              <div
                className="flex h-full w-full flex-col justify-between border-2 p-4 sm:p-6"
                style={{ borderColor: currentTheme.text }}
              >
                <div className="flex justify-between font-mono text-[10px] font-black tracking-widest uppercase">
                  <span>[FS-2026]</span>
                  <span style={{ color: currentTheme.accent }}>
                    {selectedFont.formatLabel || 'FONT'}
                  </span>
                </div>

                <div className="my-auto py-6 text-center">
                  <div
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      lineHeight: 0.9,
                      letterSpacing: '-0.04em',
                    }}
                    className={`text-4xl font-black sm:text-6xl ${uppercase ? 'uppercase' : ''}`}
                  >
                    {headline}
                  </div>
                  <div
                    className="mt-4 inline-block border px-3 py-1 font-mono text-xs font-bold tracking-wider"
                    style={{ borderColor: currentTheme.accent, color: currentTheme.accent }}
                  >
                    {subline}
                  </div>
                </div>

                <div
                  className="flex justify-between border-t-2 pt-2 font-mono text-[10px] font-bold"
                  style={{ borderColor: currentTheme.text }}
                >
                  <span>{displayTitle.toUpperCase()}</span>
                  <span>{caption.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
