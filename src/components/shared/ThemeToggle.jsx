"use client";

import { ThemeContext } from "@/context/ThemeProvider";
import { useContext } from "react";


const ThemeToggle = () => {
  const { theme, setTheme, appliedTheme } = useContext(ThemeContext);

  const isDark = appliedTheme === "dark";

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className="toggle"
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
      />
      <span className={`${isDark ? "text-white" : "text-base-content"}`}>
        {isDark ? "🌙 Dark" : "☀️ Light"}
      </span>
    </label>
  );
};

export default ThemeToggle;