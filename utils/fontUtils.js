// Utilities for handling font files, registering @font-face, and persistence
import { loadFromLocalStorage, saveToLocalStorage } from "./localStorageUtils";

const FONTS_STORAGE_KEY = "font-stash:fonts";

export function loadStoredFonts() {
  return loadFromLocalStorage(FONTS_STORAGE_KEY, []);
}

export function saveStoredFonts(fonts) {
  saveToLocalStorage(FONTS_STORAGE_KEY, fonts);
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Generate a CSS-safe font-family name derived from file name and id
export function generateFontFamily(baseName, id) {
  const clean = (baseName || "Font").replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 24) || "Font";
  return `${clean}-${id}`;
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Map file extension to @font-face format
export function detectFormatFromName(name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ttf":
      return "truetype";
    case "otf":
      return "opentype";
    case "woff":
      return "woff";
    case "woff2":
      return "woff2";
    default:
      return "truetype";
  }
}

export function registerFontFace(fontFamily, dataUrl, format = "truetype") {
  const styleId = `font-face-${fontFamily}`;
  if (typeof document === "undefined" || document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `@font-face { font-family: '${fontFamily}'; src: url('${dataUrl}') format('${format}'); font-display: swap; }`;
  document.head.appendChild(style);
}

export function rehydrateFonts() {
  const fonts = loadStoredFonts();
  fonts.forEach((f) => {
    try {
      registerFontFace(f.fontFamily, f.dataUrl, f.format || "truetype");
    } catch {}
  });
}

export function unregisterFontFace(fontFamily) {
  const styleId = `font-face-${fontFamily}`;
  const el = document.getElementById(styleId);
  if (el) el.remove();
}
