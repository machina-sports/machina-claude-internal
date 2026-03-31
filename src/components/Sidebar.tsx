"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Rocket,
  Lightbulb,
  Settings,
  BookOpen,
  Code,
  Menu,
  X,
} from "lucide-react";
import { navigation, NavSection } from "@/lib/navigation";

const sectionIcons: Record<string, React.ReactNode> = {
  "Getting Started": <Rocket className="w-4 h-4" />,
  Concepts: <Lightbulb className="w-4 h-4" />,
  Configuration: <Settings className="w-4 h-4" />,
  Guides: <BookOpen className="w-4 h-4" />,
  "Reference — Commands": <Code className="w-4 h-4" />,
  "Reference — SDK": <Code className="w-4 h-4" />,
  "Reference — Tools": <Code className="w-4 h-4" />,
};

function NavSectionComponent({
  section,
  pathname,
}: {
  section: NavSection;
  pathname: string;
}) {
  const hasActiveItem = section.items.some(
    (item) => pathname === `/docs/${item.section}/${item.slug}`
  );
  const [isOpen, setIsOpen] = useState<boolean>(hasActiveItem || true);

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold rounded-lg
          text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50
          dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50
          transition-colors"
      >
        {sectionIcons[section.title] || <Code className="w-4 h-4" />}
        <span className="flex-1 text-left">{section.title}</span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        )}
      </button>
      {isOpen && (
        <div className="ml-3 mt-0.5 border-l border-zinc-800 pl-3">
          {section.items.map((item) => {
            const href = `/docs/${item.section}/${item.slug}`;
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive
                    ? "text-machina-orange bg-machina-orange/10 font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-zinc-950 border-r border-zinc-800
          flex flex-col overflow-hidden transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-lg font-bold tracking-tight text-white">
                MACHINA
              </span>
              <svg
                className="w-4 h-4 mx-1"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
                  fill="#f97316"
                />
              </svg>
              <span className="text-lg font-bold tracking-tight text-white">
                SPORTS
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-machina-orange/10 text-machina-orange border border-machina-orange/20">
            <Code className="w-3 h-3" />
            Claude Code Guide
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation.map((section) => (
            <NavSectionComponent
              key={section.title}
              section={section}
              pathname={pathname}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-800 text-xs text-zinc-600">
          Internal docs - Machina Sports <br />
          <a href="https://github.com/pinhepo" className="text-zinc-400 hover:text-zinc-200">Developed by Mateus Pinheiro</a>
        </div>
      </aside>
    </>
  );
}
