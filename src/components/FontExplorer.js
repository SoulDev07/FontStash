import FontCard from '@/components/FontCard';
import FontRow from '@/components/FontRow';

export default function FontExplorer({ fonts, viewMode, settings }) {
  if (viewMode === 'list') {
    return (
      <div className="card border-border overflow-hidden rounded border shadow-xs">
        <div className="border-border bg-panel/70 hidden min-w-210 items-center border-b px-4 py-2.5 select-none md:flex">
          <div className="text-muted w-72 shrink-0 font-mono text-[10px] font-bold tracking-wider uppercase">
            Family & Details
          </div>
          <div className="text-muted flex-1 px-3 font-mono text-[10px] font-bold tracking-wider uppercase">
            Typography Live Sample
          </div>
          <div className="text-muted w-36 shrink-0 pr-2 text-right font-mono text-[10px] font-bold tracking-wider uppercase">
            Actions
          </div>
        </div>
        <div className="divide-border divide-y">
          {fonts.map((font) => (
            <FontRow
              key={font.id}
              id={`font-${font.id}`}
              font={font}
              text={settings.sampleText}
              settings={settings}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-3">
      {fonts.map((font) => (
        <FontCard
          key={font.id}
          id={`font-${font.id}`}
          font={font}
          text={settings.sampleText}
          settings={settings}
        />
      ))}
    </div>
  );
}
