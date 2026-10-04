import { useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useFontStore } from "@/lib/store/useFontStore";
import { XIcon, PlusIcon, ScalesIcon, DotsSixVerticalIcon } from "@phosphor-icons/react";

function DraggableCompareCard({
  font,
  index,
  moveCard,
  onRemove,
  settings,
}) {
  const ref = useRef(null);

  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: "COMPARE_CARD",
    item: { id: font.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: "COMPARE_CARD",
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  dragPreview(dropRef(ref));

  const cleanTitle = font.family || font.originalName.replace(/\.[^.]+$/, "");

  return (
    <div
      ref={ref}
      className={`card rounded flex flex-col overflow-hidden shadow-xs transition-all duration-150 ${
        isDragging ? "opacity-35 scale-[0.98] border-dashed border-primary" : "hover:border-primary/50"
      } ${isOver ? "ring-2 ring-primary/40" : ""}`}
    >
      <div className="px-3.5 py-2.5 border-b border-border bg-panel/30 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate min-w-0 pr-2">
          <div
            ref={dragRef}
            className="cursor-grab active:cursor-grabbing text-muted/60 hover:text-text p-1 rounded hover:bg-panel transition-colors shrink-0"
            title="Drag to reorder side-by-side columns"
          >
            <DotsSixVerticalIcon size={14} weight="bold" />
          </div>
          <div className="truncate min-w-0">
            <h3 className="text-xs font-bold text-text truncate" title={cleanTitle}>
              {cleanTitle}
            </h3>
            <span className="text-[10px] font-mono text-muted">
              {font.formatLabel} &bull; {font.style || "Normal"}
            </span>
          </div>
        </div>

        <button
          onClick={() => onRemove(font.id)}
          className="p-1 rounded border border-border text-muted hover:text-danger hover:border-danger cursor-pointer shrink-0 active:scale-90 transition-all duration-150"
          title="Remove from compare"
        >
          <XIcon size={12} />
        </button>
      </div>

      <div className="p-4 sm:p-5 flex-1 min-h-[130px] sm:min-h-[150px] flex items-center justify-center bg-panel/10 overflow-hidden">
        <div
          style={{
            fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui`,
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            letterSpacing: `${settings.letterSpacing}px`,
            textAlign: settings.alignment,
            textTransform: settings.transform,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
          className="text-text break-words w-full"
        >
          {settings.sampleText}
        </div>
      </div>

      <div className="px-3.5 py-2 border-t border-border bg-panel/30 flex items-center justify-between text-[10px] font-mono text-muted">
        <span>Weight: {font.weight || 400}</span>
        <span className="text-primary font-semibold">Synced</span>
      </div>
    </div>
  );
}

export default function FontCompareView({ allFonts = [] }) {
  const {
    compareIds,
    toggleCompare,
    clearCompare,
    reorderCompare,
    settings,
  } = useFontStore();

  const comparedFonts = compareIds
    .map((id) => allFonts.find((f) => f.id === id))
    .filter(Boolean);
  const availableFonts = allFonts.filter((f) => !compareIds.includes(f.id));

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      reorderCompare(dragIndex, hoverIndex);
    },
    [reorderCompare]
  );

  return (
    <div className="space-y-3.5 animate-modal">
      <div className="card rounded p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded bg-primary text-bg flex items-center justify-center font-bold text-xs font-mono shrink-0">
            {comparedFonts.length}
          </span>
          <div>
            <h2 className="text-sm font-bold text-text">
              Compare Workbench
            </h2>
            <p className="text-[11px] text-muted font-mono">
              Comparing {comparedFonts.length}/4 fonts side by side &bull; Drag handles to reorder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {comparedFonts.length > 0 && (
            <button
              onClick={clearCompare}
              className="btn text-xs px-2.5 py-1 rounded border border-border text-muted hover:text-danger hover:border-danger cursor-pointer active:scale-[0.97] transition-colors duration-150"
            >
              Clear All
            </button>
          )}

          {availableFonts.length > 0 && comparedFonts.length < 4 && (
            <div className="relative group">
              <button className="btn btn-primary text-xs px-3 py-1 rounded inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97] shadow-xs font-semibold">
                <PlusIcon size={13} weight="bold" />
                <span>Add Font</span>
              </button>

              <div className="absolute right-0 mt-1.5 w-56 max-w-[calc(100vw-32px)] card rounded p-1.5 shadow-2xl shadow-black/50 hidden group-hover:block group-focus-within:block z-40 animate-popover">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted px-2 py-1 mb-1 font-bold">
                  Select Font to Compare
                </div>
                <div className="max-h-52 overflow-y-auto space-y-0.5 scrollbar-none">
                  {availableFonts.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => toggleCompare(f.id)}
                      className="w-full text-left px-2 py-1 text-xs rounded text-text hover:bg-panel flex items-center justify-between cursor-pointer active:scale-[0.97] transition-colors duration-140"
                    >
                      <span className="truncate">{f.family || f.originalName.replace(/\.[^.]+$/, "")}</span>
                      <span className="tag tag-accent text-[9px]">{f.formatLabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {comparedFonts.length === 0 ? (
        <div className="card rounded border-dashed border p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 animate-backdrop">
          <div className="w-10 h-10 rounded bg-panel text-primary flex items-center justify-center border border-border">
            <ScalesIcon size={20} weight="bold" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text mb-0.5">No fonts in compare workbench</h3>
            <p className="text-xs text-muted max-w-sm">
              Click the compare icon on any font card or click &quot;Add Font&quot; above to inspect typefaces side by side.
            </p>
          </div>
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${comparedFonts.length === 2 ? "md:grid-cols-2" : comparedFonts.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"} gap-3.5 sm:gap-4`}>
          {comparedFonts.map((font, idx) => (
            <DraggableCompareCard
              key={font.id}
              font={font}
              index={idx}
              moveCard={moveCard}
              onRemove={toggleCompare}
              settings={settings}
            />
          ))}
        </div>
      )}
    </div>
  );
}
