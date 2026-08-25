import { CardsIcon, ListIcon, ColumnsIcon } from "@phosphor-icons/react";

export default function ViewModeToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center p-0.5 rounded border border-border bg-card shrink-0 select-none">
      <button
        onClick={() => setViewMode("grid")}
        className={`px-2 py-1 rounded transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
          viewMode === "grid"
            ? "bg-primary text-white"
            : "text-muted hover:text-text hover:bg-panel"
        }`}
        title="Grid view"
        aria-label="Grid view"
      >
        <CardsIcon size={14} weight={viewMode === "grid" ? "fill" : "regular"} />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`px-2 py-1 rounded transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
          viewMode === "list"
            ? "bg-primary text-white"
            : "text-muted hover:text-text hover:bg-panel"
        }`}
        title="List view"
        aria-label="List view"
      >
        <ListIcon size={14} weight={viewMode === "list" ? "fill" : "regular"} />
        <span className="hidden sm:inline">List</span>
      </button>
      <button
        onClick={() => setViewMode("compare")}
        className={`px-2 py-1 rounded transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
          viewMode === "compare"
            ? "bg-primary text-white"
            : "text-muted hover:text-text hover:bg-panel"
        }`}
        title="Compare workbench"
        aria-label="Compare workbench"
      >
        <ColumnsIcon size={14} weight={viewMode === "compare" ? "fill" : "regular"} />
        <span className="hidden sm:inline">Compare</span>
      </button>
    </div>
  );
}
