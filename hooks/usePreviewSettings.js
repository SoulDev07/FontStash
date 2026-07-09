import { useState, useEffect } from "react";
import { loadFromLocalStorage, saveToLocalStorage } from "@/utils/localStorageUtils";

const PREVIEW_SETTINGS_KEY = "font-stash:preview-settings";

const DEFAULT_SETTINGS = {
  sampleText: "The quick brown fox jumps over the lazy dog",
  fontSize: 24,
  lineHeight: 1.5,
  letterSpacing: 0,
  alignment: "left",
  transform: "none",
};

export function usePreviewSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadFromLocalStorage(PREVIEW_SETTINGS_KEY, DEFAULT_SETTINGS);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(stored);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage(PREVIEW_SETTINGS_KEY, settings);
    }
  }, [settings, isLoaded]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting,
    sample: settings.sampleText,
    setSample: (val) => updateSetting("sampleText", val),
  };
}
