import { FolderOpenIcon, CloudArrowUpIcon } from '@phosphor-icons/react';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

import { useFontIngest } from '@/hooks/useFontIngest';

export default function EmptyState() {
  const { processFiles } = useFontIngest();

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop: (item, monitor) => {
        if (monitor.didDrop()) return;
        if (item?.files && item.files.length > 0) {
          processFiles(item.files);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [processFiles]
  );

  const handleOpenPicker = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fontstash:open-file-picker'));
    }
  };

  const isDragActive = isOver && canDrop;

  return (
    <div
      ref={dropRef}
      onClick={handleOpenPicker}
      className={`card group flex min-h-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 select-none sm:p-16 ${
        isDragActive
          ? 'border-primary bg-primary/15 shadow-primary/10 scale-[1.01] shadow-xl'
          : 'border-border/80 bg-panel/20 hover:border-text/40 backdrop-blur-xl'
      }`}
      title="Click or drop font files to import"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-200 ${
          isDragActive
            ? 'bg-primary text-bg border-primary scale-110'
            : 'bg-panel border-border group-hover:scale-105'
        }`}
      >
        {isDragActive ? (
          <CloudArrowUpIcon size={28} weight="bold" />
        ) : (
          <FolderOpenIcon
            size={28}
            className="text-muted group-hover:text-text transition-colors"
          />
        )}
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-text font-sans text-lg font-medium tracking-tight">
          {isDragActive ? 'Drop font files to add' : 'No typefaces found'}
        </h3>
        <p className="text-muted text-sm">
          Drag &amp; drop font files here or{' '}
          <span className="text-text font-medium underline underline-offset-4">
            browse to upload
          </span>
        </p>
        <p className="text-muted/70 font-mono text-xs">
          Supports .ttf, .otf, .woff, .woff2 &bull; Private &amp; Offline
        </p>
      </div>
    </div>
  );
}
