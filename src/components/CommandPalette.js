import { useEffect, useMemo } from "react";
import { Command } from "cmdk";
import { useFontStore } from "@/lib/store/useFontStore";
import { useTheme } from "@/lib/context/ThemeContext";
import { THEMES } from "@/lib/theme/tokens";
import {
  MagnifyingGlassIcon,
  TextAaIcon,
  CardsIcon,
  ListIcon,
  ScalesIcon,
  PaintBrushBroadIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

export default function CommandPalette({ allFonts = [] }) {
  const {
    commandOpen,
    setCommandOpen,
    setViewMode,
    updateSetting,
    setActiveSpecimenFont,
    showToast,
  } = useFontStore();
  const { themeKey, setThemeKey } = useTheme();

  useEffect(() => {
    const down = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const isK = (e.key.toLowerCase() === "k" || e.code === "KeyK") && isCmdOrCtrl;

      if (isK) {
        e.preventDefault();
        e.stopPropagation();
        setCommandOpen(!useFontStore.getState().commandOpen);
      }
      if (e.key === "Escape" && useFontStore.getState().commandOpen) {
        e.preventDefault();
        setCommandOpen(false);
      }
    };

    window.addEventListener("keydown", down, true);
    return () => window.removeEventListener("keydown", down, true);
  }, [setCommandOpen]);

  const uniqueFonts = useMemo(() => {
    const seen = new Set();
    return allFonts.filter((f) => {
      const key = f.id || `${f.family}-${f.url || f.originalName}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allFonts]);

  if (!commandOpen) return null;

  const presets = [
    { label: "Pangram", value: "The quick brown fox jumps over the lazy dog." },
    { label: "Headline", value: "Grumpy wizards make toxic brew for the evil queen." },
    { label: "Paragraph", value: "Typography is the craft of endowing human language with a durable visual form." },
    { label: "Numerals", value: "0123456789" },
    { label: "Punctuation", value: "!@#$%^&*()_+{}|:\"<>?[];',./" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4 animate-backdrop">
      <div
        className="fixed inset-0"
        onClick={() => setCommandOpen(false)}
        aria-hidden="true"
      />

      <Command
        className="relative w-full max-w-[620px] max-h-[80vh] flex flex-col rounded border border-border bg-card shadow-2xl shadow-black/60 overflow-hidden z-10 select-none animate-modal"
        loop
      >
        {/* Search Header */}
        <div className="relative z-20 flex items-center gap-3 px-4 border-b border-border bg-card shrink-0">
          <MagnifyingGlassIcon size={18} className="text-muted shrink-0" />
          <Command.Input
            placeholder="Type a command or search typefaces..."
            className="w-full py-3.5 text-xs sm:text-sm font-medium bg-transparent outline-none text-text placeholder:text-muted"
            autoFocus
          />
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-panel border border-border text-muted font-medium shrink-0">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <Command.List className="flex-1 min-h-0 max-h-[380px] overflow-y-auto p-2 space-y-1 scrollbar-none">
          <Command.Empty className="py-8 text-center text-xs text-muted font-medium">
            No matching commands or fonts found.
          </Command.Empty>

          {/* Group 1: Quick Views */}
          <Command.Group heading="Views" className="overflow-hidden py-1">
            <Command.Item
              value="view grid switch to grid view"
              onSelect={() => {
                setViewMode("grid");
                setCommandOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-sm text-text hover:bg-panel cursor-pointer data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel transition-colors"
            >
              <CardsIcon size={15} />
              <span>Switch to Grid View</span>
            </Command.Item>
            <Command.Item
              value="view list switch to list view"
              onSelect={() => {
                setViewMode("list");
                setCommandOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-sm text-text hover:bg-panel cursor-pointer data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel transition-colors"
            >
              <ListIcon size={15} />
              <span>Switch to List View</span>
            </Command.Item>
            <Command.Item
              value="view compare open compare workbench"
              onSelect={() => {
                setViewMode("compare");
                setCommandOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-sm text-text hover:bg-panel cursor-pointer data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel transition-colors"
            >
              <ScalesIcon size={15} />
              <span>Open Compare Workbench</span>
            </Command.Item>
            <Command.Item
              value="view poster switch to poster lab"
              onSelect={() => {
                setViewMode("poster");
                setCommandOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-sm text-text hover:bg-panel cursor-pointer data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel transition-colors"
            >
              <PaintBrushBroadIcon size={15} />
              <span>Switch to Poster Lab</span>
            </Command.Item>
          </Command.Group>

          {/* Group 2: Sample Text Presets */}
          <Command.Group heading="Presets" className="overflow-hidden py-1 mt-1">
            {presets.map((p) => (
              <Command.Item
                key={p.label}
                value={`preset ${p.label} ${p.value}`}
                onSelect={() => {
                  updateSetting("sampleText", p.value);
                  setCommandOpen(false);
                  showToast(`Applied preset: ${p.label}`);
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-sm text-text hover:bg-panel cursor-pointer data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel transition-colors"
              >
                <SparkleIcon size={15} />
                <span>Preset: {p.label}</span>
                <span className="text-[10px] text-muted truncate ml-auto max-w-[200px] font-mono">{p.value}</span>
              </Command.Item>
            ))}
          </Command.Group>

          {/* Group 3: Color Themes */}
          <Command.Group heading="Palettes" className="overflow-hidden py-1 mt-1">
            {Object.entries(THEMES).map(([key, t]) => (
              <Command.Item
                key={key}
                value={`theme ${t.label} palette`}
                onSelect={() => {
                  setThemeKey(key);
                  setCommandOpen(false);
                  showToast(`Theme switched to ${t.label}`);
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-sm text-text hover:bg-panel cursor-pointer data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel transition-colors"
              >
                <span
                  className="w-3 h-3 rounded-xs border border-border shrink-0"
                  style={{ backgroundColor: t.tokens.primary }}
                />
                <span>{t.label}</span>
                {themeKey === key && <span className="text-[10px] font-mono text-primary font-bold ml-auto">Active</span>}
              </Command.Item>
            ))}
          </Command.Group>

          {/* Group 4: Loaded Typefaces */}
          <Command.Group heading="Loaded Typefaces" className="overflow-hidden py-1 mt-1">
            {uniqueFonts.map((f, idx) => {
              const displayFamily = f.family || f.originalName.replace(/\.[^.]+$/, "");
              const styleVariant = (f.subfamily && f.subfamily !== "Regular")
                ? f.subfamily
                : (f.style && f.style !== "Normal" ? f.style : "");

              return (
                <Command.Item
                  key={f.id || idx}
                  value={`font ${displayFamily} ${styleVariant} ${f.formatLabel || ""} ${f.id || idx}`}
                  onSelect={() => {
                    setActiveSpecimenFont(f);
                    setCommandOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 text-xs rounded-sm text-text hover:bg-panel cursor-pointer data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <TextAaIcon size={15} className="text-primary shrink-0" />
                    <span className="font-semibold truncate">{displayFamily}</span>
                    {styleVariant && (
                      <span className="text-[10px] font-mono text-muted/80 truncate shrink-0">
                        {styleVariant}
                      </span>
                    )}
                    {f.formatLabel && (
                      <span className="text-[10px] font-mono text-muted shrink-0">
                        {f.formatLabel}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted shrink-0 ml-2">Open &rarr;</span>
                </Command.Item>
              );
            })}
          </Command.Group>
        </Command.List>

        {/* Palette Footer */}
        <div className="relative z-20 px-4 py-2.5 border-t border-border bg-card flex items-center justify-between text-[10px] font-mono text-muted shrink-0">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; Navigate</span>
            <span>&crarr; Select</span>
            <span>ESC Close</span>
          </div>
          <span>Command Bar</span>
        </div>
      </Command>
    </div>
  );
}
