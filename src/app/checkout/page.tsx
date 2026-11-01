import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutContent } from "./checkout-content";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return <div className="site-shell commerce-shell">
    <header className="site-header commerce-header"><Link className="wordmark" href="/">loom<span>.</span></Link><Link className="commerce-back-link" href="/bag">Back to your bag</Link></header>
    <CheckoutContent />
    <footer className="commerce-footer">Made with care in Ghana <span>♥</span></footer>
  </div>;
}
