import { useState, useCallback } from 'react';

import { useFontStore } from '@/lib/store/useFontStore';

export function useFontExport(targetRef, options = {}) {
  const [exporting, setExporting] = useState(false);
  const showToast = useFontStore((state) => state.showToast);

  const exportPng = useCallback(
    async (fallbackName = 'font-specimen') => {
      if (!targetRef.current || exporting) return;

      setExporting(true);
      showToast('Generating high-res PNG export...');

      try {
        const { domToPng } = await import('modern-screenshot');

        const dataUrl = await domToPng(targetRef.current, {
          scale: 2,
          quality: 1,
          ...options,
        });

        const safeName = (fallbackName || 'export')
          .toLowerCase()
          .replace(/[^a-z0-9_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        const filename = `${safeName}.png`;

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`Exported ${filename}`);
      } catch (err) {
        console.error('PNG export failed:', err);
        showToast('Export failed. Please try again.', 'error');
      } finally {
        setExporting(false);
      }
    },
    [targetRef, exporting, showToast, options]
  );

  return { exportPng, exporting };
}
