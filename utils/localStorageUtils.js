function hasLocalStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function saveToLocalStorage(key, value) {
  if (!hasLocalStorage()) return;

  try {
    const str = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, str);
  } catch (e) {
    console.warn("Failed to save to localStorage", key, e);
  }
}

export function loadFromLocalStorage(key, fallback = null) {
  if (!hasLocalStorage()) return fallback;

  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch (e) {
    console.warn("Failed to load from localStorage", key, e);
    return fallback;
  }
}

export function removeFromLocalStorage(key) {
  if (!hasLocalStorage()) return;

  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn("Failed to remove from localStorage", key, e);
  }
}
