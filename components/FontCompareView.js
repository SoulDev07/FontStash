import { useFontStore } from "@/stores/useFontStore";
import { XIcon, PlusIcon, SparkleIcon } from "@phosphor-icons/react";

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
    <div className="space-y-4 animate-pop">
      {/* Compare Header Controls */}
      <div className="rounded border border-border bg-card p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-xs font-mono">
            {comparedFonts.length}
          </span>
          <div>
            <h2 className="text-sm font-bold text-text">
              Compare Workbench
            </h2>
            <p className="text-[11px] text-muted font-mono">
              Comparing {comparedFonts.length}/4 fonts side by side with synchronized metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {comparedFonts.length > 0 && (
            <button
              onClick={clearCompare}
              className="btn text-xs px-2.5 py-1 rounded border border-border text-muted hover:text-danger hover:border-danger cursor-pointer"
            >
              Clear
            </button>
          )}

          {availableFonts.length > 0 && comparedFonts.length < 4 && (
            <div className="relative group">
              <button className="btn btn-primary text-xs px-3 py-1 rounded inline-flex items-center gap-1 cursor-pointer">
                <PlusIcon size={13} weight="bold" />
                <span>Add Font</span>
              </button>

              <div className="absolute right-0 mt-1 w-52 rounded border border-border bg-card p-1.5 hidden group-hover:block group-focus-within:block z-30 animate-pop">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 py-1 mb-1">
                  Select Font
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {availableFonts.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => toggleCompare(f.id)}
                      className="w-full text-left px-2 py-1 text-xs rounded text-text hover:bg-panel flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{f.originalName?.replace(/\.[^.]+$/, "")}</span>
                      <span className="text-[10px] font-mono text-muted">{f.formatLabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {comparedFonts.length === 0 ? (
        <div className="rounded border-2 border-dashed border-border bg-card/30 p-10 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded bg-panel text-primary flex items-center justify-center border border-border">
            <SparkleIcon size={20} weight="fill" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text mb-0.5">No fonts in compare workbench</h3>
            <p className="text-xs text-muted max-w-sm">
              Click the compare icon on any font card or click &quot;Add Font&quot; above to inspect typefaces side by side.
            </p>
          </div>
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${comparedFonts.length === 2 ? "md:grid-cols-2" : comparedFonts.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"} gap-4`}>
          {comparedFonts.map((font) => {
            const cleanTitle = font.originalName.replace(/\.[^.]+$/, "");
            return (
              <div
                key={font.id}
                className="rounded border border-border bg-card flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="p-3 border-b border-border bg-panel/30 flex items-center justify-between">
                  <div className="truncate min-w-0 pr-2">
                    <h3 className="text-xs font-bold text-text truncate" title={cleanTitle}>
                      {cleanTitle}
                    </h3>
                    <span className="text-[10px] font-mono text-muted">
                      {font.formatLabel} &bull; {font.license}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleCompare(font.id)}
                    className="p-1 rounded border border-border text-muted hover:text-danger hover:border-danger cursor-pointer shrink-0"
                    title="Remove from compare"
                  >
                    <XIcon size={13} />
                  </button>
                </div>

                {/* Compare Typography Canvas */}
                <div className="p-5 flex-1 min-h-[160px] flex items-center justify-center bg-panel/10">
                  <div
                    style={{
                      fontFamily: `'${font.fontFamily}', ui-sans-serif, system-ui`,
                      fontSize: `${settings.fontSize}px`,
                      lineHeight: settings.lineHeight,
                      letterSpacing: `${settings.letterSpacing}px`,
                      textAlign: settings.alignment,
                      textTransform: settings.transform !== "none" ? settings.transform : undefined,
                    }}
                    className="text-text break-words w-full"
                  >
                    {settings.sampleText}
                  </div>
                </div>

                {/* Footer specs */}
                <div className="p-2.5 border-t border-border bg-panel/30 flex items-center justify-between text-[10px] font-mono text-muted">
                  <span>Weight: {font.weight}</span>
                  <span className="text-primary font-medium">Synced</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
