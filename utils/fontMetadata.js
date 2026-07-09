export const ALLOWED_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2"];

export function parseFontFilename(name, idx) {
  const url = `/fonts/${name}`;
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const format = ext === "ttf" ? "truetype" : ext === "otf" ? "opentype" : ext;
  const base = name.replace(/\.[^.]+$/, "");
  const id = `${base}-${idx}`;
  const fontFamily = `${base.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 24) || "Font"}-${idx}`;

  return {
    id,
    originalName: name,
    url,
    format,
    fontFamily,
  };
}

export function getFontsMetaFromFiles(files = []) {
  return files
    .filter((f) => ALLOWED_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)))
    .map((name, idx) => parseFontFilename(name, idx));
}
