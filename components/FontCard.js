export default function FontCard({ font, text = "The quick brown fox jumps over the lazy dog" }) {
  const { fontFamily, originalName } = font;

  return (
    <div className="card font-card p-4 flex flex-col gap-3 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ background: "linear-gradient(135deg, var(--primary), transparent)" }}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm text-muted truncate" title={originalName}>
          {originalName}
        </div>
      </div>

      <div className="rounded-lg border border-border p-4 bg-[color-mix(in_oklab,var(--card),white_3%)] sample">
        <div className="text-xl md:text-2xl leading-snug" style={{ fontFamily: `'${fontFamily}', ui-sans-serif, system-ui` }}>
          {text}
        </div>
      </div>
      <div className="text-xs text-muted">font-family: &apos;{fontFamily}&apos;</div>
    </div>
  );
}
