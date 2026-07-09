import { MagnifyingGlassIcon, PencilSimpleIcon } from "@phosphor-icons/react";

export default function PreviewControls({ query, setQuery, sample, setSample }) {
  return (
    <div className="md:hidden grid gap-3 mb-4 animate-pop">
      <div className="glass-input">
        <MagnifyingGlassIcon size={14} className="text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fonts" className="input-inner flex-1" />
      </div>
      <div className="glass-input">
        <PencilSimpleIcon size={14} className="text-muted" />
        <input value={sample} onChange={(e) => setSample(e.target.value)} placeholder="Sample text" className="input-inner flex-1" />
      </div>
    </div>
  );
}
