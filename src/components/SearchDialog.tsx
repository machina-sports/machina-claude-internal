"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText } from "lucide-react";

interface SearchResult {
  section: string;
  slug: string;
  title: string;
  snippet: string;
}

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        );
        const data = await res.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  function navigate(result: SearchResult) {
    router.push(`/docs/${result.section}/${result.slug}`);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 border-b border-zinc-800">
          <Search className="w-5 h-5 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search docs..."
            className="flex-1 bg-transparent py-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {loading && (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              Searching...
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              No results found.
            </div>
          )}
          {!loading &&
            results.map((result, idx) => (
              <button
                key={`${result.section}/${result.slug}`}
                onClick={() => navigate(result)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                  idx === selectedIndex
                    ? "bg-machina-orange/10"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                <FileText className="w-4 h-4 mt-0.5 text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-zinc-200">
                    {result.title}
                  </div>
                  <div className="text-xs text-zinc-500 truncate mt-0.5">
                    {result.snippet}
                  </div>
                </div>
              </button>
            ))}
          {!query && (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              Type to search the docs
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800 flex items-center gap-4 text-xs text-zinc-600">
          <span>
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑↓</kbd>{" "}
            navigate
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↵</kbd> open
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">esc</kbd>{" "}
            close
          </span>
        </div>
      </div>
    </div>
  );
}
