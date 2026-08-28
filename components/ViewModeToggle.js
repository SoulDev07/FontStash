import { CardsIcon, ListIcon, ScalesIcon } from "@phosphor-icons/react";

export default function ViewModeToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center p-0.5 rounded border border-border bg-panel/60 shrink-0 select-none">
      {/* List first */}
      <button
        onClick={() => setViewMode("list")}
        className={`px-2 py-1 rounded-sm transition-all duration-120 flex items-center gap-1.5 text-xs font-medium cursor-pointer active:scale-90 ${
          viewMode === "list"
            ? "bg-card text-text shadow-xs border border-border font-semibold"
            : "text-muted hover:text-text hover:bg-card/50"
        }`}
        title="List view"
        aria-label="List view"
      >
        <ListIcon size={14} weight={viewMode === "list" ? "bold" : "regular"} />
        <span className="hidden sm:inline">List</span>
      </button>

      {/* Grid second */}
      <button
        onClick={() => setViewMode("grid")}
        className={`px-2 py-1 rounded-sm transition-all duration-120 flex items-center gap-1.5 text-xs font-medium cursor-pointer active:scale-90 ${
          viewMode === "grid"
            ? "bg-card text-text shadow-xs border border-border font-semibold"
            : "text-muted hover:text-text hover:bg-card/50"
        }`}
        title="Grid view"
        aria-label="Grid view"
      >
        <CardsIcon size={14} weight={viewMode === "grid" ? "bold" : "regular"} />
        <span className="hidden sm:inline">Grid</span>
      </button>

      {/* Compare third */}
      <button
        onClick={() => setViewMode("compare")}
        className={`px-2 py-1 rounded-sm transition-all duration-120 flex items-center gap-1.5 text-xs font-medium cursor-pointer active:scale-90 ${
          viewMode === "compare"
            ? "bg-card text-text shadow-xs border border-border font-semibold"
            : "text-muted hover:text-text hover:bg-card/50"
        }`}
        title="Compare workbench"
        aria-label="Compare workbench"
      >
        <ScalesIcon size={14} weight={viewMode === "compare" ? "bold" : "regular"} />
        <span className="hidden sm:inline">Compare</span>
      </button>
    </div>
  );
}
