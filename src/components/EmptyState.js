import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { FolderOpenIcon, CloudArrowUpIcon } from "@phosphor-icons/react";
import { useFontIngest } from "@/hooks/useFontIngest";

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
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("fontstash:open-file-picker"));
    }
  };

  const isDragActive = isOver && canDrop;

  return (
    <div
      ref={dropRef}
      onClick={handleOpenPicker}
      className={`card p-12 sm:p-16 flex flex-col items-center justify-center text-center gap-4 min-h-[300px] rounded-2xl border-dashed border-2 cursor-pointer transition-all duration-200 group select-none ${
        isDragActive
          ? "border-primary bg-primary/15 shadow-xl shadow-primary/10 scale-[1.01]"
          : "border-border/80 bg-panel/20 backdrop-blur-xl hover:border-text/40"
      }`}
      title="Click or drop font files to import"
    >
      <div
        className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-200 ${
          isDragActive
            ? "bg-primary text-bg border-primary scale-110"
            : "bg-panel border-border group-hover:scale-105"
        }`}
      >
        {isDragActive ? (
          <CloudArrowUpIcon size={28} weight="bold" />
        ) : (
          <FolderOpenIcon size={28} className="text-muted group-hover:text-text transition-colors" />
        )}
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-medium text-text tracking-tight font-sans">
          {isDragActive ? "Drop font files to add" : "No typefaces found"}
        </h3>
        <p className="text-sm text-muted">
          Drag &amp; drop font files here or{" "}
          <span className="text-text underline underline-offset-4 font-medium">browse to upload</span>
        </p>
        <p className="text-xs font-mono text-muted/70">
          Supports .ttf, .otf, .woff, .woff2 &bull; Private &amp; Offline
        </p>
      </div>
    </div>
  );
}
