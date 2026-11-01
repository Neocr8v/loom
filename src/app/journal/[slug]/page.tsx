import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { journalArticles } from "../articles";

type ArticlePageProps = { params: PageProps<"/journal/[slug]">["params"] };

export function generateStaticParams() {
  return journalArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = journalArticles.find((entry) => entry.slug === slug);
  if (!article) return { title: "Story not found" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt },
  };
}

export default function JournalArticlePage({ params }: ArticlePageProps) {
  return <div className="site-shell journal-shell">
    <header className="site-header commerce-header"><Link className="wordmark" href="/">loom<span>.</span></Link><nav className="journal-nav"><Link href="/#collection">Shop the collection</Link><Link href="/journal">All stories</Link></nav></header>
    <Suspense fallback={<main className="journal-article-page"><div className="journal-loading" role="status">Opening the story…</div></main>}>
      <JournalArticle params={params} />
    </Suspense>
    <footer className="commerce-footer">Made with care in Ghana <span>♥</span></footer>
  </div>;
}

async function JournalArticle({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = journalArticles.find((entry) => entry.slug === slug);
  if (!article) notFound();
  const otherArticles = journalArticles.filter((entry) => entry.slug !== article.slug).slice(0, 2);

  return <main className="journal-article-page">
      <div className="commerce-breadcrumb"><Link href="/">Discover</Link><span>/</span><Link href="/journal">Journal</Link><span>/</span><b>{article.city}</b></div>
      <article>
        <header className="journal-article-header"><div className="eyebrow muted-eyebrow">{article.category} · {article.city}</div><h1>{article.title}</h1><p>{article.excerpt}</p><div className="journal-byline"><span>THE LOOM. JOURNAL</span><span>{article.publishedAt}</span><span>{article.readTime}</span></div></header>
        <div className={`journal-article-hero journal-image ${article.imageClass}`} role="img" aria-label={`${article.city} fashion story`} />
        <div className="journal-article-body">{article.paragraphs.slice(0, 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<blockquote>{article.quote}</blockquote>{article.paragraphs.slice(2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<Link className="journal-back-link" href="/journal"><ArrowLeft size={14} /> Back to all stories</Link></div>
      </article>
      <section className="journal-related"><div className="eyebrow muted-eyebrow">KEEP READING</div><h2>More from the studio<span>.</span></h2><div className="journal-related-grid">{otherArticles.map((entry) => <Link className="journal-related-card" href={`/journal/${entry.slug}`} key={entry.slug}><div className={`journal-image ${entry.imageClass}`} /><span>{entry.category} · {entry.city}</span><h3>{entry.title}</h3><span className="journal-read-link">Read the story <ArrowRight size={14} /></span></Link>)}</div></section>
    </main>;
}
