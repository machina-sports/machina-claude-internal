export interface NavItem {
  title: string;
  slug: string;
  section: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", slug: "introduction", section: "inicio" },
      { title: "Quickstart", slug: "quickstart", section: "inicio" },
      { title: "Installation", slug: "installation", section: "inicio" },
    ],
  },
  {
    title: "Concepts",
    items: [
      { title: "How It Works", slug: "how-it-works", section: "conceitos" },
      {
        title: "Memory & Context",
        slug: "memory-context",
        section: "conceitos",
      },
      { title: "Permissions", slug: "permissions", section: "conceitos" },
      { title: "Tools", slug: "tools", section: "conceitos" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "CLAUDE.md", slug: "claudemd", section: "configuracao" },
      {
        title: "Environment Variables",
        slug: "environment-variables",
        section: "configuracao",
      },
      { title: "Settings", slug: "settings", section: "configuracao" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Authentication", slug: "authentication", section: "guias" },
      { title: "Hooks", slug: "hooks", section: "guias" },
      { title: "MCP Servers", slug: "mcp-servers", section: "guias" },
      { title: "Multi-Agent", slug: "multi-agent", section: "guias" },
      { title: "Skills", slug: "skills", section: "guias" },
    ],
  },
  {
    title: "Reference — Commands",
    items: [
      {
        title: "CLI Flags",
        slug: "cli-flags",
        section: "referencia/comandos",
      },
      {
        title: "Overview",
        slug: "overview",
        section: "referencia/comandos",
      },
      {
        title: "Slash Commands",
        slug: "slash-commands",
        section: "referencia/comandos",
      },
    ],
  },
  {
    title: "Reference — SDK",
    items: [
      {
        title: "SDK Overview",
        slug: "overview",
        section: "referencia/sdk",
      },
      {
        title: "Hooks Reference",
        slug: "hooks-reference",
        section: "referencia/sdk",
      },
      {
        title: "Permissions API",
        slug: "permissions-api",
        section: "referencia/sdk",
      },
    ],
  },
  {
    title: "Reference — Tools",
    items: [
      {
        title: "Agent & Task",
        slug: "agent",
        section: "referencia/tools",
      },
      { title: "Bash", slug: "bash", section: "referencia/tools" },
      {
        title: "File Operations",
        slug: "file-operations",
        section: "referencia/tools",
      },
      { title: "Search", slug: "search", section: "referencia/tools" },
      { title: "Web", slug: "web", section: "referencia/tools" },
    ],
  },
];

export function getAllDocPaths(): { section: string; slug: string }[] {
  return navigation.flatMap((nav) =>
    nav.items.map((item) => ({
      section: item.section,
      slug: item.slug,
    }))
  );
}

export function findNavItem(
  section: string,
  slug: string
): NavItem | undefined {
  for (const nav of navigation) {
    const item = nav.items.find(
      (i) => i.section === section && i.slug === slug
    );
    if (item) return item;
  }
  return undefined;
}

export function getAdjacentDocs(
  section: string,
  slug: string
): { prev: NavItem | null; next: NavItem | null } {
  const allItems = navigation.flatMap((nav) => nav.items);
  const currentIndex = allItems.findIndex(
    (i) => i.section === section && i.slug === slug
  );

  return {
    prev: currentIndex > 0 ? allItems[currentIndex - 1] : null,
    next:
      currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null,
  };
}
