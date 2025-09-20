"use client";

import { ThemeContext } from "@/context/ThemeProvider";
import { useContext } from "react";
import { Sun, Moon } from "lucide-react";

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
      <span>
        {isDark ? (
          <Moon className="w-5 h-5 text-white" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </span>
    </label>
  );
};

export default ThemeToggle;
