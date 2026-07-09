import { useEffect } from "react";
import { registerFontFace } from "@/utils/fontUtils";

export function useFontRegistration(fonts) {
  useEffect(() => {
    fonts.forEach((f) => {
      try {
        registerFontFace(f.fontFamily, f.url, f.format);
      } catch (err) {
        console.error("Failed to register font face for", f.fontFamily, err);
      }
    });
  }, [fonts]);
}
