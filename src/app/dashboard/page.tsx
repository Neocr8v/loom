import Link from "next/link";
import { ArrowRight, CircleDollarSign, Package, ShoppingBag, Users } from "lucide-react";
import { formatPrice } from "@/config/site";
import { getDb } from "@/db";
import { getDashboardOverview, getStoreProducts } from "@/db/queries";
import { DataUnavailable, PageHeading, StatusBadge, formatDashboardDate } from "./ui";

export default async function DashboardOverviewPage() {
  const demoMode = !getDb();
  const [overview, inventory] = await Promise.all([getDashboardOverview(), getStoreProducts()]);
  if (!overview) return <><PageHeading title="Overview" description="Your store at a glance." /><DataUnavailable /></>;

  const lowStock = inventory.filter((product) => product.stockQuantity <= 5 && product.isPublished);
  const metrics = [
    { label: "Gross sales", value: formatPrice(overview.sales), note: "Paid orders to date", icon: CircleDollarSign, href: "/dashboard/payouts" },
    { label: "Orders", value: String(overview.orderCount), note: `${overview.pendingCount} need attention`, icon: ShoppingBag, href: "/dashboard/orders" },
    { label: "Customers", value: String(overview.customerCount), note: "Customer records", icon: Users, href: "/dashboard/customers" },
    { label: "Low stock", value: String(overview.lowStockCount), note: "Five units or fewer", icon: Package, href: "/dashboard/products" },
  ];

  return <>
    <PageHeading title="Store overview" description={demoMode ? "Sample sales, orders and stock figures for your marketplace preview." : "A live view of orders, sales and inventory from your Neon database."} action={<Link className="button button-dark" href="/dashboard/products#add-product"><Package size={15} /> Add a product</Link>} />
    <section className="metric-grid" aria-label="Store metrics">
      {metrics.map(({ label, value, note, icon: Icon, href }) => <Link className="metric-card dashboard-metric-link" href={href} key={label}>
        <div className="metric-title">{label}<span className="metric-icon peach-icon"><Icon size={16} /></span></div>
        <strong>{value}</strong><div className="metric-bottom"><span>{note}</span><ArrowRight size={13} /></div>
      </Link>)}
    </section>
    <section className="dashboard-panels">
      <article className="panel sales-panel">
        <div className="panel-heading"><div><h2>Recent orders</h2><p>Latest activity recorded for your store.</p></div><Link className="panel-footer-link" href="/dashboard/orders">All orders <ArrowRight size={14} /></Link></div>
        {overview.recentOrders.length ? <div className="dashboard-data-table-wrap"><table className="dashboard-data-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>TOTAL</th><th>STATUS</th></tr></thead><tbody>
          {overview.recentOrders.map(({ order, customerName }) => <tr key={order.id}><td>{order.orderNumber}</td><td>{customerName ?? "Guest customer"}</td><td>{formatDashboardDate(order.createdAt)}</td><td>{formatPrice(order.total)}</td><td><StatusBadge status={order.status} /></td></tr>)}
        </tbody></table></div> : <div className="dashboard-inline-empty">No orders recorded yet.</div>}
      </article>
      <article className="panel inventory-panel">
        <div className="panel-heading"><div><h2>Stock to watch</h2><p>Published products at five units or fewer.</p></div><Link className="more-button" href="/dashboard/products" aria-label="Manage product inventory"><ArrowRight size={16} /></Link></div>
        {lowStock.length ? <div className="stock-list">{lowStock.slice(0, 5).map((product) => <div className="stock-item" key={product.id}>
          <span className="stock-swatch stock-coral" /><span className="stock-product"><b>{product.name}</b><small>{product.sku}</small></span><span className={product.stockQuantity <= 2 ? "stock-level low-stock" : "stock-level"}><i /> {product.stockQuantity} left</span>
        </div>)}</div> : <div className="dashboard-inline-empty">No low-stock items. <Link href="/dashboard/products">View inventory</Link></div>}
        <Link className="panel-footer-link" href="/dashboard/products">Manage inventory <ArrowRight size={14} /></Link>
      </article>
    </section>
  </>;
}
