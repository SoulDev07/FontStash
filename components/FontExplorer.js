import FontRow from "@/components/FontRow";
import FontCard from "@/components/FontCard";

export default function FontExplorer({ fonts, viewMode, sampleText }) {
  if (viewMode === "list") {
    return (
      <div className="rounded-xl overflow-hidden border border-border/60 fade-in">
        {fonts.map((font, i) => (
          <div id={`font-${font.id}`} key={font.id} className={i % 2 === 0 ? "bg-card/30" : "bg-transparent"}>
            <FontRow font={font} text={sampleText} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 view-toggle">
      {fonts.map((font) => (
        <div id={`font-${font.id}`} key={font.id} className="view-item">
          <FontCard font={font} text={sampleText} />
        </div>
      ))}
    </div>
  );
}
