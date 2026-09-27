import opentype from "opentype.js";

export const ALLOWED_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2"];

const WEIGHTS = [
  ["thin", 100], ["extralight", 200], ["ultralight", 200], ["light", 300],
  ["regular", 400], ["book", 400], ["medium", 500], ["semibold", 600],
  ["demibold", 600], ["bold", 700], ["extrabold", 800], ["black", 900],
  ["heavy", 900],
];

function extractNameValue(names, key) {
  if (!names) return "";
  const entry = (names.windows && names.windows[key]) || (names.macintosh && names.macintosh[key]) || names[key];
  if (!entry) return "";
  if (typeof entry === "string") return entry.trim();
  const val = entry.en || Object.values(entry)[0];
  return typeof val === "string" ? val.trim() : "";
}

export async function parseFontMetadata(buffer, filename, index = 0) {
  const normalizedPath = filename.replace(/\\/g, "/");
  const baseName = normalizedPath.split("/").pop() || filename;
  const extension = baseName.split(".").pop().toLowerCase();
  const originalName = baseName;
  const stem = baseName.replace(/\.[^.]+$/, "");
  const tokens = stem.split(/[-_\s]+/).filter(Boolean);
  const styleToken = tokens.find((token) => /italic|oblique/i.test(token));
  const weightEntry = WEIGHTS.find(([label]) => new RegExp(label, "i").test(stem));
  const familyTokens = tokens.filter((token) => !/thin|light|regular|book|medium|semi|demi|bold|black|heavy|italic|oblique|variable/i.test(token));
  const fallbackFamily = familyTokens.join(" ") || stem;
  const formatLabel = extension.toUpperCase();
  const format = extension === "ttf" ? "truetype" : extension === "otf" ? "opentype" : extension;

  let metadata = {
    id: `${stem.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}-${index}`,
    originalName,
    url: `/fonts/${normalizedPath}`,
    extension,
    format,
    formatLabel,
    family: fallbackFamily,
    style: styleToken ? "Italic" : "Normal",
    weight: weightEntry ? weightEntry[1] : 400,
    fontFamily: `${stem.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 32) || "Font"}-${index}`,
    index,
  };

  if (buffer) {
    try {
      let arrayBuffer = buffer instanceof ArrayBuffer ? buffer : buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

      if (extension === "woff2") {
        try {
          const woff2Module = await import("woff2-encoder/decompress");
          const decompress = woff2Module.default || woff2Module.decompress;
          if (typeof decompress === "function") {
            const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(arrayBuffer);
            const decompressed = await decompress(uint8);
            if (decompressed && decompressed.buffer) {
              arrayBuffer = decompressed.buffer.slice(
                decompressed.byteOffset,
                decompressed.byteOffset + decompressed.byteLength
              );
            }
          }
        } catch (decompErr) {
          console.warn("WOFF2 WebAssembly decompression skipped or failed:", decompErr);
        }
      }

      const font = opentype.parse(arrayBuffer);
      const names = font.names;

      const family = extractNameValue(names, "preferredFamily") || extractNameValue(names, "fontFamily") || metadata.family;
      const subfamily = extractNameValue(names, "preferredSubfamily") || extractNameValue(names, "fontSubfamily");
      const designer = extractNameValue(names, "designer");
      const designerURL = extractNameValue(names, "designerURL");
      const manufacturer = extractNameValue(names, "manufacturer");
      const vendorURL = extractNameValue(names, "vendorURL");
      const copyright = extractNameValue(names, "copyright");
      const license = extractNameValue(names, "license");
      const licenseURL = extractNameValue(names, "licenseURL");
      const version = extractNameValue(names, "version");
      const weight = (font.tables && font.tables.os2 && font.tables.os2.usWeightClass) || metadata.weight;

      metadata = {
        ...metadata,
        family,
        subfamily: subfamily || metadata.style,
        style: subfamily && /italic|oblique/i.test(subfamily) ? "Italic" : metadata.style,
        weight,
        designer,
        designerURL,
        manufacturer,
        vendorURL,
        copyright,
        license,
        licenseURL,
        version,
        numGlyphs: font.numGlyphs || 0,
        unitsPerEm: font.unitsPerEm || 0,
      };
    } catch {
    }
  }

  return metadata;
}

export async function getFontsMetaFromFiles(files = [], baseDir = "") {
  let fs;
  let path;
  if (typeof window === "undefined" && baseDir) {
    try {
      fs = await import("node:fs");
      path = await import("node:path");
    } catch {}
  }

  const validFiles = files.filter((file) =>
    ALLOWED_EXTENSIONS.some((extension) => file.toLowerCase().endsWith(extension))
  );

  return Promise.all(
    validFiles.map(async (file, index) => {
      let buffer;
      if (fs && path && baseDir) {
        try {
          const fullPath = path.join(baseDir, file);
          if (fs.existsSync(fullPath) && !fs.statSync(fullPath).isDirectory()) {
            buffer = fs.readFileSync(fullPath);
          }
        } catch {}
      }
      return parseFontMetadata(buffer, file, index);
    })
  );
}
