"use client"; 

import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // "light" | "dark" | "system"
  const [theme, setTheme] = useState("light");

  // Read persisted theme once on mount (client only)
  useEffect(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      setTheme(savedTheme);
    } else {
      setTheme("light");
    }
  }, []);

  // Compute the actual theme to apply when using system preference
  const appliedTheme = useMemo(() => {
    if (theme === "system") {
      if (typeof window === "undefined") return "light";
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return theme;
  }, [theme]);

  // Apply theme and persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", appliedTheme);
    localStorage.setItem("theme", theme);
  }, [appliedTheme, theme]);

  // Listen to system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const prefersDark = mql.matches;
      const next = prefersDark ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
    };
    try {
      mql.addEventListener("change", handler);
    } catch {
      // Safari
      mql.addListener(handler);
    }
    return () => {
      try {
        mql.removeEventListener("change", handler);
      } catch {
        mql.removeListener(handler);
      }
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, appliedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};