import { useEffect } from "react";
import { Command } from "cmdk";
import { useFontStore } from "@/stores/useFontStore";
import { useTheme } from "@/contexts/ThemeContext";
import { THEMES } from "@/themes/themes";
import {
  MagnifyingGlassIcon,
  TextAaIcon,
  CardsIcon,
  ListIcon,
  ScalesIcon,
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
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName))) {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
      if (e.key === "Escape" && commandOpen) {
        setCommandOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandOpen, setCommandOpen]);

  if (!commandOpen) return null;

  const presets = [
    { label: "Pangram", value: "The quick brown fox jumps over the lazy dog." },
    { label: "Headline", value: "Grumpy wizards make toxic brew for the evil queen." },
    { label: "Paragraph", value: "Typography is the craft of endowing human language with a durable visual form." },
    { label: "Numerals", value: "0123456789" },
    { label: "Punctuation", value: "!@#$%^&*()_+{}|:\"<>?[];',./" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4 animate-backdrop">
      <div
        className="fixed inset-0"
        onClick={() => setCommandOpen(false)}
        aria-hidden="true"
      />

      <Command
        className="relative w-full max-w-[620px] rounded-2xl border border-border bg-card shadow-2xl shadow-black/60 overflow-hidden z-10 select-none animate-modal"
        loop
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 border-b border-border/80 bg-panel/30">
          <MagnifyingGlassIcon size={18} className="text-muted shrink-0" />
          <Command.Input
            placeholder="Type a command or search typefaces..."
            className="w-full py-4 text-xs sm:text-sm font-medium bg-transparent outline-none text-text placeholder:text-muted"
            autoFocus
          />
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-panel border border-border text-muted">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <Command.List className="max-h-[380px] overflow-y-auto p-2 space-y-1 scrollbar-none">
          <Command.Empty className="py-8 text-center text-xs text-muted">
            No matching commands or fonts found.
          </Command.Empty>

          {/* Group 1: Quick Views */}
          <Command.Group heading="Views" className="text-[10px] font-mono uppercase tracking-wider text-muted px-2.5 py-1.5 font-bold">
            <Command.Item
              onSelect={() => {
                setViewMode("grid");
                setCommandOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
            >
              <CardsIcon size={15} />
              <span>Switch to Grid View</span>
            </Command.Item>
            <Command.Item
              onSelect={() => {
                setViewMode("list");
                setCommandOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
            >
              <ListIcon size={15} />
              <span>Switch to List View</span>
            </Command.Item>
            <Command.Item
              onSelect={() => {
                setViewMode("compare");
                setCommandOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
            >
              <ScalesIcon size={15} />
              <span>Open Compare Workbench</span>
            </Command.Item>
          </Command.Group>

          {/* Group 2: Sample Text Presets */}
          <Command.Group heading="Presets" className="text-[10px] font-mono uppercase tracking-wider text-muted px-2.5 py-1.5 mt-2 font-bold">
            {presets.map((p) => (
              <Command.Item
                key={p.label}
                onSelect={() => {
                  updateSetting("sampleText", p.value);
                  setCommandOpen(false);
                  showToast(`Applied preset: ${p.label}`);
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
              >
                <SparkleIcon size={15} />
                <span>Preset: {p.label}</span>
                <span className="text-[10px] text-muted truncate ml-auto max-w-[200px] font-mono">{p.value}</span>
              </Command.Item>
            ))}
          </Command.Group>

          {/* Group 3: Color Themes */}
          <Command.Group heading="Palettes" className="text-[10px] font-mono uppercase tracking-wider text-muted px-2.5 py-1.5 mt-2 font-bold">
            {Object.entries(THEMES).map(([key, t]) => (
              <Command.Item
                key={key}
                onSelect={() => {
                  setThemeKey(key);
                  setCommandOpen(false);
                  showToast(`Theme switched to ${t.label}`);
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
              >
                <span
                  className="w-3 h-3 rounded-sm border border-border"
                  style={{ backgroundColor: t.tokens.primary }}
                />
                <span>{t.label}</span>
                {themeKey === key && <span className="text-[10px] font-mono text-primary font-bold ml-auto">Active</span>}
              </Command.Item>
            ))}
          </Command.Group>

          {/* Group 4: Loaded Typefaces */}
          <Command.Group heading="Loaded Typefaces" className="text-[10px] font-mono uppercase tracking-wider text-muted px-2.5 py-1.5 mt-2 font-bold">
            {allFonts.map((f) => (
              <Command.Item
                key={f.id}
                onSelect={() => {
                  setActiveSpecimenFont(f);
                  setCommandOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-lg text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <TextAaIcon size={15} className="text-primary shrink-0" />
                  <span className="font-semibold truncate">{f.family || f.originalName?.replace(/\.[^.]+$/, "")}</span>
                  <span className="text-[10px] font-mono text-muted">{f.formatLabel}</span>
                </div>
                <span className="text-[10px] font-mono text-muted shrink-0">Open &rarr;</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        {/* Palette Footer */}
        <div className="px-4 py-2.5 border-t border-border/80 bg-panel/50 flex items-center justify-between text-[10px] font-mono text-muted">
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
