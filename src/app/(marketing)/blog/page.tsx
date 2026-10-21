import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — Transmission de savoir-faire et onboarding",
  description:
    "Articles sur la transmission de savoir-faire en entreprise, l'onboarding des nouveaux collaborateurs et la gestion des connaissances opérationnelles.",
  openGraph: {
    title: "Blog Obi.ai",
    description: "Transmission de savoir-faire, onboarding et gestion des connaissances.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog Obi.ai",
  url: `${site.url}/blog`,
  description:
    "Articles sur la transmission de savoir-faire en entreprise et l'onboarding.",
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    url: `${site.url}/blog/${p.slug}`,
  })),
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="border-2 border-line bg-paper-raised p-8 shadow-[6px_6px_0_0_var(--line)]">
        <h1 className="text-2xl leading-relaxed text-text-strong">Blog</h1>
        <p className="mt-3 text-foreground">
          Transmission de savoir-faire, onboarding et gestion des connaissances
          opérationnelles.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {posts.map((p) => (
          <article key={p.slug} className="widget border-2 border-line bg-paper-raised p-6 shadow-[4px_4px_0_0_var(--line)]">
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="border-2 border-accent bg-accent px-2 py-0.5 font-bold text-background">
                {p.category}
              </span>
              <time dateTime={p.date}>
                {new Date(p.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </time>
              <span>· {p.readingMinutes} min</span>
            </div>
            <h2 className="mt-3 text-base leading-relaxed">
              <Link href={`/blog/${p.slug}`} className="text-text-strong hover:text-accent">
                {p.title}
              </Link>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{p.description}</p>
            <Link
              href={`/blog/${p.slug}`}
              className="mt-4 inline-block text-sm font-medium text-accent underline hover:text-accent-bright"
            >
              Lire l&apos;article
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
