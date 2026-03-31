import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

function cleanMintlifyMarkdown(raw: string): string {
  let content = raw;

  // Remove the mintlify doc index header
  content = content.replace(
    /^>\s*##\s*Documentation Index[\s\S]*?(?=\n#\s)/m,
    ""
  );

  // Remove "Built with Mintlify" footer
  content = content.replace(/\n*Built with \[Mintlify\]\(.*?\)\.?\s*$/m, "");

  // Remove description blockquote that appears right after the title (e.g. > Some description)
  content = content.replace(/^(#\s+.+\n)\n>\s*.+\n/m, "$1\n");

  // ---- Inner components first (they can be nested inside Accordion/Tab/Step) ----

  // <Tip> -> blockquote
  content = content.replace(
    /<Tip>\s*\n?([\s\S]*?)\n?\s*<\/Tip>/g,
    "\n> **Tip:** $1\n"
  );

  // <Warning> -> blockquote
  content = content.replace(
    /<Warning>\s*\n?([\s\S]*?)\n?\s*<\/Warning>/g,
    "\n> **Warning:** $1\n"
  );

  // <Note> -> blockquote
  content = content.replace(
    /<Note>\s*\n?([\s\S]*?)\n?\s*<\/Note>/g,
    "\n> **Note:** $1\n"
  );

  // <Info> -> blockquote
  content = content.replace(
    /<Info>\s*\n?([\s\S]*?)\n?\s*<\/Info>/g,
    "\n> **Info:** $1\n"
  );

  // <ParamField path="NAME" type="TYPE" ...> content </ParamField>
  // -> **`NAME`** (type) — content
  content = content.replace(
    /<ParamField\s+(?:path|body)="([^"]*)"[^>]*type="([^"]*)"[^>]*>\s*\n?([\s\S]*?)\n?\s*<\/ParamField>/g,
    (_match, name, type, desc) =>
      `- **\`${name}\`** *(${type})* — ${desc.trim()}\n`
  );

  // <ResponseField name="NAME" type="TYPE" ...> content </ResponseField>
  content = content.replace(
    /<ResponseField\s+name="([^"]*)"[^>]*type="([^"]*)"[^>]*>\s*\n?([\s\S]*?)\n?\s*<\/ResponseField>/g,
    (_match, name, type, desc) =>
      `- **\`${name}\`** *(${type})* — ${desc.trim()}\n`
  );

  // <ResponseField> without name/type attributes (edge case - just extract content)
  content = content.replace(
    /<ResponseField[^>]*>\s*\n?([\s\S]*?)\n?\s*<\/ResponseField>/g,
    (_match, desc) => `${desc.trim()}\n`
  );

  // <Expandable> -> just unwrap content
  content = content.replace(/<Expandable[^>]*>\s*\n?/g, "");
  content = content.replace(/<\/Expandable>\s*\n?/g, "");

  // ---- Structural components ----

  // <Steps>/<Step> -> numbered list
  content = content.replace(/<Steps>\s*\n?/g, "");
  content = content.replace(/<\/Steps>\s*\n?/g, "");
  let stepCounter = 0;
  content = content.replace(
    /<Step\s+title="([^"]*)">\s*\n?([\s\S]*?)\n?\s*<\/Step>/g,
    (_match, title, body) => {
      stepCounter++;
      return `### ${stepCounter}. ${title}\n\n${body.trim()}\n`;
    }
  );

  // <CardGroup>/<Card> -> list of links
  content = content.replace(/<CardGroup[^>]*>\s*\n?/g, "");
  content = content.replace(/<\/CardGroup>\s*\n?/g, "");
  content = content.replace(
    /<Card\s+title="([^"]*)"[^>]*>\s*\n?([\s\S]*?)\n?\s*<\/Card>/g,
    (_match, title, desc) => `- **${title}** — ${desc.trim()}\n`
  );

  // <Tabs>/<Tab> -> headers
  content = content.replace(/<Tabs>\s*\n?/g, "");
  content = content.replace(/<\/Tabs>\s*\n?/g, "");
  content = content.replace(
    /<Tab\s+title="([^"]*)">\s*\n?([\s\S]*?)\n?\s*<\/Tab>/g,
    (_match, title, body) => `#### ${title}\n\n${body.trim()}\n\n`
  );

  // <AccordionGroup>/<Accordion> -> sections
  content = content.replace(/<AccordionGroup>\s*\n?/g, "");
  content = content.replace(/<\/AccordionGroup>\s*\n?/g, "");
  content = content.replace(
    /<Accordion\s+title="([^"]*)">\s*\n?([\s\S]*?)\n?\s*<\/Accordion>/g,
    (_match, title, body) => `#### ${title}\n\n${body.trim()}\n\n`
  );

  // ---- Catch-all: remove any remaining Mintlify-specific tags ----
  // This handles <SDKUserMessage>, <HookEvent>, <Frame>, <CodeGroup>, <Snippet>, etc.
  // Self-closing tags: <Component ... />
  content = content.replace(/<[A-Z][a-zA-Z]*\s[^>]*\/>\s*\n?/g, "");
  // Opening tags with content: <Component ...>content</Component>
  // (only for tags we haven't handled above)
  content = content.replace(
    /<([A-Z][a-zA-Z]*)[^>]*>\s*\n?([\s\S]*?)\n?\s*<\/\1>/g,
    (_match, _tag, body) => `${body.trim()}\n`
  );
  // Any remaining standalone opening/closing tags
  content = content.replace(/<\/?[A-Z][a-zA-Z]*[^>]*>\s*\n?/g, "");

  // Clean code block themes
  content = content.replace(/```(\w+)\s+theme=\{null\}/g, "```$1");

  // Clean up extra blank lines
  content = content.replace(/\n{4,}/g, "\n\n\n");

  return content.trim();
}

export function getDocContent(
  section: string,
  slug: string
): { title: string; description: string; content: string } | null {
  const filePath = path.join(CONTENT_DIR, section, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  // Extract description from the blockquote line before cleaning
  const descBlockquote = raw.match(/^#\s+.+\n\n>\s*(.+)/m);
  const description = descBlockquote ? descBlockquote[1].trim() : "";

  const cleaned = cleanMintlifyMarkdown(raw);

  // Extract title (first # heading)
  const titleMatch = cleaned.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : slug;

  // Remove the title line from content (we render it separately)
  const contentWithoutTitle = cleaned.replace(/^#\s+.+\n\n?/, "");

  return { title, description, content: contentWithoutTitle };
}

export function getAllDocSlugs(): { section: string; slug: string }[] {
  const slugs: { section: string; slug: string }[] = [];

  function walk(dir: string, prefix: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), `${prefix}${entry.name}/`);
      } else if (entry.name.endsWith(".md")) {
        slugs.push({
          section: prefix.replace(/\/$/, ""),
          slug: entry.name.replace(/\.md$/, ""),
        });
      }
    }
  }

  walk(CONTENT_DIR, "");
  return slugs;
}

export function searchDocs(
  query: string
): { section: string; slug: string; title: string; snippet: string }[] {
  const results: {
    section: string;
    slug: string;
    title: string;
    snippet: string;
  }[] = [];
  const q = query.toLowerCase();

  const allSlugs = getAllDocSlugs();
  for (const { section, slug } of allSlugs) {
    const doc = getDocContent(section, slug);
    if (!doc) continue;

    const fullText = `${doc.title} ${doc.content}`.toLowerCase();
    if (fullText.includes(q)) {
      const idx = fullText.indexOf(q);
      const start = Math.max(0, idx - 60);
      const end = Math.min(fullText.length, idx + query.length + 60);
      const snippet = `...${fullText.slice(start, end)}...`;
      results.push({ section, slug, title: doc.title, snippet });
    }
  }

  return results.slice(0, 10);
}
