import opentype from "opentype.js";

export const ALLOWED_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2"];

const WEIGHTS = [
  ["thin", 100], ["extralight", 200], ["ultralight", 200], ["light", 300],
  ["regular", 400], ["book", 400], ["medium", 500], ["semibold", 600],
  ["demibold", 600], ["bold", 700], ["extrabold", 800], ["black", 900],
  ["heavy", 900],
];

function extractNameValue(names, key) {
  if (!names) return undefined;
  const entry = (names.windows && names.windows[key]) || (names.macintosh && names.macintosh[key]) || names[key];
  if (!entry) return undefined;
  if (typeof entry === "string") return entry.trim() || undefined;
  if (typeof entry === "object") {
    const val = entry.en || Object.values(entry)[0];
    return typeof val === "string" ? val.trim() || undefined : undefined;
  }
  return undefined;
}

function cleanObject(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

export function parseFontMetadata(buffer, filename, index = 0) {
  const normalizedPath = filename.replace(/\\/g, "/");
  const baseName = normalizedPath.split("/").pop() || filename;
  const extension = baseName.split(".").pop()?.toLowerCase() || "";
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
    weight: weightEntry?.[1] ?? 400,
    fontFamily: `${stem.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 32) || "Font"}-${index}`,
    index,
  };

  if (buffer) {
    try {
      const arrayBuffer = buffer instanceof ArrayBuffer ? buffer : buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
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
      const weight = font.tables?.os2?.usWeightClass || metadata.weight;

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
        numGlyphs: font.numGlyphs || undefined,
        unitsPerEm: font.unitsPerEm || undefined,
      };
    } catch {
      // If binary parsing fails (e.g. WOFF2 or invalid format), retain clean filename-based metadata without hardcoded attributes
    }
  }

  return cleanObject(metadata);
}

export function parseFontFilename(name, index) {
  return parseFontMetadata(null, name, index);
}

export function getFontsMetaFromFiles(files = [], baseDir = null) {
  let fs = null;
  let path = null;
  if (typeof window === "undefined" && baseDir) {
    try {
      fs = require("node:fs");
      path = require("node:path");
    } catch {}
  }

  return files
    .filter((file) => ALLOWED_EXTENSIONS.some((extension) => file.toLowerCase().endsWith(extension)))
    .map((file, index) => {
      let buffer = null;
      if (fs && path && baseDir) {
        try {
          const fullPath = path.join(baseDir, file);
          if (fs.existsSync(fullPath) && !fs.statSync(fullPath).isDirectory()) {
            buffer = fs.readFileSync(fullPath);
          }
        } catch {}
      }
      return parseFontMetadata(buffer, file, index);
    });
}
