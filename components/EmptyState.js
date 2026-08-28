import { FolderOpenIcon } from "@phosphor-icons/react";

export default function EmptyState() {
  const supportedFormats = ["TTF", "OTF", "WOFF", "WOFF2"];

  return (
    <div className="card p-12 sm:p-16 flex flex-col items-center justify-center text-center gap-6 min-h-[400px] rounded-2xl border-dashed border-2 border-border/80 bg-panel/20 backdrop-blur-xl">
      {/* Glyph illustration */}
      <div className="relative select-none">
        <div className="text-[96px] font-serif text-muted/20 leading-none tracking-tighter">
          Aa
        </div>
        <div className="absolute -bottom-1 -right-3 p-3 rounded-xl bg-panel border border-border text-text shadow-sm">
          <FolderOpenIcon size={22} />
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-md space-y-2">
        <h3 className="text-xl font-bold text-text tracking-tight font-sans">
          No typefaces found
        </h3>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Drop your typography files anywhere onto this window or place them into the{" "}
          <code className="text-xs font-mono bg-panel border border-border px-2 py-0.5 rounded-md text-text font-semibold">
            public/fonts
          </code>{" "}
          directory to live inspect and test them.
        </p>
      </div>

      {/* Supported formats */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-[10px] text-muted font-semibold uppercase tracking-wider font-mono">Supports:</span>
        {supportedFormats.map((fmt) => (
          <span
            key={fmt}
            className="text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-card border border-border text-text"
          >
            {fmt}
          </span>
        ))}
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-lg mt-2">
        {[
          { step: "1", label: "Drag & drop font files" },
          { step: "2", label: "Private IndexedDB store" },
          { step: "3", label: "Live test & compare" },
        ].map((item) => (
          <div
            key={item.step}
            className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-2xs hover:border-text/40 transition-all duration-150 text-left"
          >
            <span className="text-xs font-bold text-bg bg-primary w-6 h-6 rounded-md flex items-center justify-center shrink-0">
              {item.step}
            </span>
            <span className="text-xs font-medium text-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
