import { create } from "zustand";
import { loadFromLocalStorage, saveToLocalStorage } from "@/utils/localStorageUtils";
import {
  saveFontToDb,
  getFontsFromDb,
  deleteFontFromDb,
  getStorageEstimate,
  requestStoragePersistence,
} from "@/utils/fontDb";
import { registerFontFaceFromBuffer, createBlobUrlFromBuffer, unregisterFontFace } from "@/utils/fontUtils";

const PREVIEW_KEY = "font-stash:preview-settings";
const FAVORITES_KEY = "font-stash:favorites";

const DEFAULT_SETTINGS = {
  sampleText: "The quick brown fox jumps over the lazy dog",
  fontSize: 24,
  lineHeight: 1.5,
  letterSpacing: 0,
  alignment: "left",
  transform: "none",
};

export const useFontStore = create((set, get) => ({
  // Preview Settings
  settings: DEFAULT_SETTINGS,
  updateSetting: (key, value) => {
    set((state) => {
      const updated = { ...state.settings, [key]: value };
      if (typeof window !== "undefined") {
        saveToLocalStorage(PREVIEW_KEY, updated);
      }
      return { settings: updated };
    });
  },
  resetSettings: () => {
    if (typeof window !== "undefined") {
      saveToLocalStorage(PREVIEW_KEY, DEFAULT_SETTINGS);
    }
    set({ settings: DEFAULT_SETTINGS });
  },

  // View & UI State
  viewMode: "list",
  setViewMode: (mode) => set({ viewMode: mode }),
  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
  activeSpecimenFont: null,
  setActiveSpecimenFont: (font) => set({ activeSpecimenFont: font }),

  // Favorites
  favorites: [],
  toggleFavorite: (fontId) => {
    set((state) => {
      const exists = state.favorites.includes(fontId);
      const updated = exists
        ? state.favorites.filter((id) => id !== fontId)
        : [...state.favorites, fontId];
      if (typeof window !== "undefined") {
        saveToLocalStorage(FAVORITES_KEY, updated);
      }
      return { favorites: updated };
    });
  },

  // Compare Mode
  compareIds: [],
  toggleCompare: (fontId) => {
    set((state) => {
      const exists = state.compareIds.includes(fontId);
      const updated = exists
        ? state.compareIds.filter((id) => id !== fontId)
        : state.compareIds.length < 4
        ? [...state.compareIds, fontId]
        : state.compareIds;
      return { compareIds: updated };
    });
  },
  clearCompare: () => set({ compareIds: [] }),

  // Custom Ingested Fonts (IndexedDB Binary Store)
  customFonts: [],
  storageStats: { usageMB: "0.0", quotaMB: "0", percentage: "0" },

  addCustomFont: async (fontRecord) => {
    await saveFontToDb(fontRecord);
    const blobUrl = fontRecord.buffer
      ? createBlobUrlFromBuffer(fontRecord.buffer, fontRecord.format)
      : fontRecord.url;

    const populated = { ...fontRecord, url: blobUrl };

    set((state) => ({
      customFonts: [populated, ...state.customFonts],
    }));

    const stats = await getStorageEstimate();
    set({ storageStats: stats });
  },

  removeCustomFont: async (fontId) => {
    const target = get().customFonts.find((f) => f.id === fontId);
    if (target) {
      unregisterFontFace(target.fontFamily);
    }
    await deleteFontFromDb(fontId);

    set((state) => ({
      customFonts: state.customFonts.filter((f) => f.id !== fontId),
      compareIds: state.compareIds.filter((id) => id !== fontId),
      favorites: state.favorites.filter((id) => id !== fontId),
    }));

    const stats = await getStorageEstimate();
    set({ storageStats: stats });
  },

  // Toast notifications
  toast: null,
  showToast: (message, type = "success") => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => {
      set((state) => (state.toast?.message === message ? { toast: null } : state));
    }, 2800);
  },

  // Search & Filter
  query: "",
  setQuery: (q) => set({ query: q }),
  extensions: [],
  categoryFilter: "all",
  setCategoryFilter: (c) => set({ categoryFilter: c }),
  favoritesOnly: false,
  setFavoritesOnly: (f) => set({ favoritesOnly: f }),
  customOnly: false,
  setCustomOnly: (c) => set({ customOnly: c }),
  sort: "index",
  setSort: (s) => set({ sort: s }),
  toggleFilter: (value) => {
    set((state) => {
      const current = state.extensions;
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { extensions: updated };
    });
  },
  clearAllFilters: () => {
    set({
      extensions: [],
      categoryFilter: "all",
      favoritesOnly: false,
      customOnly: false,
      sort: "index",
    });
  },

  // Hydration initialization from LocalStorage and IndexedDB
  hydrate: async () => {
    if (typeof window === "undefined") return;

    requestStoragePersistence();

    const storedSettings = loadFromLocalStorage(PREVIEW_KEY, DEFAULT_SETTINGS);
    const storedFavorites = loadFromLocalStorage(FAVORITES_KEY, []);

    // Load binary fonts from IndexedDB
    const dbFonts = await getFontsFromDb();
    const populatedFonts = dbFonts.map((f) => {
      let url = f.url;
      if (f.buffer) {
        registerFontFaceFromBuffer(f.fontFamily, f.buffer, f.format);
        url = createBlobUrlFromBuffer(f.buffer, f.format);
      }
      return { ...f, url };
    });

    const stats = await getStorageEstimate();

    set({
      settings: storedSettings,
      favorites: storedFavorites,
      customFonts: populatedFonts,
      storageStats: stats,
    });
  },
}));

