import { XIcon, PlusIcon, ScalesIcon, DotsSixVerticalIcon } from '@phosphor-icons/react';
import { useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { useFontStore } from '@/lib/store/useFontStore';

function DraggableCompareCard({ font, index, moveCard, onRemove, settings }) {
  const ref = useRef(null);

  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: 'COMPARE_CARD',
    item: { id: font.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: 'COMPARE_CARD',
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

  const cleanTitle = font.family || font.originalName.replace(/\.[^.]+$/, '');

  return (
    <div
      ref={ref}
      className={`card flex flex-col overflow-hidden rounded shadow-xs transition-all duration-150 ${
        isDragging
          ? 'border-primary scale-[0.98] border-dashed opacity-35'
          : 'hover:border-primary/50'
      } ${isOver ? 'ring-primary/40 ring-2' : ''}`}
    >
      <div className="border-border bg-panel/30 flex items-center justify-between border-b px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2 truncate pr-2">
          <div
            ref={dragRef}
            className="text-muted/60 hover:text-text hover:bg-panel shrink-0 cursor-grab rounded p-1 transition-colors active:cursor-grabbing"
            title="Drag to reorder side-by-side columns"
          >
            <DotsSixVerticalIcon size={14} weight="bold" />
          </div>
          <div className="min-w-0 truncate">
            <h3 className="text-text truncate text-xs font-bold" title={cleanTitle}>
              {cleanTitle}
            </h3>
            <span className="text-muted font-mono text-[10px]">
              {font.formatLabel} &bull; {font.style || 'Normal'}
            </span>
          </div>
        </div>

        <button
          onClick={() => onRemove(font.id)}
          className="border-border text-muted hover:text-danger hover:border-danger shrink-0 cursor-pointer rounded border p-1 transition-all duration-150 active:scale-90"
          title="Remove from compare"
        >
          <XIcon size={12} />
        </button>
      </div>

      <div className="bg-panel/10 flex min-h-[130px] flex-1 items-center justify-center overflow-hidden p-4 sm:min-h-[150px] sm:p-5">
        <div
          style={{
            fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui`,
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            letterSpacing: `${settings.letterSpacing}px`,
            textAlign: settings.alignment,
            textTransform: settings.transform,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
          className="text-text w-full break-words"
        >
          {settings.sampleText}
        </div>
      </div>

      <div className="border-border bg-panel/30 text-muted flex items-center justify-between border-t px-3.5 py-2 font-mono text-[10px]">
        <span>Weight: {font.weight || 400}</span>
        <span className="text-primary font-semibold">Synced</span>
      </div>
    </div>
  );
}

export default function FontCompareView({ allFonts = [] }) {
  const { compareIds, toggleCompare, clearCompare, reorderCompare, settings } = useFontStore();

  const comparedFonts = compareIds.map((id) => allFonts.find((f) => f.id === id)).filter(Boolean);
  const availableFonts = allFonts.filter((f) => !compareIds.includes(f.id));

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      reorderCompare(dragIndex, hoverIndex);
    },
    [reorderCompare]
  );

  return (
    <div className="animate-modal space-y-3.5">
      <div className="card flex flex-wrap items-center justify-between gap-3 rounded p-3 shadow-xs sm:p-3.5">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary text-bg flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-xs font-bold">
            {comparedFonts.length}
          </span>
          <div>
            <h2 className="text-text text-sm font-bold">Compare Workbench</h2>
            <p className="text-muted font-mono text-[11px]">
              Comparing {comparedFonts.length}/4 fonts side by side &bull; Drag handles to reorder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {comparedFonts.length > 0 && (
            <button
              onClick={clearCompare}
              className="btn border-border text-muted hover:text-danger hover:border-danger cursor-pointer rounded border px-2.5 py-1 text-xs transition-colors duration-150 active:scale-[0.97]"
            >
              Clear All
            </button>
          )}

          {availableFonts.length > 0 && comparedFonts.length < 4 && (
            <div className="group relative">
              <button className="btn btn-primary inline-flex cursor-pointer items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold shadow-xs active:scale-[0.97]">
                <PlusIcon size={13} weight="bold" />
                <span>Add Font</span>
              </button>

              <div className="card animate-popover absolute right-0 z-40 mt-1.5 hidden w-56 max-w-[calc(100vw-32px)] rounded p-1.5 shadow-2xl shadow-black/50 group-focus-within:block group-hover:block">
                <div className="text-muted mb-1 px-2 py-1 font-mono text-[10px] font-bold tracking-wider uppercase">
                  Select Font to Compare
                </div>
                <div className="max-h-52 scrollbar-none space-y-0.5 overflow-y-auto">
                  {availableFonts.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => toggleCompare(f.id)}
                      className="text-text hover:bg-panel flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-left text-xs transition-colors duration-140 active:scale-[0.97]"
                    >
                      <span className="truncate">
                        {f.family || f.originalName.replace(/\.[^.]+$/, '')}
                      </span>
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
        <div className="card animate-backdrop flex flex-col items-center justify-center gap-3 rounded border border-dashed p-8 text-center sm:p-12">
          <div className="bg-panel text-primary border-border flex h-10 w-10 items-center justify-center rounded border">
            <ScalesIcon size={20} weight="bold" />
          </div>
          <div>
            <h3 className="text-text mb-0.5 text-sm font-bold">No fonts in compare workbench</h3>
            <p className="text-muted max-w-sm text-xs">
              Click the compare icon on any font card or click &quot;Add Font&quot; above to inspect
              typefaces side by side.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 ${comparedFonts.length === 2 ? 'md:grid-cols-2' : comparedFonts.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-3.5 sm:gap-4`}
        >
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
