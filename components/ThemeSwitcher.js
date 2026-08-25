import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { THEMES } from "@/themes/themes";
import { CaretDownIcon, CircleHalfIcon, CheckIcon, PaletteIcon } from "@phosphor-icons/react";

export default function ThemeSwitcher() {
  const { themeKey, setThemeKey } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const themeEntries = Object.entries(THEMES).map(([key, data]) => ({
    key,
    label: data.label,
    primaryColor: data.tokens.primary,
    bgColor: data.tokens.bg,
  }));

  const allOptions = [
    { key: "system", label: "System Default", isSystem: true },
    ...themeEntries,
  ];

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const current = allOptions.find((o) => o.key === themeKey) || allOptions[0];

  return (
    <div className="relative select-none" ref={menuRef}>
      <button
        className="btn h-8 px-2.5 rounded border border-border bg-panel text-xs inline-flex items-center gap-1.5 hover:border-text transition-colors cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        suppressHydrationWarning
      >
        {current.isSystem ? (
          <CircleHalfIcon size={13} className="text-primary" />
        ) : (
          <span
            className="w-2.5 h-2.5 rounded-sm border border-border shrink-0"
            style={{ backgroundColor: current.primaryColor || "var(--primary)" }}
          />
        )}
        <span className="hidden sm:inline text-xs font-medium text-text" suppressHydrationWarning>
          {current.label}
        </span>
        <CaretDownIcon
          size={11}
          className={`text-muted transition-transform ${open ? "rotate-180 text-primary" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-60 card p-1.5 bg-card border border-border animate-pop z-50 rounded">
          <div className="px-2.5 py-1.5 mb-1 flex items-center justify-between border-b border-border pb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <PaletteIcon size={12} className="text-primary" />
              Theme Palettes
            </span>
            <span className="text-[10px] text-muted font-mono">{allOptions.length}</span>
          </div>

          <div className="max-h-[340px] overflow-y-auto space-y-0.5 pr-0.5 py-0.5">
            {allOptions.map(({ key, label, primaryColor, bgColor, isSystem }) => {
              const isActive = themeKey === key;

              return (
                <button
                  key={key}
                  className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                    isActive
                      ? "bg-primary text-white font-medium"
                      : "text-text hover:bg-panel"
                  }`}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setThemeKey(key);
                    setOpen(false);
                  }}
                >
                  {isSystem ? (
                    <CircleHalfIcon size={13} className={isActive ? "text-white" : "text-muted"} />
                  ) : (
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className="w-2.5 h-2.5 rounded-sm border border-border"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-sm border border-border"
                        style={{ backgroundColor: bgColor }}
                      />
                    </div>
                  )}

                  <span className="flex-1 truncate">{label}</span>

                  {/* Active check */}
                  {isActive && (
                    <CheckIcon size={12} weight="bold" className="text-white shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
