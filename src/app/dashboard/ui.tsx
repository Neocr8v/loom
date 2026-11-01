import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, PackageSearch } from "lucide-react";
import { formatPrice } from "@/config/site";

export function PageHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="dashboard-heading">
    <div><div className="eyebrow muted-eyebrow">MAKER WORKSPACE</div><h1>{title}</h1><p>{description}</p></div>
    {action}
  </div>;
}

export function DataUnavailable({ title = "Connect your Neon database", description = "Set DATABASE_URL, run the migrations, and seed your store to load live data here." }: { title?: string; description?: string }) {
  return <div className="dashboard-empty-state"><PackageSearch size={24} /><h2>{title}</h2><p>{description}</p><Link className="panel-footer-link" href="/dashboard/settings">Open store settings <ArrowRight size={14} /></Link></div>;
}

export function Notice({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "error" | "info" }) {
  return <div className={`dashboard-message message-${tone}`} role="status">{children}</div>;
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`order-status status-${status.toLowerCase().replaceAll("_", "-")}`}><i />{status.replaceAll("_", " ")}</span>;
}

export function formatDashboardDate(date: Date | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Accra",
  }).format(date);
}

export function Price({ value }: { value: number }) {
  return <>{formatPrice(value)}</>;
}
