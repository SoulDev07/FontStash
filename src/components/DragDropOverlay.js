import { CloudArrowUpIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

import { useFontIngest } from '@/hooks/useFontIngest';

export default function DragDropOverlay({ children }) {
  const { processFiles } = useFontIngest();
  const fileInputRef = useRef(null);

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item, monitor) {
        if (monitor.didDrop()) return;
        if (item?.files && item.files.length > 0) {
          processFiles(item.files);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: false }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [processFiles]
  );

  useEffect(() => {
    const handleOpenPicker = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
    window.addEventListener('fontstash:open-file-picker', handleOpenPicker);
    return () => {
      window.removeEventListener('fontstash:open-file-picker', handleOpenPicker);
    };
  }, []);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
    e.target.value = '';
  };

  const isDraggingFiles = isOver && canDrop;

  return (
    <div ref={dropRef} className="bg-bg text-text selection:bg-text selection:text-bg min-h-screen">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".ttf,.otf,.woff,.woff2,font/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {children}

      {isDraggingFiles && (
        <div className="border-primary animate-backdrop pointer-events-auto fixed inset-0 z-50 flex flex-col items-center justify-center border-4 border-dashed bg-black/85 p-8 text-center backdrop-blur-md select-none">
          <div className="bg-primary/20 text-primary border-primary/40 shadow-primary/20 animate-pulse-subtle mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-xl">
            <CloudArrowUpIcon size={32} weight="bold" />
          </div>
          <h2 className="mb-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Drop Font Files to Add
          </h2>
          <p className="max-w-sm text-xs text-gray-400">
            Release TTF, OTF, WOFF, or WOFF2 files to load them into your library.
          </p>
        </div>
      )}
    </div>
  );
}
