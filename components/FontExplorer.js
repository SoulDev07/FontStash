import FontRow from "@/components/FontRow";
import FontCard from "@/components/FontCard";

export default function FontExplorer({ fonts, viewMode, settings }) {
  if (viewMode === "list") {
    return (
      <div className="card rounded border border-border overflow-hidden shadow-xs">
        {/* List table header - Desktop only */}
        <div className="hidden md:flex min-w-[840px] items-center px-4 py-2.5 border-b border-border bg-panel/70 select-none">
          <div className="w-72 shrink-0 text-[10px] font-mono font-bold text-muted uppercase tracking-wider">
            Family & Details
          </div>
          <div className="flex-1 px-3 text-[10px] font-mono font-bold text-muted uppercase tracking-wider">
            Typography Live Sample
          </div>
          <div className="w-36 shrink-0 text-[10px] font-mono font-bold text-muted uppercase tracking-wider text-right pr-2">
            Actions
          </div>
        </div>
        <div className="divide-y divide-border">
          {fonts.map((font) => (
            <div id={`font-${font.id}`} key={font.id}>
              <FontRow font={font} text={settings.sampleText} settings={settings} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 view-toggle">
      {fonts.map((font) => (
        <div id={`font-${font.id}`} key={font.id} className="view-item">
          <FontCard font={font} text={settings.sampleText} settings={settings} />
        </div>
      ))}
    </div>
  );
}
