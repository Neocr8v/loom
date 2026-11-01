import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight, Bell } from "lucide-react";
import { connection } from "next/server";
import { formatPrice } from "@/config/site";
import { getCurrentStore, getDb } from "@/db";
import { requireDashboardSession } from "@/lib/dashboard-auth";
import { DashboardNav } from "./dashboard-nav";

export const instant = false;

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="site-shell studio-mode">
      <div className="topline">MAKER WORKSPACE <span>·</span> YOUR BUSINESS, IN ONE PLACE</div>
      <header className="site-header dashboard-header">
        <Link className="wordmark" href="/">loom<span>.</span></Link>
        <div className="dashboard-header-actions"><span className="dashboard-currency">{formatPrice(0).replace(/[\d\s.,]/g, "")} · GHANA</span><Link className="icon-button notification-button" href="/dashboard/orders" aria-label="Open order inbox"><Bell size={17} /></Link><Link className="studio-shop-link" href="/">View storefront <ArrowUpRight size={14} /></Link></div>
      </header>
      <main className="studio-main">
        <Suspense fallback={<div className="dashboard-loading" role="status">Loading your secure workspace…</div>}>
          <AuthenticatedDashboard>{children}</AuthenticatedDashboard>
        </Suspense>
      </main>
    </div>
  );
}

async function AuthenticatedDashboard({ children }: { children: React.ReactNode }) {
  await connection();
  await requireDashboardSession();

  let store = null;
  let databaseError = false;
  const demoMode = !getDb();
  if (!demoMode) {
    try {
      store = await getCurrentStore();
    } catch {
      databaseError = true;
    }
  }

  return <>
    <DashboardNav storeName={store?.name ?? "Next Store"} ownerName={store?.ownerName ?? "Store owner"} demoMode={demoMode} />
    <div className={demoMode ? "studio-content dashboard-preview" : "studio-content"}>
      <div className="studio-topbar"><div className="breadcrumbs">Maker workspace <span aria-hidden="true">/</span> <b>{store?.name ?? "Next Store"}</b></div><div className="studio-top-actions"><span className="today-date"><span className={databaseError ? "database-dot error" : "database-dot"} /> {databaseError ? "DATABASE UNAVAILABLE" : demoMode ? "DEMO PREVIEW" : "LIVE WORKSPACE"}</span></div></div>
      {demoMode && <div className="dashboard-message message-info demo-preview-banner"><b>Demo preview</b><span>Sample store metrics and activity. Connect Neon to persist changes.</span></div>}
      {databaseError && <div className="dashboard-message message-error demo-preview-banner"><b>Using preview data</b><span>Neon could not be reached. Check DATABASE_URL and migrations to enable saved changes.</span></div>}
      {!demoMode && !store && !databaseError && <div className="dashboard-message message-error demo-preview-banner"><b>Store not found</b><span>Apply migrations and seed the configured store to enable saved changes.</span></div>}
      {children}
    </div>
  </>;
}
