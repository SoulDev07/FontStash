import { useEffect, useState } from "react";
import { useFontStore } from "@/stores/useFontStore";
import {
  readFileAsArrayBuffer,
  detectFormatFromName,
  registerFontFaceFromBuffer,
  uid,
  generateFontFamily,
} from "@/utils/fontUtils";
import { parseFontMetadata } from "@/utils/fontMetadata";
import { CloudArrowUpIcon } from "@phosphor-icons/react";

export default function DragDropOverlay() {
  const [isDragging, setIsDragging] = useState(false);
  const { addCustomFont, showToast } = useFontStore();

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer.types.includes("Files")) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragging(false);

      const files = Array.from(e.dataTransfer?.files || []);
      const fontFiles = files.filter((f) => /\.(ttf|otf|woff|woff2)$/i.test(f.name));

      if (fontFiles.length === 0) return;

      let ingestedCount = 0;

      for (const file of fontFiles) {
        try {
          const buffer = await readFileAsArrayBuffer(file);
          const format = detectFormatFromName(file.name);
          const fontId = uid();
          const fontFamily = generateFontFamily(file.name.replace(/\.[^.]+$/, ""), fontId);

          await registerFontFaceFromBuffer(fontFamily, buffer, format);

          const parsedMeta = parseFontMetadata(buffer, file.name, Date.now());

          const newFont = {
            ...parsedMeta,
            id: fontId,
            fontFamily,
            buffer,
            size: file.size,
            isCustom: true,
          };

          await addCustomFont(newFont);
          ingestedCount++;
        } catch (err) {
          console.error("Failed to ingest font", file.name, err);
        }
      }

      if (ingestedCount > 0) {
        showToast(`Ingested ${ingestedCount} font file${ingestedCount > 1 ? "s" : ""} to local playground`);
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [addCustomFont, showToast]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md border-4 border-dashed border-primary flex flex-col items-center justify-center p-8 text-center animate-backdrop pointer-events-none">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center mb-4 animate-pulse-subtle shadow-xl shadow-primary/20">
        <CloudArrowUpIcon size={32} weight="bold" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
        Drop Font Files to Ingest
      </h2>
      <p className="text-xs text-gray-400 max-w-sm">
        Release TTF, OTF, WOFF, or WOFF2 files to register them in your private local sandbox.
      </p>
    </div>
  );
}

