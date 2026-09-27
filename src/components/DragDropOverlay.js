import { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { CloudArrowUpIcon } from "@phosphor-icons/react";
import { useFontIngest } from "@/hooks/useFontIngest";

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
    window.addEventListener("fontstash:open-file-picker", handleOpenPicker);
    return () => {
      window.removeEventListener("fontstash:open-file-picker", handleOpenPicker);
    };
  }, []);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
    e.target.value = "";
  };

  const isDraggingFiles = isOver && canDrop;

  return (
    <div ref={dropRef} className="min-h-screen bg-bg text-text selection:bg-text selection:text-bg">
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md border-4 border-dashed border-primary flex flex-col items-center justify-center p-8 text-center animate-backdrop select-none pointer-events-auto">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl bg-primary/20 text-primary border border-primary/40 shadow-primary/20 animate-pulse-subtle">
            <CloudArrowUpIcon size={32} weight="bold" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
            Drop Font Files to Add
          </h2>
          <p className="text-xs text-gray-400 max-w-sm">
            Release TTF, OTF, WOFF, or WOFF2 files to load them into your library.
          </p>
        </div>
      )}
    </div>
  );
}
