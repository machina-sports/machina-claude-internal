import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDocContent, getAllDocSlugs } from "@/lib/docs";
import { findNavItem, getAdjacentDocs } from "@/lib/navigation";
import { DocContent } from "@/components/DocContent";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map(({ section, slug }) => ({
    slug: [...section.split("/"), slug],
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const section = slug.slice(0, -1).join("/");
  const docSlug = slug[slug.length - 1];
  const doc = getDocContent(section, docSlug);

  if (!doc) return { title: "Not Found" };

  return {
    title: `${doc.title} - Claude Code Guide`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const section = slug.slice(0, -1).join("/");
  const docSlug = slug[slug.length - 1];

  const doc = getDocContent(section, docSlug);
  if (!doc) notFound();

  const navItem = findNavItem(section, docSlug);
  const { prev, next } = getAdjacentDocs(section, docSlug);

  return (
    <article>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Home
        </Link>
        <span>/</span>
        {section.split("/").map((part, i, arr) => (
          <span key={part}>
            <span className="capitalize">{part}</span>
            {i < arr.length - 1 && <span className="mx-2">/</span>}
          </span>
        ))}
        <span>/</span>
        <span className="text-zinc-300">{navItem?.title || docSlug}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 doc-title">
        {doc.title}
      </h1>
      {doc.description && (
        <p className="text-lg text-zinc-400 mb-8">{doc.description}</p>
      )}

      <hr className="border-zinc-800 mb-8" />

      {/* Content */}
      <DocContent content={doc.content} />

      {/* Prev/Next navigation */}
      <div className="flex items-center justify-between mt-16 pt-8 border-t border-zinc-800">
        {prev ? (
          <Link
            href={`/docs/${prev.section}/${prev.slug}`}
            className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-machina-orange transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <div>
              <div className="text-xs text-zinc-600">Previous</div>
              <div className="font-medium">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/docs/${next.section}/${next.slug}`}
            className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-machina-orange transition-colors text-right"
          >
            <div>
              <div className="text-xs text-zinc-600">Next</div>
              <div className="font-medium">{next.title}</div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}
