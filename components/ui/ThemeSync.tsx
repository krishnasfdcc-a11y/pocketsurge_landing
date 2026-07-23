"use client";

import { useEffect } from "react";

/**
 * Re-applies the stored theme after React hydrates <html>, which can wipe the
 * `dark` class set by the blocking inline script.
 */
export function ThemeSync() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const dark =
        stored === "dark" ||
        (stored !== "light" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
    } catch {
      // ignore
    }
  }, []);

  return null;
}
