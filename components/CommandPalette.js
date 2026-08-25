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
  ColumnsIcon,
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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-[15vh] px-4 animate-pop">
      <div
        className="fixed inset-0"
        onClick={() => setCommandOpen(false)}
        aria-hidden="true"
      />

      <Command
        className="relative w-full max-w-[580px] rounded border border-border bg-card overflow-hidden z-10 select-none"
        loop
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-3.5 border-b border-border">
          <MagnifyingGlassIcon size={16} className="text-muted shrink-0" />
          <Command.Input
            placeholder="Type a command or search fonts..."
            className="w-full py-3.5 text-xs font-medium bg-transparent outline-none text-text placeholder:text-muted"
            autoFocus
          />
          <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-panel border border-border text-muted">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <Command.List className="max-h-[360px] overflow-y-auto p-1.5 space-y-1">
          <Command.Empty className="py-6 text-center text-xs text-muted">
            No matching commands or fonts found.
          </Command.Empty>

          {/* Group 1: Quick Views */}
          <Command.Group heading="Views" className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 py-1">
            <Command.Item
              onSelect={() => {
                setViewMode("grid");
                setCommandOpen(false);
              }}
              className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
            >
              <CardsIcon size={14} />
              <span>Switch to Grid View</span>
            </Command.Item>
            <Command.Item
              onSelect={() => {
                setViewMode("list");
                setCommandOpen(false);
              }}
              className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
            >
              <ListIcon size={14} />
              <span>Switch to List View</span>
            </Command.Item>
            <Command.Item
              onSelect={() => {
                setViewMode("compare");
                setCommandOpen(false);
              }}
              className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
            >
              <ColumnsIcon size={14} />
              <span>Open Compare Workbench</span>
            </Command.Item>
          </Command.Group>

          {/* Group 2: Sample Text Presets */}
          <Command.Group heading="Presets" className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 py-1 mt-1.5">
            {presets.map((p) => (
              <Command.Item
                key={p.label}
                onSelect={() => {
                  updateSetting("sampleText", p.value);
                  setCommandOpen(false);
                  showToast(`Applied preset: ${p.label}`);
                }}
                className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
              >
                <SparkleIcon size={14} />
                <span>Preset: {p.label}</span>
                <span className="text-[10px] text-muted truncate ml-auto max-w-[180px] font-mono">{p.value}</span>
              </Command.Item>
            ))}
          </Command.Group>

          {/* Group 3: Color Themes */}
          <Command.Group heading="Palettes" className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 py-1 mt-1.5">
            {Object.entries(THEMES).map(([key, t]) => (
              <Command.Item
                key={key}
                onSelect={() => {
                  setThemeKey(key);
                  setCommandOpen(false);
                  showToast(`Theme switched to ${t.label}`);
                }}
                className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm border border-border"
                  style={{ backgroundColor: t.tokens.primary }}
                />
                <span>{t.label}</span>
                {themeKey === key && <span className="text-[10px] font-mono text-primary ml-auto">Active</span>}
              </Command.Item>
            ))}
          </Command.Group>

          {/* Group 4: Loaded Typefaces */}
          <Command.Group heading="Loaded Typefaces" className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 py-1 mt-1.5">
            {allFonts.map((f) => (
              <Command.Item
                key={f.id}
                onSelect={() => {
                  setActiveSpecimenFont(f);
                  setCommandOpen(false);
                }}
                className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded text-text hover:bg-panel cursor-pointer aria-selected:bg-panel aria-selected:text-primary"
              >
                <div className="flex items-center gap-2 truncate">
                  <TextAaIcon size={14} className="text-primary shrink-0" />
                  <span className="font-semibold truncate">{f.originalName?.replace(/\.[^.]+$/, "")}</span>
                  <span className="text-[10px] font-mono text-muted">{f.formatLabel}</span>
                </div>
                <span className="text-[10px] font-mono text-muted shrink-0">Open &rarr;</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        {/* Palette Footer */}
        <div className="px-3.5 py-2 border-t border-border bg-panel flex items-center justify-between text-[10px] font-mono text-muted">
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
