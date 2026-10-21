import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/blog";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${site.url}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.legalName },
    publisher: { "@type": "Organization", name: site.legalName },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  const others = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="border-2 border-line bg-paper-raised p-8 shadow-[6px_6px_0_0_var(--line)] md:p-10">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="border-2 border-accent bg-accent px-2 py-0.5 font-bold text-background">
            {post.category}
          </span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </time>
          <span>· {post.readingMinutes} min de lecture</span>
        </div>
        <h1 className="mt-4 text-xl leading-relaxed text-text-strong md:text-2xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground">{post.description}</p>

        <div className="mt-8 space-y-5 text-sm leading-relaxed text-foreground">
          {post.content.map((block, i) =>
            block.type === "h2" ? (
              <h2 key={i} className="pt-4 text-base leading-relaxed text-text-strong">
                {block.text}
              </h2>
            ) : block.type === "list" ? (
              <ul key={i} className="list-none space-y-2">
                {block.text.split("\n").map((li) => (
                  <li key={li} className="flex gap-2">
                    <span aria-hidden className="font-bold text-accent">—</span>
                    {li}
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i}>{block.text}</p>
            ),
          )}
        </div>
      </div>

      <div className="mt-8 border-2 border-line bg-paper-raised p-6 text-center shadow-[4px_4px_0_0_var(--line)]">
        <p className="text-sm text-foreground">
          Prêt à transmettre le savoir-faire de vos postes ?
        </p>
        <Link
          href="/signup"
          className="btn-cubic mt-4 inline-block border-2 border-accent bg-accent px-6 py-2.5 font-semibold text-background"
        >
          Essayer Omi gratuitement
        </Link>
      </div>

      {others.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm text-text-strong">À lire aussi</h2>
          <div className="mt-4 space-y-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="widget block border-2 border-line bg-paper-raised p-4 text-sm text-text-strong shadow-[3px_3px_0_0_var(--line)]"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-sm">
        <Link href="/blog" className="text-accent underline hover:text-accent-bright">
          ← Tous les articles
        </Link>
      </p>
    </article>
  );
}
