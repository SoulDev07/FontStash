import {
  MagnifyingGlassIcon,
  TextAaIcon,
  CardsIcon,
  ListIcon,
  ScalesIcon,
  PaintBrushBroadIcon,
  SparkleIcon,
} from '@phosphor-icons/react';
import { Command } from 'cmdk';
import { useEffect, useMemo } from 'react';

import { useTheme } from '@/lib/context/ThemeContext';
import { useFontStore } from '@/lib/store/useFontStore';
import { THEMES } from '@/lib/theme/tokens';

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
      const isK = (e.key.toLowerCase() === 'k' || e.code === 'KeyK') && isCmdOrCtrl;

      if (isK) {
        e.preventDefault();
        e.stopPropagation();
        setCommandOpen(!useFontStore.getState().commandOpen);
      }
      if (e.key === 'Escape' && useFontStore.getState().commandOpen) {
        e.preventDefault();
        setCommandOpen(false);
      }
    };

    window.addEventListener('keydown', down, true);
    return () => window.removeEventListener('keydown', down, true);
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
    { label: 'Pangram', value: 'The quick brown fox jumps over the lazy dog.' },
    { label: 'Headline', value: 'Grumpy wizards make toxic brew for the evil queen.' },
    {
      label: 'Paragraph',
      value: 'Typography is the craft of endowing human language with a durable visual form.',
    },
    { label: 'Numerals', value: '0123456789' },
    { label: 'Punctuation', value: '!@#$%^&*()_+{}|:"<>?[];\',./' },
  ];

  return (
    <div className="animate-backdrop fixed inset-0 z-50 flex items-start justify-center bg-black/75 px-4 pt-[12vh] backdrop-blur-sm">
      <div className="fixed inset-0" onClick={() => setCommandOpen(false)} aria-hidden="true" />

      <Command
        className="border-border bg-card animate-modal relative z-10 flex max-h-[80vh] w-full max-w-[620px] flex-col overflow-hidden rounded border shadow-2xl shadow-black/60 select-none"
        loop
      >
        {/* Search Header */}
        <div className="border-border bg-card relative z-20 flex shrink-0 items-center gap-3 border-b px-4">
          <MagnifyingGlassIcon size={18} className="text-muted shrink-0" />
          <Command.Input
            placeholder="Type a command or search typefaces..."
            className="text-text placeholder:text-muted w-full bg-transparent py-3.5 text-xs font-medium outline-none sm:text-sm"
            autoFocus
          />
          <kbd className="bg-panel border-border text-muted shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] font-medium">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <Command.List className="max-h-[380px] min-h-0 flex-1 scrollbar-none space-y-1 overflow-y-auto p-2">
          <Command.Empty className="text-muted py-8 text-center text-xs font-medium">
            No matching commands or fonts found.
          </Command.Empty>

          {/* Group 1: Quick Views */}
          <Command.Group heading="Views" className="overflow-hidden py-1">
            <Command.Item
              value="view grid switch to grid view"
              onSelect={() => {
                setViewMode('grid');
                setCommandOpen(false);
              }}
              className="text-text hover:bg-panel data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-xs transition-colors"
            >
              <CardsIcon size={15} />
              <span>Switch to Grid View</span>
            </Command.Item>
            <Command.Item
              value="view list switch to list view"
              onSelect={() => {
                setViewMode('list');
                setCommandOpen(false);
              }}
              className="text-text hover:bg-panel data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-xs transition-colors"
            >
              <ListIcon size={15} />
              <span>Switch to List View</span>
            </Command.Item>
            <Command.Item
              value="view compare open compare workbench"
              onSelect={() => {
                setViewMode('compare');
                setCommandOpen(false);
              }}
              className="text-text hover:bg-panel data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-xs transition-colors"
            >
              <ScalesIcon size={15} />
              <span>Open Compare Workbench</span>
            </Command.Item>
            <Command.Item
              value="view poster switch to poster lab"
              onSelect={() => {
                setViewMode('poster');
                setCommandOpen(false);
              }}
              className="text-text hover:bg-panel data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-xs transition-colors"
            >
              <PaintBrushBroadIcon size={15} />
              <span>Switch to Poster Lab</span>
            </Command.Item>
          </Command.Group>

          {/* Group 2: Sample Text Presets */}
          <Command.Group heading="Presets" className="mt-1 overflow-hidden py-1">
            {presets.map((p) => (
              <Command.Item
                key={p.label}
                value={`preset ${p.label} ${p.value}`}
                onSelect={() => {
                  updateSetting('sampleText', p.value);
                  setCommandOpen(false);
                  showToast(`Applied preset: ${p.label}`);
                }}
                className="text-text hover:bg-panel data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-xs transition-colors"
              >
                <SparkleIcon size={15} />
                <span>Preset: {p.label}</span>
                <span className="text-muted ml-auto max-w-[200px] truncate font-mono text-[10px]">
                  {p.value}
                </span>
              </Command.Item>
            ))}
          </Command.Group>

          {/* Group 3: Color Themes */}
          <Command.Group heading="Palettes" className="mt-1 overflow-hidden py-1">
            {Object.entries(THEMES).map(([key, t]) => (
              <Command.Item
                key={key}
                value={`theme ${t.label} palette`}
                onSelect={() => {
                  setThemeKey(key);
                  setCommandOpen(false);
                  showToast(`Theme switched to ${t.label}`);
                }}
                className="text-text hover:bg-panel data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-xs transition-colors"
              >
                <span
                  className="border-border h-3 w-3 shrink-0 rounded-xs border"
                  style={{ backgroundColor: t.tokens.primary }}
                />
                <span>{t.label}</span>
                {themeKey === key && (
                  <span className="text-primary ml-auto font-mono text-[10px] font-bold">
                    Active
                  </span>
                )}
              </Command.Item>
            ))}
          </Command.Group>

          {/* Group 4: Loaded Typefaces */}
          <Command.Group heading="Loaded Typefaces" className="mt-1 overflow-hidden py-1">
            {uniqueFonts.map((f, idx) => {
              const displayFamily = f.family || f.originalName.replace(/\.[^.]+$/, '');
              const styleVariant =
                f.subfamily && f.subfamily !== 'Regular'
                  ? f.subfamily
                  : f.style && f.style !== 'Normal'
                    ? f.style
                    : '';

              return (
                <Command.Item
                  key={f.id || idx}
                  value={`font ${displayFamily} ${styleVariant} ${f.formatLabel || ''} ${f.id || idx}`}
                  onSelect={() => {
                    setActiveSpecimenFont(f);
                    setCommandOpen(false);
                  }}
                  className="text-text hover:bg-panel data-[selected=true]:bg-panel data-[selected=true]:text-text aria-selected:bg-panel flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-xs transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <TextAaIcon size={15} className="text-primary shrink-0" />
                    <span className="truncate font-semibold">{displayFamily}</span>
                    {styleVariant && (
                      <span className="text-muted/80 shrink-0 truncate font-mono text-[10px]">
                        {styleVariant}
                      </span>
                    )}
                    {f.formatLabel && (
                      <span className="text-muted shrink-0 font-mono text-[10px]">
                        {f.formatLabel}
                      </span>
                    )}
                  </div>
                  <span className="text-muted ml-2 shrink-0 font-mono text-[10px]">
                    Open &rarr;
                  </span>
                </Command.Item>
              );
            })}
          </Command.Group>
        </Command.List>

        {/* Palette Footer */}
        <div className="border-border bg-card text-muted relative z-20 flex shrink-0 items-center justify-between border-t px-4 py-2.5 font-mono text-[10px]">
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
