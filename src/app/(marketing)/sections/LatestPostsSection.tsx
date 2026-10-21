import Link from "next/link";
import { posts } from "@/lib/blog";

export function LatestPostsSection() {
  const latest = posts.slice(0, 3);
  return (
    <section data-section className="w-full">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between">
          <h2 className="pixel-title st-item mt-1 text-2xl leading-relaxed tracking-tight text-text-strong">
            Derniers articles
          </h2>
          <Link
            href="/blog"
            className="st-item text-sm font-medium text-accent underline hover:text-accent-bright"
          >
            Tous les articles
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {latest.map((p) => (
            <article key={p.slug} className="widget st-item border-2 border-line bg-paper-raised p-6 shadow-[4px_4px_0_0_var(--line)]">
              <span className="border-2 border-accent bg-accent px-2 py-0.5 text-xs font-bold text-background">
                {p.category}
              </span>
              <h3 className="pixel-title mt-3 text-sm leading-relaxed text-text-strong">
                <Link href={`/blog/${p.slug}`} className="hover:text-accent">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-foreground">{p.description}</p>
              <p className="mt-4 text-xs text-muted">{p.readingMinutes} min de lecture</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
