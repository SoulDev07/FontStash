import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  SunIcon,
  MoonStarsIcon,
  PaintBrushIcon,
  SparkleIcon,
  LightningIcon,
  FireIcon,
  LeafIcon,
  WavesIcon,
  PaletteIcon,
  CaretDownIcon,
  CircleHalfIcon,
} from "@phosphor-icons/react";

export default function ThemeSwitcher() {
  const { themeKey, setThemeKey } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const options = [
    { key: "system", label: "System", icon: CircleHalfIcon },
    { key: "light", label: "Light", icon: SunIcon },
    { key: "dark", label: "Dark", icon: MoonStarsIcon },
    { key: "custom", label: "Rose", icon: PaintBrushIcon },
    { key: "neon", label: "Neon Night", icon: SparkleIcon },
    { key: "sunset", label: "Sunset", icon: LightningIcon },
    { key: "mint", label: "Minty Fresh", icon: LeafIcon },
    { key: "ocean", label: "Deep Ocean", icon: WavesIcon },
    { key: "cyber", label: "Cyber Neon", icon: PaletteIcon },
    { key: "sand", label: "Desert Sand", icon: FireIcon },
  ];

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const current = options.find((o) => o.key === themeKey) || options[0];

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="btn px-3 py-1.5 rounded-md inline-flex items-center gap-2"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        suppressHydrationWarning
      >
        <span suppressHydrationWarning>
          <current.icon size={16} />
        </span>
        <span className="hidden sm:inline text-sm" suppressHydrationWarning>
          {current.label}
        </span>
        <CaretDownIcon size={12} className="text-muted" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 card py-1 shadow-lg animate-pop">
          {options.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-[color-mix(in_oklab,var(--card),white_4%)] ${
                themeKey === key ? "text-primary" : "text-text"
              }`}
              role="option"
              aria-selected={themeKey === key}
              onClick={() => {
                setThemeKey(key);
                setOpen(false);
              }}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
