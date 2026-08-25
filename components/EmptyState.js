import { FolderOpenIcon } from "@phosphor-icons/react";

export default function EmptyState() {
  const supportedFormats = ["TTF", "OTF", "WOFF", "WOFF2"];

  return (
    <div className="card p-12 flex flex-col items-center justify-center text-center gap-6 min-h-[360px] rounded-2xl border-dashed border-2 border-border/70 bg-panel/30 backdrop-blur-xl">
      {/* Glyph illustration */}
      <div className="relative select-none">
        <div className="text-[84px] font-serif text-primary/20 leading-none tracking-tighter">
          Aa
        </div>
        <div className="absolute -bottom-1 -right-3 p-2.5 rounded-xl bg-primary/15 border border-primary/30 shadow-xs">
          <FolderOpenIcon size={22} className="text-primary" />
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-sm">
        <h3 className="text-lg font-bold text-text font-heading mb-1.5">
          No font files found
        </h3>
        <p className="text-xs text-muted leading-relaxed">
          Drop your typography files into the{" "}
          <code className="text-xs font-mono bg-border/40 px-2 py-0.5 rounded-md text-text font-semibold">
            public/fonts
          </code>{" "}
          directory to live inspect and test them.
        </p>
      </div>

      {/* Supported formats */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">Supports:</span>
        {supportedFormats.map((fmt) => (
          <span
            key={fmt}
            className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-card border border-border/70 text-muted"
          >
            {fmt}
          </span>
        ))}
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md mt-2">
        {[
          { step: "1", label: "Add font files to public/fonts" },
          { step: "2", label: "Refresh or restart dev server" },
          { step: "3", label: "Live inspect across themes" },
        ].map((item) => (
          <div
            key={item.step}
            className="flex items-center gap-2.5 bg-card/80 border border-border/70 rounded-xl px-3.5 py-2.5 shadow-2xs"
          >
            <span className="text-[11px] font-bold text-primary bg-primary/15 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border border-primary/20">
              {item.step}
            </span>
            <span className="text-xs font-medium text-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

