// Theme definitions for Font Stash
// Each theme maps tokens to CSS variables applied at runtime

export const THEMES = {
  light: {
    label: "Light",
    tokens: {
      bg: "#f7f7fb",
      text: "#0b0b0d",
      primary: "#4f46e5",
      accent: "#22c55e",
      card: "#ffffff",
      muted: "#6b7280",
      border: "#e5e7eb",
    },
  },
  dark: {
    label: "Dark",
    tokens: {
      bg: "#0b0b0d",
      text: "#e5e7eb",
      primary: "#6366f1",
      accent: "#22c55e",
      card: "#141418",
      muted: "#9ca3af",
      border: "#2a2a32",
    },
  },
  custom: {
    label: "Rose",
    tokens: {
      bg: "#EBE9E1",
      text: "#0b0b0d",
      primary: "#D6536D",
      accent: "#E43D12",
      card: "#ffffff",
      muted: "#6b6a65",
      border: "#e2dfd7",
    },
  },
  neon: {
    label: "Neon Night",
    tokens: {
      bg: "#0a0a0f",
      text: "#e6e6ff",
      primary: "#8b5cf6",
      accent: "#22d3ee",
      card: "#11111a",
      muted: "#a1a1b7",
      border: "#232335",
    },
  },
  sunset: {
    label: "Sunset",
    tokens: {
      bg: "#0e0d10",
      text: "#fffaf2",
      primary: "#ff7a59",
      accent: "#ffd166",
      card: "#17151a",
      muted: "#c7c1ba",
      border: "#2a2530",
    },
  },
  mint: {
    label: "Minty Fresh",
    tokens: {
      bg: "#f1fff6",
      text: "#0a0f0c",
      primary: "#10b981",
      accent: "#06b6d4",
      card: "#ffffff",
      muted: "#667a73",
      border: "#dbeee3",
    },
  },
  ocean: {
    label: "Deep Ocean",
    tokens: {
      bg: "#07121b",
      text: "#e6f7ff",
      primary: "#0ea5e9",
      accent: "#22d3ee",
      card: "#0b1722",
      muted: "#9fc3d4",
      border: "#0f2230",
    },
  },
  cyber: {
    label: "Cyber Neon",
    tokens: {
      bg: "#0a0a0a",
      text: "#eaffff",
      primary: "#00f0ff",
      accent: "#ff00e6",
      card: "#111111",
      muted: "#9dd5d5",
      border: "#202020",
    },
  },
  sand: {
    label: "Desert Sand",
    tokens: {
      bg: "#f6efe7",
      text: "#2a2118",
      primary: "#d97706",
      accent: "#f59e0b",
      card: "#ffffff",
      muted: "#7a6b5a",
      border: "#e7dccf",
    },
  },
};

export const DEFAULT_THEME_KEY = "dark";
