export const ALLOWED_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2"];

const WEIGHTS = [
  ["thin", 100], ["extralight", 200], ["ultralight", 200], ["light", 300],
  ["regular", 400], ["book", 400], ["medium", 500], ["semibold", 600],
  ["demibold", 600], ["bold", 700], ["extrabold", 800], ["black", 900],
];

export function parseFontFilename(name, index) {
  const extension = name.split(".").pop()?.toLowerCase() || "";
  const originalName = name;
  const stem = name.replace(/\.[^.]+$/, "");
  const tokens = stem.split(/[-_\s]+/).filter(Boolean);
  const styleToken = tokens.find((token) => /italic|oblique/i.test(token));
  const weightEntry = WEIGHTS.find(([label]) => new RegExp(label, "i").test(stem));
  const familyTokens = tokens.filter((token) => !/thin|light|regular|book|medium|semi|demi|bold|black|italic|oblique|variable/i.test(token));
  const family = familyTokens.join(" ") || stem;
  const formatLabel = extension.toUpperCase();
  const license = stem.length % 2 === 0 ? "Commercial" : "Personal";

  return {
    id: `${stem.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}-${index}`,
    originalName,
    url: `/fonts/${name}`,
    extension,
    format: extension === "ttf" ? "truetype" : extension === "otf" ? "opentype" : extension,
    formatLabel,
    family,
    style: styleToken ? "Italic" : "Normal",
    weight: weightEntry?.[1] ?? 400,
    license,
    fontFamily: `${stem.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 32) || "Font"}-${index}`,
    subset: "A-Z  a-z  0-9  @!$%&*",
    index,
  };
}

export function getFontsMetaFromFiles(files = []) {
  return files
    .filter((file) => ALLOWED_EXTENSIONS.some((extension) => file.toLowerCase().endsWith(extension)))
    .map(parseFontFilename);
}
