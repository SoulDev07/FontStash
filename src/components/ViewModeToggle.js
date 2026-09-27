import { CardsIcon, ListIcon, ScalesIcon, PaintBrushBroadIcon } from "@phosphor-icons/react";

const TABS = [
  { id: "list", label: "List", icon: ListIcon },
  { id: "grid", label: "Grid", icon: CardsIcon },
  { id: "compare", label: "Compare", icon: ScalesIcon },
  { id: "poster", label: "Poster", icon: PaintBrushBroadIcon },
];

export default function ViewModeToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center p-0.5 rounded border border-border bg-panel/60 shrink-0 select-none">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = viewMode === id;
        return (
          <button
            key={id}
            onClick={() => setViewMode(id)}
            className={`h-7 px-2 sm:px-2.5 rounded-sm border transition-colors duration-150 flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              isActive
                ? "bg-card text-text shadow-xs border-border"
                : "border-transparent text-muted hover:text-text hover:bg-card/50"
            }`}
            title={`${label} view`}
            aria-label={`${label} view`}
          >
            <Icon size={14} weight={isActive ? (id === "poster" ? "fill" : "bold") : "regular"} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
