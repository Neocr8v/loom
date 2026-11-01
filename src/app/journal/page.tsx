import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { journalArticles } from "./articles";

export const metadata: Metadata = {
  title: "Stories from the studio",
  description: "Meet Ghanaian makers, explore the ideas behind their work, and read stories from the loom. journal.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return <div className="site-shell journal-shell">
    <header className="site-header commerce-header"><Link className="wordmark" href="/">loom<span>.</span></Link><nav className="journal-nav"><Link href="/#collection">Shop the collection</Link><Link href="/#maker-list">Meet the makers</Link></nav></header>
    <main className="journal-index">
      <div className="commerce-breadcrumb"><Link href="/">Discover</Link><span>/</span><b>Journal</b></div>
      <section className="journal-intro"><div className="eyebrow muted-eyebrow">NOT JUST WHAT YOU WEAR</div><h1>Stories from<br /><em>the studio.</em></h1><p>A closer look at the ideas, places and people shaping local style.</p></section>
      <section className="journal-index-grid" aria-label="Journal articles">
        {journalArticles.map((article, index) => <Link className={`journal-index-card ${index === 0 ? "journal-index-feature" : ""}`} href={`/journal/${article.slug}`} key={article.slug}>
          <div className={`journal-image ${article.imageClass}`} role="img" aria-label={`${article.city} fashion studio`} />
          <div className="journal-index-copy"><span>{article.category} · {article.city}</span><h2>{article.title}</h2><p>{article.excerpt}</p><span className="journal-read-link">Read the story <ArrowRight size={14} /></span></div>
        </Link>)}
      </section>
    </main>
    <footer className="commerce-footer">Made with care in Ghana <span>♥</span></footer>
  </div>;
}
