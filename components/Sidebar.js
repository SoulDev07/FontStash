import { useEffect, useMemo, useRef, useState } from "react";
import { SidebarSimpleIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

export default function Sidebar({ fonts, onSelect }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const areaRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!areaRef.current) return;
      const nearLeft = e.clientX <= 16;
      if (nearLeft) setOpen(true);
      else if (open && e.clientX > 300) setOpen(false);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [open]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return fonts;
    return fonts.filter((f) => f.originalName.toLowerCase().includes(q) || f.fontFamily.toLowerCase().includes(q));
  }, [fonts, filter]);

  return (
    <aside
      ref={areaRef}
      className="fixed left-0 top-0 bottom-0 z-20 group"
      style={{ width: open ? 280 : 0, transition: "width 220ms ease" }}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="h-full bg-[color-mix(in_oklab,var(--bg),white_4%)] border-r border-border overflow-hidden flex flex-col sidebar-chrome">
        <div className="px-3 pt-3 pb-2 text-xs text-muted flex items-center justify-between">
          <span className="inline-flex items-center gap-1">
            <SidebarSimpleIcon size={14} /> Fonts
          </span>
          <span className="text-[11px] text-muted">{filtered.length}</span>
        </div>
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 bg-card border border-border rounded-md px-2 py-1">
            <MagnifyingGlassIcon size={12} className="text-muted" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter"
              className="bg-transparent outline-none text-xs flex-1"
            />
          </div>
        </div>
        <div className="px-2 pb-4 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100% - 5.25rem)" }}>
          {filtered.map((f) => (
            <button
              key={f.id}
              className="w-full text-left px-2 py-2 rounded-md hover:bg-[color-mix(in_oklab,var(--card),white_3%)] border border-transparent hover:border-border truncate relative sidebar-item"
              style={{ fontFamily: `'${f.fontFamily}', ui-sans-serif, system-ui` }}
              onClick={() => onSelect(f)}
              title={f.originalName}
            >
              {f.originalName}
            </button>
          ))}
          {filtered.length === 0 && <div className="px-2 py-2 text-sm text-muted">No matches</div>}
        </div>
      </div>
    </aside>
  );
}
