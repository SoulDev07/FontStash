import { useFontStore } from "@/stores/useFontStore";
import { XIcon, PlusIcon, ScalesIcon } from "@phosphor-icons/react";

export default function FontCompareView({ allFonts = [] }) {
  const {
    compareIds,
    toggleCompare,
    clearCompare,
    settings,
  } = useFontStore();

  const comparedFonts = allFonts.filter((f) => compareIds.includes(f.id));
  const availableFonts = allFonts.filter((f) => !compareIds.includes(f.id));

  return (
    <div className="space-y-3.5 animate-modal">
      {/* Compare Header Controls */}
      <div className="card rounded p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-xs font-mono shrink-0">
            {comparedFonts.length}
          </span>
          <div>
            <h2 className="text-sm font-bold text-text">
              Compare Workbench
            </h2>
            <p className="text-[11px] text-muted font-mono">
              Comparing {comparedFonts.length}/4 fonts side by side
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {comparedFonts.length > 0 && (
            <button
              onClick={clearCompare}
              className="btn text-xs px-2.5 py-1 rounded border border-border text-muted hover:text-danger hover:border-danger cursor-pointer active:scale-95 transition-all duration-150"
            >
              Clear All
            </button>
          )}

          {availableFonts.length > 0 && comparedFonts.length < 4 && (
            <div className="relative group">
              <button className="btn btn-primary text-xs px-3 py-1 rounded inline-flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs font-semibold">
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
                      className="w-full text-left px-2 py-1 text-xs rounded text-text hover:bg-panel flex items-center justify-between cursor-pointer active:scale-98 transition-all duration-100"
                    >
                      <span className="truncate">{f.family || f.originalName?.replace(/\.[^.]+$/, "")}</span>
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
          {comparedFonts.map((font) => {
            const cleanTitle = font.family || font.originalName.replace(/\.[^.]+$/, "");
            return (
              <div
                key={font.id}
                className="card rounded flex flex-col overflow-hidden shadow-xs hover:border-primary/50 transition-colors"
              >
                {/* Header */}
                <div className="px-3.5 py-2.5 border-b border-border bg-panel/30 flex items-center justify-between">
                  <div className="truncate min-w-0 pr-2">
                    <h3 className="text-xs font-bold text-text truncate" title={cleanTitle}>
                      {cleanTitle}
                    </h3>
                    <span className="text-[10px] font-mono text-muted">
                      {font.formatLabel} &bull; {font.style || "Normal"}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleCompare(font.id)}
                    className="p-1 rounded border border-border text-muted hover:text-danger hover:border-danger cursor-pointer shrink-0 active:scale-90 transition-all duration-150"
                    title="Remove from compare"
                  >
                    <XIcon size={12} />
                  </button>
                </div>

                {/* Compare Typography Canvas */}
                <div className="p-4 sm:p-5 flex-1 min-h-[130px] sm:min-h-[150px] flex items-center justify-center bg-panel/10 overflow-hidden">
                  <div
                    style={{
                      fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui`,
                      fontSize: `${settings.fontSize}px`,
                      lineHeight: settings.lineHeight,
                      letterSpacing: `${settings.letterSpacing}px`,
                      textAlign: settings.alignment,
                      textTransform: settings.transform !== "none" ? settings.transform : undefined,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                    className="text-text break-words w-full"
                  >
                    {settings.sampleText}
                  </div>
                </div>

                {/* Footer specs */}
                <div className="px-3.5 py-2 border-t border-border bg-panel/30 flex items-center justify-between text-[10px] font-mono text-muted">
                  <span>Weight: {font.weight || 400}</span>
                  <span className="text-primary font-semibold">Synced</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
