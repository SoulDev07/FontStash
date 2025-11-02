import { useMemo } from "react";

export default function FontRow({ font, text }) {
  const { fontFamily, originalName } = font;
  const preview = useMemo(() => text?.trim() || "The quick brown fox jumps over the lazy dog", [text]);

  return (
    <div className="group w-full border-b border-border/60 hover:bg-[color-mix(in_oklab,var(--card),white_3%)] transition-colors">
      <div className="flex items-center gap-6 px-3 py-4">
        <div
          className="min-w-[220px] shrink-0 truncate text-sm text-muted"
          style={{ fontFamily: `'${fontFamily}', ui-sans-serif, system-ui` }}
          title={originalName}
        >
          {originalName}
        </div>
        <div className="flex-1 text-lg md:text-xl leading-snug" style={{ fontFamily: `'${fontFamily}', ui-sans-serif, system-ui` }}>
          {preview}
        </div>
      </div>
    </div>
  );
}
