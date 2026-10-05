export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function generateFontFamily(baseName, id) {
  const clean = (baseName || 'Font').replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 24) || 'Font';
  return `${clean}-${id}`;
}

export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function detectFormatFromName(name = '') {
  const ext = name.split('.').pop().toLowerCase();
  switch (ext) {
    case 'ttf':
      return 'truetype';
    case 'otf':
      return 'opentype';
    case 'woff':
      return 'woff';
    case 'woff2':
      return 'woff2';
    default:
      return 'truetype';
  }
}

export function createBlobUrlFromBuffer(buffer, format = 'woff2') {
  const mimeType =
    format === 'woff2'
      ? 'font/woff2'
      : format === 'woff'
        ? 'font/woff'
        : format === 'opentype'
          ? 'font/otf'
          : 'font/ttf';
  const blob = new Blob([buffer], { type: mimeType });
  return URL.createObjectURL(blob);
}

export async function registerFontFaceFromBuffer(fontFamily, buffer, format = 'truetype') {
  if (typeof document === 'undefined') return;

  if (typeof window !== 'undefined' && window.FontFace) {
    try {
      const fontFace = new FontFace(fontFamily, buffer);
      await fontFace.load();
      document.fonts.add(fontFace);
      return;
    } catch {}
  }

  const blobUrl = createBlobUrlFromBuffer(buffer, format);
  registerFontFace(fontFamily, blobUrl, format);
}

export function registerFontFace(fontFamily, url, format = 'truetype') {
  const styleId = `font-face-${fontFamily}`;
  if (typeof document === 'undefined' || document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `@font-face { font-family: '${fontFamily}'; src: url('${url}') format('${format}'); font-display: swap; }`;
  document.head.appendChild(style);
}

export function unregisterFontFace(fontFamily) {
  const styleId = `font-face-${fontFamily}`;
  const el = document.getElementById(styleId);
  if (el) el.remove();

  if (typeof document !== 'undefined' && document.fonts) {
    for (const font of document.fonts) {
      if (font.family === fontFamily) {
        document.fonts.delete(font);
      }
    }
  }
}
