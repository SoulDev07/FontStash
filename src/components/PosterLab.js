import { useState, useRef, useMemo } from "react";
import { useFontStore } from "@/lib/store/useFontStore";
import { useFontExport } from "@/hooks/useFontExport";
import {
  DownloadSimpleIcon,
  CopyIcon,
  CheckIcon,
  ArrowsClockwiseIcon,
  PaintBrushBroadIcon,
  FileImageIcon,
} from "@phosphor-icons/react";

const PRESETS = [
  { id: "stacked", name: "Stacked Display" },
  { id: "editorial", name: "Swiss Editorial" },
  { id: "cropped", name: "Oversized Glyph" },
  { id: "specimen", name: "Technical Specimen" },
  { id: "brutalist", name: "Industrial Monolith" },
];

import { POSTER_PALETTES } from "@/lib/theme/tokens";

const COLOR_THEMES = POSTER_PALETTES;

export default function PosterLab({ allFonts = [] }) {
  const showToast = useFontStore((state) => state.showToast);
  const posterRef = useRef(null);

  const [selectedFontId, setSelectedFontId] = useState(() => (allFonts.length > 0 ? allFonts[0].id : ""));
  const [activePreset, setActivePreset] = useState("stacked");
  const [colorIndex, setColorIndex] = useState(0);
  const [headline, setHeadline] = useState("TYPE IN SPACE");
  const [subline, setSubline] = useState("Proportion, density, and cadence in modern design");
  const [caption, setCaption] = useState("FontStash Laboratory • Specimen No. 04");
  const [uppercase, setUppercase] = useState(true);
  const [copiedCss, setCopiedCss] = useState(false);

  const selectedFont = allFonts.find((f) => f.id === selectedFontId) || allFonts[0] || {};
  const displayTitle = selectedFont.family || (selectedFont.originalName ? selectedFont.originalName.replace(/\.[^.]+$/, "") : "Typeface");
  const currentTheme = COLOR_THEMES[colorIndex];
  const fontFamilyName = selectedFont.fontFamily || "sans-serif";

  const exportOptions = useMemo(() => ({ backgroundColor: currentTheme.bg }), [currentTheme.bg]);
  const { exportPng, exporting } = useFontExport(posterRef, exportOptions);

  const handleExportPng = () => {
    exportPng(`${displayTitle}-poster`);
  };

  const handleCopyCss = () => {
    const css = `@font-face {\n  font-family: '${selectedFont.family || displayTitle}';\n  src: url('${selectedFont.url || `/fonts/${selectedFont.originalName}`}') format('${selectedFont.format || "truetype"}');\n}\n\n.poster-headline {\n  font-family: '${fontFamilyName}', sans-serif;\n  color: ${currentTheme.text};\n  background-color: ${currentTheme.bg};\n}`;
    navigator.clipboard.writeText(css).then(() => {
      setCopiedCss(true);
      showToast("Copied CSS styles to clipboard");
      setTimeout(() => setCopiedCss(false), 2000);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 min-h-[640px] animate-fade-in">
      {/* Left Column: Controls & Configuration */}
      <div className="w-full lg:w-88 shrink-0 flex flex-col gap-5 p-5 card rounded-xl border border-border bg-card shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <PaintBrushBroadIcon size={18} className="text-primary" weight="bold" />
          <h2 className="text-sm font-semibold text-text tracking-tight">Poster Lab</h2>
        </div>

        {/* Font Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-muted tracking-wider block font-medium">
            Active Typeface
          </label>
          <select
            value={selectedFontId}
            onChange={(e) => setSelectedFontId(e.target.value)}
            className="w-full text-xs font-sans bg-panel border border-border text-text rounded-md px-3 py-2 outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {allFonts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.family || f.originalName} ({f.formatLabel || (f.extension ? f.extension.toUpperCase() : "")})
              </option>
            ))}
          </select>
        </div>

        {/* Layout Preset */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-muted tracking-wider block font-medium">
            Layout Preset
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setActivePreset(preset.id)}
                className={`px-2.5 py-1.5 text-xs text-left rounded border transition-all duration-120 cursor-pointer ${
                  activePreset === preset.id
                    ? "bg-primary text-white border-primary font-medium shadow-xs"
                    : "bg-panel/60 text-muted border-border hover:text-text hover:bg-panel"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette (Zero Gradients) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-muted tracking-wider block font-medium">
            Solid Color Palette
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {COLOR_THEMES.map((theme, idx) => (
              <button
                key={theme.name}
                onClick={() => setColorIndex(idx)}
                className={`p-2 rounded border flex items-center justify-between text-xs transition-all cursor-pointer ${
                  colorIndex === idx
                    ? "border-primary bg-panel shadow-xs"
                    : "border-border/70 hover:border-border bg-panel/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: theme.bg }}
                  />
                  <div
                    className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <span className="text-text font-medium text-[11px]">{theme.name}</span>
                </div>
                <span className="text-[10px] font-mono text-muted">
                  {theme.bg.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Inputs */}
        <div className="space-y-2 pt-1 border-t border-border">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase text-muted tracking-wider font-medium">
                Headline
              </label>
              <button
                onClick={() => setUppercase(!uppercase)}
                className="text-[10px] font-mono text-muted hover:text-text cursor-pointer underline"
              >
                {uppercase ? "ALL CAPS" : "As Typed"}
              </button>
            </div>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full text-xs bg-panel border border-border text-text rounded px-2.5 py-1.5 outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-muted tracking-wider block font-medium">
              Subline
            </label>
            <input
              type="text"
              value={subline}
              onChange={(e) => setSubline(e.target.value)}
              className="w-full text-xs bg-panel border border-border text-text rounded px-2.5 py-1.5 outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-muted tracking-wider block font-medium">
              Footer Label
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full text-xs bg-panel border border-border text-text rounded px-2.5 py-1.5 outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-border flex flex-col gap-2">
          <button
            onClick={handleExportPng}
            disabled={exporting}
            className="w-full py-2 px-3 rounded-md bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 transition-all disabled:opacity-50"
          >
            {exporting ? (
              <ArrowsClockwiseIcon size={14} className="animate-spin" />
            ) : (
              <DownloadSimpleIcon size={14} weight="bold" />
            )}
            <span>{exporting ? "Rendering PNG..." : "Export 2x PNG"}</span>
          </button>

          <button
            onClick={handleCopyCss}
            className="w-full py-1.5 px-3 rounded-md border border-border hover:border-text/40 bg-panel text-text text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
          >
            {copiedCss ? <CheckIcon size={13} className="text-success" /> : <CopyIcon size={13} />}
            <span>Copy CSS Properties</span>
          </button>
        </div>
      </div>

      {/* Right Column: Poster Preview Frame */}
      <div className="flex-1 w-full flex flex-col items-center justify-center p-3 sm:p-6 bg-panel/30 rounded-xl border border-border/70 overflow-hidden">
        <div className="w-full max-w-[540px] shadow-2xl rounded-lg overflow-hidden border border-black/10">
          <div
            ref={posterRef}
            style={{
              backgroundColor: currentTheme.bg,
              color: currentTheme.text,
            }}
            className="relative w-full aspect-[3/4] p-6 sm:p-10 flex flex-col justify-between select-none overflow-hidden"
          >
            {/* PRESET 1: STACKED DISPLAY */}
            {activePreset === "stacked" && (
              <>
                <div className="flex items-center justify-between border-b pb-3 font-mono text-[10px] sm:text-xs" style={{ borderColor: currentTheme.border, color: currentTheme.muted }}>
                  <span className="font-bold tracking-wider">{displayTitle.toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.accent }} />
                    <span>SPECIMEN // 2026</span>
                  </div>
                </div>

                <div className="my-auto py-4">
                  <div
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      lineHeight: 0.88,
                      letterSpacing: "-0.04em",
                    }}
                    className={`text-4xl sm:text-6xl md:text-7xl font-bold ${uppercase ? "uppercase" : ""}`}
                  >
                    {headline}
                  </div>
                  <div
                    className="mt-4 text-xs sm:text-sm max-w-xs font-mono leading-relaxed"
                    style={{ color: currentTheme.muted }}
                  >
                    {subline}
                  </div>
                </div>

                <div className="pt-4 border-t flex items-end justify-between font-mono text-[10px]" style={{ borderColor: currentTheme.border, color: currentTheme.muted }}>
                  <div>
                    <div className="font-bold" style={{ color: currentTheme.accent }}>WEIGHT {selectedFont.weight || 400}</div>
                    <div>FORMAT {selectedFont.formatLabel || (selectedFont.extension ? selectedFont.extension.toUpperCase() : "")}</div>
                  </div>
                  <div className="text-right">
                    <div className="tracking-widest">{caption}</div>
                  </div>
                </div>
              </>
            )}

            {/* PRESET 2: SWISS EDITORIAL */}
            {activePreset === "editorial" && (
              <>
                <div className="flex items-baseline justify-between font-mono text-[11px]" style={{ color: currentTheme.accent }}>
                  <span className="font-bold">No. 01 / TYPOGRAPHY</span>
                  <span>{new Date().getFullYear()} ARCHIVE</span>
                </div>

                <div className="my-auto space-y-4">
                  <div
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      lineHeight: 1.05,
                      letterSpacing: "-0.02em",
                    }}
                    className={`text-3xl sm:text-5xl font-semibold ${uppercase ? "uppercase" : ""}`}
                  >
                    {headline}
                  </div>

                  <div className="w-12 h-1" style={{ backgroundColor: currentTheme.accent }} />

                  <p
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      color: currentTheme.text,
                    }}
                    className="text-sm sm:text-base leading-relaxed max-w-sm font-normal opacity-90"
                  >
                    {subline}
                  </p>
                </div>

                <div className="border-t pt-3 flex flex-col sm:flex-row justify-between gap-2 font-mono text-[10px]" style={{ borderColor: currentTheme.border, color: currentTheme.muted }}>
                  <span>{displayTitle}</span>
                  <span>{caption}</span>
                </div>
              </>
            )}

            {/* PRESET 3: OVERSIZED GLYPH */}
            {activePreset === "cropped" && (
              <>
                {/* Background Giant Glyph */}
                <div
                  style={{
                    fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                    color: currentTheme.accent,
                    opacity: 0.14,
                    lineHeight: 0.7,
                  }}
                  className="absolute -right-8 -bottom-8 text-[280px] sm:text-[360px] font-black pointer-events-none select-none"
                >
                  {headline.charAt(0) || "A"}
                </div>

                <div className="relative z-10 flex justify-between font-mono text-[10px] tracking-widest uppercase" style={{ color: currentTheme.muted }}>
                  <span>TYPE SYSTEM</span>
                  <span style={{ color: currentTheme.accent }}>FIG. 01</span>
                </div>

                <div className="relative z-10 my-auto">
                  <div
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      lineHeight: 0.95,
                      letterSpacing: "-0.03em",
                    }}
                    className={`text-4xl sm:text-6xl font-black ${uppercase ? "uppercase" : ""}`}
                  >
                    {headline}
                  </div>
                  <div className="mt-3 text-xs sm:text-sm font-mono max-w-xs" style={{ color: currentTheme.muted }}>
                    {subline}
                  </div>
                </div>

                <div className="relative z-10 border-t pt-3 font-mono text-[10px] flex justify-between" style={{ borderColor: currentTheme.border, color: currentTheme.muted }}>
                  <span>{displayTitle}</span>
                  <span>{caption}</span>
                </div>
              </>
            )}

            {/* PRESET 4: TECHNICAL SPECIMEN */}
            {activePreset === "specimen" && (
              <>
                <div className="border-b pb-2 flex justify-between items-center font-mono text-[10px]" style={{ borderColor: currentTheme.border }}>
                  <span className="px-2 py-0.5 rounded font-bold text-white" style={{ backgroundColor: currentTheme.accent }}>
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
                    className={`text-3xl sm:text-5xl font-bold ${uppercase ? "uppercase" : ""}`}
                  >
                    {headline}
                  </div>

                  <div
                    style={{ fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui` }}
                    className="text-xs sm:text-sm opacity-80"
                  >
                    {subline}
                  </div>

                  <div
                    style={{ fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui` }}
                    className="p-3 rounded border font-mono text-xs tracking-wider space-y-1"
                    style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.panel }}
                  >
                    <div className="text-[11px] font-bold" style={{ color: currentTheme.accent }}>
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    </div>
                    <div className="text-[11px] opacity-75">
                      abcdefghijklmnopqrstuvwxyz
                    </div>
                    <div className="text-[10px] opacity-60">
                      0123456789 &bull; !@#$%^&*()-=+
                    </div>
                  </div>
                </div>

                <div className="border-t pt-2 font-mono text-[9px] flex justify-between" style={{ borderColor: currentTheme.border, color: currentTheme.muted }}>
                  <span>GLYPHS: {selectedFont.numGlyphs || "STANDARD"}</span>
                  <span>{caption}</span>
                </div>
              </>
            )}

            {/* PRESET 5: INDUSTRIAL MONOLITH */}
            {activePreset === "brutalist" && (
              <div className="w-full h-full border-2 p-4 sm:p-6 flex flex-col justify-between" style={{ borderColor: currentTheme.text }}>
                <div className="flex justify-between font-mono text-[10px] font-black tracking-widest uppercase">
                  <span>[FS-2026]</span>
                  <span style={{ color: currentTheme.accent }}>{selectedFont.formatLabel || "FONT"}</span>
                </div>

                <div className="my-auto text-center py-6">
                  <div
                    style={{
                      fontFamily: `'${fontFamilyName}', ui-sans-serif, system-ui`,
                      lineHeight: 0.9,
                      letterSpacing: "-0.04em",
                    }}
                    className={`text-4xl sm:text-6xl font-black ${uppercase ? "uppercase" : ""}`}
                  >
                    {headline}
                  </div>
                  <div
                    className="mt-4 text-xs font-mono font-bold tracking-wider inline-block px-3 py-1 border"
                    style={{ borderColor: currentTheme.accent, color: currentTheme.accent }}
                  >
                    {subline}
                  </div>
                </div>

                <div className="border-t-2 pt-2 flex justify-between font-mono text-[10px] font-bold" style={{ borderColor: currentTheme.text }}>
                  <span>{displayTitle.toUpperCase()}</span>
                  <span>{caption.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] font-mono text-muted mt-3 flex items-center gap-1.5">
          <FileImageIcon size={13} />
          High-resolution 2x retina image export
        </p>
      </div>
    </div>
  );
}
