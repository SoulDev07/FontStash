import { useState } from "react";
import {
  TextTIcon,
  SlidersIcon,
  FunnelIcon,
  ArrowCounterClockwiseIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from "@phosphor-icons/react";

const DEFAULT_SETTINGS = {
  sampleText: "The quick brown fox jumps over the lazy dog",
  fontSize: 24,
  lineHeight: 1.5,
  letterSpacing: 0,
  alignment: "left",
  transform: "none",
};

const presets = [
  ["Pangram", "The quick brown fox jumps over the lazy dog."],
  ["Headline", "Grumpy wizards make toxic brew for the evil queen."],
  ["Paragraph", "Typography is the craft of endowing human language with a durable visual form."],
  ["Numerals", "0123456789"],
  ["Punctuation", "!@#$%^&*()_+{}|:\"<>?[];',."],
];

export default function PreviewControls({
  settings,
  updateSetting,
  fontsCount = 0,
  extensions = [],
  licenses = [],
  sort = "index",
  setSort,
  toggleFilter,
}) {
  const [showControls, setShowControls] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const reset = () => {
    Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => updateSetting(key, value));
  };

  const isDefault =
    settings.fontSize === DEFAULT_SETTINGS.fontSize &&
    settings.lineHeight === DEFAULT_SETTINGS.lineHeight &&
    settings.letterSpacing === DEFAULT_SETTINGS.letterSpacing &&
    settings.alignment === DEFAULT_SETTINGS.alignment &&
    settings.transform === DEFAULT_SETTINGS.transform;

  return (
    <section className="rounded border border-border bg-card p-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Sample text input */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px] h-9 px-3 rounded border border-border bg-panel/60 focus-within:border-primary">
          <TextTIcon size={15} className="text-muted shrink-0" />
          <input
            value={settings.sampleText}
            onChange={(e) => updateSetting("sampleText", e.target.value)}
            placeholder="Type custom preview text..."
            className="w-full text-xs font-medium bg-transparent outline-none text-text placeholder:text-muted"
            aria-label="Preview text"
          />
        </div>

        {/* Preset chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {presets.map(([label, value]) => (
            <button
              key={label}
              onClick={() => updateSetting("sampleText", value)}
              className={`shrink-0 text-xs font-mono h-8 px-2.5 rounded border transition-colors cursor-pointer ${
                settings.sampleText === value
                  ? "bg-primary text-white border-primary font-bold"
                  : "bg-panel border-border text-muted hover:text-text hover:border-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Action triggers */}
        <div className="flex items-center justify-between lg:justify-end gap-2 text-xs">
          <span className="h-9 font-mono text-xs font-bold px-2.5 rounded bg-panel border border-border text-muted flex items-center">
            {fontsCount} fonts
          </span>

          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`h-9 text-xs px-3 rounded border inline-flex items-center gap-1.5 font-medium cursor-pointer transition-colors ${
                showFilter || extensions.length > 0 || licenses.length > 0 || sort !== "index"
                  ? "bg-primary text-white border-primary"
                  : "bg-panel border-border text-text hover:bg-panel/80 hover:border-text"
              }`}
            >
              <FunnelIcon size={14} />
              <span>Filter</span>
            </button>

            {showFilter && (
              <div className="absolute right-0 z-30 mt-1 w-64 rounded border border-border bg-card p-3.5 animate-pop">
                <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-muted">Filters & Sorting</span>
                  {(extensions.length > 0 || licenses.length > 0) && (
                    <button
                      onClick={() => {
                        extensions.forEach((ext) => toggleFilter(ext, "extension"));
                        licenses.forEach((lic) => toggleFilter(lic, "license"));
                      }}
                      className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <p className="mb-1.5 text-[10px] font-mono uppercase text-muted font-bold">Formats</p>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {["ttf", "otf", "woff", "woff2"].map((ext) => (
                    <label key={ext} className="flex items-center gap-1.5 text-xs font-mono text-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={extensions.includes(ext)}
                        onChange={() => toggleFilter(ext, "extension")}
                        className="rounded accent-primary"
                      />
                      {ext.toUpperCase()}
                    </label>
                  ))}
                </div>

                <p className="mb-1.5 text-[10px] font-mono uppercase text-muted font-bold">License</p>
                <div className="mb-3 flex gap-3">
                  {["Commercial", "Personal"].map((lic) => (
                    <label key={lic} className="flex items-center gap-1.5 text-xs text-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={licenses.includes(lic)}
                        onChange={() => toggleFilter(lic, "license")}
                        className="rounded accent-primary"
                      />
                      {lic}
                    </label>
                  ))}
                </div>

                <p className="mb-1.5 text-[10px] font-mono uppercase text-muted font-bold">Sort</p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full rounded border border-border bg-panel px-2.5 py-1.5 text-xs text-text outline-none focus:border-primary"
                >
                  <option value="index">Index Order</option>
                  <option value="az">Alphabetical (A-Z)</option>
                  <option value="za">Alphabetical (Z-A)</option>
                  <option value="type">File Type</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowControls(!showControls)}
            className={`h-9 text-xs px-3 rounded border inline-flex items-center gap-1.5 font-medium cursor-pointer transition-colors ${
              showControls
                ? "bg-primary text-white border-primary"
                : "bg-panel border-border text-text hover:bg-panel/80 hover:border-text"
            }`}
          >
            <SlidersIcon size={14} />
            <span>Inspector</span>
          </button>
        </div>
      </div>

      {showControls && (
        <div className="mt-3 pt-3 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-down">
          <div className="flex flex-wrap items-center gap-5">
            {/* Size */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted font-semibold">Size:</span>
              <input
                type="range"
                min="8"
                max="120"
                value={settings.fontSize}
                onChange={(e) => updateSetting("fontSize", Number(e.target.value))}
                className="range-slider w-24"
              />
              <span className="text-xs font-mono font-bold text-text w-9 text-right">
                {settings.fontSize}px
              </span>
            </div>

            {/* Line height */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted font-semibold">Height:</span>
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => updateSetting("lineHeight", Number(e.target.value))}
                className="range-slider w-20"
              />
              <span className="text-xs font-mono font-bold text-text w-8 text-right">
                {settings.lineHeight}
              </span>
            </div>

            {/* Letter spacing */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted font-semibold">Spacing:</span>
              <input
                type="range"
                min="-10"
                max="40"
                value={settings.letterSpacing}
                onChange={(e) => updateSetting("letterSpacing", Number(e.target.value))}
                className="range-slider w-20"
              />
              <span className="text-xs font-mono font-bold text-text w-8 text-right">
                {settings.letterSpacing}px
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Alignment Buttons */}
            <div className="flex items-center p-0.5 rounded border border-border bg-panel">
              {[
                { align: "left", icon: TextAlignLeftIcon },
                { align: "center", icon: TextAlignCenterIcon },
                { align: "right", icon: TextAlignRightIcon },
                { align: "justify", icon: TextAlignJustifyIcon },
              ].map(({ align, icon: Icon }) => (
                <button
                  key={align}
                  onClick={() => updateSetting("alignment", align)}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    settings.alignment === align
                      ? "bg-primary text-white"
                      : "text-muted hover:text-text"
                  }`}
                  title={`Align ${align}`}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>

            {/* Case Selection */}
            <select
              value={settings.transform}
              onChange={(e) => updateSetting("transform", e.target.value)}
              className="h-8 rounded border border-border bg-panel px-2.5 text-xs font-medium text-text outline-none focus:border-primary"
            >
              <option value="none">Normal Case</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="lowercase">lowercase</option>
              <option value="capitalize">Title Case</option>
            </select>

            {!isDefault && (
              <button
                onClick={reset}
                className="h-8 px-2.5 rounded border border-border text-xs text-muted hover:text-primary hover:border-primary inline-flex items-center gap-1 cursor-pointer font-medium"
                title="Reset settings"
              >
                <ArrowCounterClockwiseIcon size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
