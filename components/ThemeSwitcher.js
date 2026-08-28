import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { THEMES } from "@/themes/themes";
import { CaretDownIcon, CircleHalfIcon, CheckIcon, PaletteIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";

export default function ThemeSwitcher() {
  const { themeKey, setThemeKey } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const themeEntries = Object.entries(THEMES).map(([key, data]) => ({
    key,
    label: data.label,
    category: data.category || "Dark",
    primaryColor: data.tokens.primary,
    bgColor: data.tokens.bg,
    cardColor: data.tokens.card,
    accentColor: data.tokens.accent,
  }));

  const darkThemes = themeEntries.filter((t) => t.category === "Dark");
  const lightThemes = themeEntries.filter((t) => t.category === "Light");

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const current = themeEntries.find((o) => o.key === themeKey) || {
    key: "system",
    label: "System Default",
    isSystem: true,
  };

  const renderThemeItem = ({ key, label, primaryColor, bgColor, isSystem }) => {
    const isActive = themeKey === key;

    return (
      <button
        key={key}
        className={`w-full text-left flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-sm transition-all duration-120 cursor-pointer active:scale-[0.98] ${
          isActive
            ? "bg-panel text-text font-semibold border border-border shadow-xs"
            : "text-text hover:bg-panel/60"
        }`}
        role="option"
        aria-selected={isActive}
        onClick={() => {
          setThemeKey(key);
          setOpen(false);
        }}
      >
        {isSystem ? (
          <CircleHalfIcon size={14} className={isActive ? "text-text" : "text-muted"} />
        ) : (
          <div className="flex items-center -space-x-1 shrink-0">
            <span
              className="w-3.5 h-3.5 rounded-xs border border-border/80 shadow-xs"
              style={{ backgroundColor: bgColor }}
            />
            <span
              className="w-3.5 h-3.5 rounded-xs border border-border/80 shadow-xs"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
        )}

        <span className="flex-1 truncate">{label}</span>

        {/* Active check */}
        {isActive && (
          <CheckIcon size={13} weight="bold" className="text-primary shrink-0 ml-1" />
        )}
      </button>
    );
  };

  return (
    <div className="relative select-none" ref={menuRef}>
      <button
        className="btn h-8 px-2.5 rounded border border-border bg-panel text-xs inline-flex items-center gap-1.5 hover:border-text hover:bg-card transition-all duration-140 cursor-pointer active:scale-95"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        suppressHydrationWarning
      >
        {themeKey === "system" ? (
          <CircleHalfIcon size={13} className="text-text" />
        ) : (
          <span
            className="w-2.5 h-2.5 rounded-xs border border-border shrink-0 transition-colors"
            style={{ backgroundColor: current.primaryColor || "var(--primary)" }}
          />
        )}
        <span className="hidden sm:inline text-xs font-medium text-text" suppressHydrationWarning>
          {current.label}
        </span>
        <CaretDownIcon
          size={11}
          className={`text-muted transition-transform duration-150 ${open ? "rotate-180 text-text" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-64 max-w-[calc(100vw-32px)] card p-1.5 bg-card border border-border shadow-2xl shadow-black/50 animate-popover z-50 rounded">
          <div className="px-2.5 py-1.5 mb-1 flex items-center justify-between border-b border-border pb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <PaletteIcon size={12} className="text-text" />
              Theme Palettes
            </span>
            <span className="text-[10px] text-muted font-mono">{themeEntries.length + 1}</span>
          </div>

          <div className="max-h-90 overflow-y-auto space-y-2 pr-0.5 py-0.5 scrollbar-none">
            {/* System Option */}
            <div className="space-y-0.5">
              {renderThemeItem({
                key: "system",
                label: "System Default",
                isSystem: true,
              })}
            </div>

            {/* Dark Themes */}
            <div className="space-y-0.5">
              <div className="px-2 pt-1 pb-0.5 text-[9px] font-mono uppercase tracking-wider text-muted font-bold flex items-center gap-1">
                <MoonIcon size={10} />
                <span>Dark Aesthetics ({darkThemes.length})</span>
              </div>
              {darkThemes.map(renderThemeItem)}
            </div>

            {/* Light Themes */}
            <div className="space-y-0.5">
              <div className="px-2 pt-1 pb-0.5 text-[9px] font-mono uppercase tracking-wider text-muted font-bold flex items-center gap-1">
                <SunIcon size={10} />
                <span>Light Aesthetics ({lightThemes.length})</span>
              </div>
              {lightThemes.map(renderThemeItem)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

