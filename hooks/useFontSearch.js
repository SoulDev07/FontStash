import { useState, useMemo } from "react";

export function useFontSearch(fonts) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fonts;

    return fonts.filter((f) => f.originalName.toLowerCase().includes(q) || f.fontFamily.toLowerCase().includes(q));
  }, [fonts, query]);

  return {
    query,
    setQuery,
    filtered,
    empty: !filtered || filtered.length === 0,
  };
}
