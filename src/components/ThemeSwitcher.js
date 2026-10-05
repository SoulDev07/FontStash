import {
  CaretDownIcon,
  CircleHalfIcon,
  CheckIcon,
  PaletteIcon,
  MoonIcon,
  SunIcon,
} from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

import { useTheme } from '@/lib/context/ThemeContext';
import { THEMES } from '@/lib/theme/tokens';

export default function ThemeSwitcher() {
  const { themeKey, setThemeKey } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const themeEntries = Object.entries(THEMES).map(([key, data]) => ({
    key,
    label: data.label,
    category: data.category || 'Dark',
    primaryColor: data.tokens.primary,
    bgColor: data.tokens.bg,
    cardColor: data.tokens.card,
    accentColor: data.tokens.accent,
  }));

  const darkThemes = themeEntries.filter((t) => t.category === 'Dark');
  const lightThemes = themeEntries.filter((t) => t.category === 'Light');

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const current = themeEntries.find((o) => o.key === themeKey) || {
    key: 'system',
    label: 'System Default',
    isSystem: true,
  };

  const renderThemeItem = ({ key, label, primaryColor, bgColor, isSystem }) => {
    const isActive = themeKey === key;

    return (
      <button
        key={key}
        className={`flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-left text-xs transition-all duration-120 active:scale-[0.98] ${
          isActive
            ? 'bg-panel text-text border-border border font-semibold shadow-xs'
            : 'text-text hover:bg-panel/60'
        }`}
        role="option"
        aria-selected={isActive}
        onClick={() => {
          setThemeKey(key);
          setOpen(false);
        }}
      >
        {isSystem ? (
          <CircleHalfIcon size={14} className={isActive ? 'text-text' : 'text-muted'} />
        ) : (
          <div className="flex shrink-0 items-center -space-x-1">
            <span
              className="border-border/80 h-3.5 w-3.5 rounded-xs border shadow-xs"
              style={{ backgroundColor: bgColor }}
            />
            <span
              className="border-border/80 h-3.5 w-3.5 rounded-xs border shadow-xs"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
        )}

        <span className="flex-1 truncate">{label}</span>

        {/* Active check */}
        {isActive && <CheckIcon size={13} weight="bold" className="text-primary ml-1 shrink-0" />}
      </button>
    );
  };

  return (
    <div className="relative select-none" ref={menuRef}>
      <button
        className="btn border-border bg-panel hover:border-text hover:bg-card inline-flex h-8 cursor-pointer items-center gap-1.5 rounded border px-2.5 text-xs transition-all duration-140 active:scale-95"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        suppressHydrationWarning
      >
        {themeKey === 'system' ? (
          <CircleHalfIcon size={13} className="text-text" />
        ) : (
          <span
            className="border-border h-2.5 w-2.5 shrink-0 rounded-xs border transition-colors"
            style={{ backgroundColor: current.primaryColor || 'var(--primary)' }}
          />
        )}
        <span className="text-text hidden text-xs font-medium sm:inline" suppressHydrationWarning>
          {current.label}
        </span>
        <CaretDownIcon
          size={11}
          className={`text-muted transition-transform duration-150 ${open ? 'text-text rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="card bg-card border-border animate-popover absolute right-0 z-50 mt-1.5 w-64 max-w-[calc(100vw-32px)] rounded border p-1.5 shadow-2xl shadow-black/50">
          <div className="border-border mb-1 flex items-center justify-between border-b px-2.5 py-1.5 pb-1.5">
            <span className="text-muted flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider uppercase">
              <PaletteIcon size={12} className="text-text" />
              Theme Palettes
            </span>
            <span className="text-muted font-mono text-[10px]">{themeEntries.length + 1}</span>
          </div>

          <div className="max-h-90 scrollbar-none space-y-2 overflow-y-auto py-0.5 pr-0.5">
            {/* System Option */}
            <div className="space-y-0.5">
              {renderThemeItem({
                key: 'system',
                label: 'System Default',
                isSystem: true,
              })}
            </div>

            {/* Dark Themes */}
            <div className="space-y-0.5">
              <div className="text-muted flex items-center gap-1 px-2 pt-1 pb-0.5 font-mono text-[9px] font-bold tracking-wider uppercase">
                <MoonIcon size={10} />
                <span>Dark Aesthetics ({darkThemes.length})</span>
              </div>
              {darkThemes.map(renderThemeItem)}
            </div>

            {/* Light Themes */}
            <div className="space-y-0.5">
              <div className="text-muted flex items-center gap-1 px-2 pt-1 pb-0.5 font-mono text-[9px] font-bold tracking-wider uppercase">
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
