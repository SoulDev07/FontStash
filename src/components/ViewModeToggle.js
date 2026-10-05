import { CardsIcon, ListIcon, ScalesIcon, PaintBrushBroadIcon } from '@phosphor-icons/react';

const TABS = [
  { id: 'list', label: 'List', icon: ListIcon },
  { id: 'grid', label: 'Grid', icon: CardsIcon },
  { id: 'compare', label: 'Compare', icon: ScalesIcon },
  { id: 'poster', label: 'Poster', icon: PaintBrushBroadIcon },
];

export default function ViewModeToggle({ viewMode, setViewMode }) {
  return (
    <div className="border-border bg-panel/60 flex shrink-0 items-center rounded border p-0.5 select-none">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = viewMode === id;
        return (
          <button
            key={id}
            onClick={() => setViewMode(id)}
            className={`flex h-7 cursor-pointer items-center gap-1.5 rounded-sm border px-2 text-xs font-medium transition-colors duration-150 sm:px-2.5 ${
              isActive
                ? 'bg-card text-text border-border shadow-xs'
                : 'text-muted hover:text-text hover:bg-card/50 border-transparent'
            }`}
            title={`${label} view`}
            aria-label={`${label} view`}
          >
            <Icon size={14} weight={isActive ? (id === 'poster' ? 'fill' : 'bold') : 'regular'} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
