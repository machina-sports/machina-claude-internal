import Link from "next/link";
import {
  Rocket,
  Lightbulb,
  Settings,
  BookOpen,
  Code,
  Terminal,
  FileCode,
  Search,
  Globe,
  GitBranch,
  Plug,
} from "lucide-react";

const quickLinks = [
  {
    title: "Quickstart",
    description: "Install and run your first command in under 5 minutes",
    href: "/docs/inicio/quickstart",
    icon: Rocket,
  },
  {
    title: "How It Works",
    description: "The agentic loop, context loading, and tool execution",
    href: "/docs/conceitos/how-it-works",
    icon: Lightbulb,
  },
  {
    title: "CLAUDE.md",
    description: "Write persistent instructions for your projects",
    href: "/docs/configuracao/claudemd",
    icon: FileCode,
  },
  {
    title: "Hooks",
    description: "Automate actions when Claude uses tools",
    href: "/docs/guias/hooks",
    icon: GitBranch,
  },
  {
    title: "MCP Servers",
    description: "Connect databases, APIs, and custom tools",
    href: "/docs/guias/mcp-servers",
    icon: Plug,
  },
  {
    title: "Multi-Agent",
    description: "Parallelize complex tasks with sub-agents",
    href: "/docs/guias/multi-agent",
    icon: Code,
  },
];

const capabilities = [
  {
    icon: FileCode,
    title: "Read & edit files",
    description:
      "Claude reads source code, writes new files, and makes precise edits with diffs.",
  },
  {
    icon: Terminal,
    title: "Run shell commands",
    description:
      "Execute tests, build scripts, git, and any shell command with permission controls.",
  },
  {
    icon: Search,
    title: "Search your codebase",
    description:
      "Find files by pattern, search content with regex across large codebases.",
  },
  {
    icon: Globe,
    title: "Access the web",
    description:
      "Fetch documentation, read API specs, or search the web from your terminal.",
  },
];

const sections = [
  {
    title: "Getting Started",
    icon: Rocket,
    href: "/docs/inicio/introduction",
    color: "text-emerald-400",
  },
  {
    title: "Concepts",
    icon: Lightbulb,
    href: "/docs/conceitos/how-it-works",
    color: "text-blue-400",
  },
  {
    title: "Configuration",
    icon: Settings,
    href: "/docs/configuracao/claudemd",
    color: "text-purple-400",
  },
  {
    title: "Guides",
    icon: BookOpen,
    href: "/docs/guias/authentication",
    color: "text-amber-400",
  },
  {
    title: "Reference",
    icon: Code,
    href: "/docs/referencia/comandos/overview",
    color: "text-red-400",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium rounded-full bg-machina-orange/10 text-machina-orange border border-machina-orange/20">
          <Code className="w-3 h-3" />
          Internal Documentation
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 mb-4">
          Claude Code Guide
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
          Everything you need to know to use Claude Code across Machina Sports
          projects. From quickstart to advanced workflows with multi-agent and
          MCP servers.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/docs/inicio/quickstart"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-machina-orange hover:bg-machina-orange-dark text-white font-medium text-sm rounded-lg transition-colors"
          >
            <Rocket className="w-4 h-4" />
            Get Started
          </Link>
          <Link
            href="/docs/inicio/introduction"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-sm rounded-lg border border-zinc-700 transition-colors"
          >
            Read Introduction
          </Link>
        </div>
      </div>

      {/* Quick install */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-3">
          Quick install
        </h3>
        <div className="bg-zinc-950 rounded-lg p-4 font-mono text-sm">
          <span className="text-zinc-500">$</span>{" "}
          <span className="text-zinc-200">
            npm install -g @anthropic-ai/claude-code
          </span>
        </div>
      </div>

      {/* Capabilities */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">
          What Claude Code does
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
            >
              <cap.icon className="w-5 h-5 text-machina-orange mb-3" />
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                {cap.title}
              </h3>
              <p className="text-sm text-zinc-500">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">
          Popular pages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-machina-orange/30 hover:bg-zinc-900/80 transition-all"
            >
              <link.icon className="w-5 h-5 text-zinc-500 group-hover:text-machina-orange transition-colors mb-3" />
              <h3 className="text-sm font-semibold text-zinc-200 mb-1 group-hover:text-machina-orange transition-colors">
                {link.title}
              </h3>
              <p className="text-xs text-zinc-500">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Section nav */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">Sections</h2>
        <div className="flex flex-wrap gap-3">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
            >
              <section.icon className={`w-4 h-4 ${section.color}`} />
              {section.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
