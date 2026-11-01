import type { Metadata } from "next";
import Link from "next/link";
import { BagContent } from "./bag-content";

export const metadata: Metadata = { title: "Your bag" };

export default function BagPage() {
  return <div className="site-shell commerce-shell">
    <header className="site-header commerce-header"><Link className="wordmark" href="/">loom<span>.</span></Link><Link className="commerce-back-link" href="/">Continue browsing</Link></header>
    <BagContent />
    <footer className="commerce-footer">Made with care in Ghana <span>♥</span></footer>
  </div>;
}
