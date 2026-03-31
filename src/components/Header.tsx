"use client";

import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Search } from "lucide-react";
import { SearchDialog } from "./SearchDialog";

export function Header() {
  const [isDark, setIsDark] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  }, [isDark]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-800 dark:border-zinc-800 bg-zinc-950/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 max-w-4xl mx-auto">
          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300
                bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline text-xs text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
                {"\u2318"}K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
