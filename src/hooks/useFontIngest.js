import { useCallback } from 'react';

import { useFontStore } from '@/lib/store/useFontStore';
import { parseFontMetadata } from '@/lib/utils/fontMetadata';
import {
  readFileAsArrayBuffer,
  detectFormatFromName,
  registerFontFaceFromBuffer,
  uid,
  generateFontFamily,
} from '@/lib/utils/fontUtils';

export const SUPPORTED_EXTS = ['.ttf', '.otf', '.woff', '.woff2'];

export function useFontIngest() {
  const { addCustomFont, showToast } = useFontStore();

  const processFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;

      const fileList = Array.from(files);
      const validFiles = [];
      const invalidFiles = [];

      for (const file of fileList) {
        const name = (file.name || '').toLowerCase();
        if (SUPPORTED_EXTS.some((ext) => name.endsWith(ext))) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file);
        }
      }

      if (validFiles.length === 0 && invalidFiles.length > 0) {
        showToast(
          'Unsupported file format. Please drop .ttf, .otf, .woff, or .woff2 files.',
          'error'
        );
        return;
      }

      if (invalidFiles.length > 0) {
        showToast(`Skipped ${invalidFiles.length} unsupported file(s). Adding fonts...`, 'warning');
      }

      let count = 0;

      for (const file of validFiles) {
        try {
          const buffer = await readFileAsArrayBuffer(file);
          const format = detectFormatFromName(file.name);
          const fontId = uid();
          const cleanStem = file.name.replace(/\.[^.]+$/, '');
          const fontFamily = generateFontFamily(cleanStem, fontId);

          // Use buffer.slice(0) to prevent FontFace from detaching the ArrayBuffer
          await registerFontFaceFromBuffer(fontFamily, buffer.slice(0), format);

          // Parse metadata using buffer slice
          const parsedMeta = await parseFontMetadata(buffer.slice(0), file.name, Date.now());

          const newFont = {
            ...parsedMeta,
            id: fontId,
            fontFamily,
            buffer,
            size: file.size,
            isCustom: true,
          };

          await addCustomFont(newFont);
          count++;
        } catch (err) {
          console.error('Failed to add font', file.name, err);
        }
      }

      if (count > 0) {
        showToast(`Added ${count} font file${count > 1 ? 's' : ''}`);
      }
    },
    [addCustomFont, showToast]
  );

  return { processFiles };
}
