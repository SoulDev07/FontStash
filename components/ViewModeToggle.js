import { ListIcon, CardsIcon } from "@phosphor-icons/react";

export default function ViewModeToggle({ viewMode, setViewMode }) {
  return (
    <button
      onClick={() => setViewMode((m) => (m === "list" ? "grid" : "list"))}
      className={`toggle-chip ${viewMode}`}
      title="Toggle list/grid"
      aria-label="Toggle list or grid view"
    >
      <span className="icon-wrap">
        <span className={`icon ${viewMode === "list" ? "icon-show" : "icon-hide"}`}>
          <ListIcon size={14} />
        </span>
        <span className={`icon ${viewMode === "grid" ? "icon-show" : "icon-hide"}`}>
          <CardsIcon size={14} />
        </span>
      </span>
      <span className="label hidden sm:inline">{viewMode === "list" ? "List" : "Grid"}</span>
    </button>
  );
}
