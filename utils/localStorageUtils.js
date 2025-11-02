// Safe wrappers for localStorage JSON operations (SSR-safe)

function hasLocalStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function saveToLocalStorage(key, value) {
  if (!hasLocalStorage()) return; // no-op on server
  try {
    const str = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, str);
  } catch (e) {
    console.warn("Failed to save to localStorage", key, e);
  }
}

export function loadFromLocalStorage(key, fallback = null) {
  if (!hasLocalStorage()) return fallback; // SSR-safe fallback
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return raw; // allow plain string values
    }
  } catch (e) {
    console.warn("Failed to load from localStorage", key, e);
    return fallback;
  }
}

export function removeFromLocalStorage(key) {
  if (!hasLocalStorage()) return; // no-op on server
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn("Failed to remove from localStorage", key, e);
  }
}
