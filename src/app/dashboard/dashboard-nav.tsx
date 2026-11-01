"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings2,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { signOut } from "./actions";

const sections = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/products", label: "Products & stock", icon: Package },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/insights", label: "Insights", icon: TrendingUp },
  { href: "/dashboard/payouts", label: "Payouts & transactions", icon: Wallet },
  { href: "/dashboard/settings", label: "Store settings", icon: Settings2 },
];

export function DashboardNav({ storeName, ownerName, demoMode }: { storeName: string; ownerName: string; demoMode: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="studio-sidebar">
      <Link href="/dashboard" className="sidebar-brand">
        <div className="sidebar-logo">loom.</div>
        <div><b>{storeName}</b><span>Maker workspace</span></div>
      </Link>
      <div className="store-status"><span className="live-dot" /> {demoMode ? "Demo workspace" : "Connected workspace"}</div>
      <p className="sidebar-label">WORKSPACE</p>
      <nav className="dashboard-side-nav" aria-label="Maker workspace">
        {sections.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
          return <Link key={href} href={href} className={active ? "sidebar-link active" : "sidebar-link"} aria-current={active ? "page" : undefined}>
            <Icon size={17} />{label}
          </Link>;
        })}
      </nav>
      <div className="sidebar-help"><CircleHelp size={16} /><span>Need a hand?<b>{demoMode ? "Sample workspace" : "Neon-backed workspace"}</b></span></div>
      <div className="sidebar-profile"><div className="profile-avatar">{ownerName.slice(0, 2).toUpperCase()}</div><div><b>{ownerName}</b><span>Store administrator</span></div>
        <form action={signOut}><button className="sidebar-signout" type="submit">Sign out</button></form>
      </div>
      <div className="sidebar-footer-note"><CreditCard size={13} /> Ghana cedi · GHS</div>
    </aside>
  );
}
