import { updateOrderStatus } from "@/app/dashboard/actions";
import { formatPrice } from "@/config/site";
import { getStoreOrders } from "@/db/queries";
import { DataUnavailable, Notice, PageHeading, StatusBadge, formatDashboardDate } from "../ui";

const statuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"] as const;

export const instant = false;

export default async function OrdersPage({ searchParams }: PageProps<"/dashboard/orders">) {
  const params = await searchParams;
  const orders = await getStoreOrders();
  const filter = typeof params.status === "string" ? params.status : "all";
  const filtered = filter === "all" ? orders : orders.filter(({ order }) => order.status === filter);

  return <>
    <PageHeading title="Orders" description="Review customer purchases and move each order through fulfillment." />
    {params.updated && <Notice>Order status saved.</Notice>}
    {params.error && <Notice tone="error">Could not update the order. Choose a valid status.</Notice>}
    {!orders.length ? <DataUnavailable title="No orders yet" description="Orders from your checkout will appear here. Sample orders can be added with the seed command." /> : <>
      <form className="dashboard-filter-bar" method="get"><label htmlFor="order-status-filter">Order status</label><select id="order-status-filter" name="status" defaultValue={filter}><option value="all">All orders</option>{statuses.map((status) => <option value={status} key={status}>{status.replaceAll("_", " ")}</option>)}</select><button className="button button-outline" type="submit">Filter orders</button></form>
      <section className="panel dashboard-table-panel"><div className="panel-heading"><div><h2>{filtered.length} {filtered.length === 1 ? "order" : "orders"}</h2><p>Order details and fulfillment status.</p></div></div>
        {filtered.length ? <div className="dashboard-data-table-wrap"><table className="dashboard-data-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>PLACED</th><th>TOTAL</th><th>PAYMENT / STATUS</th><th>UPDATE</th></tr></thead><tbody>
          {filtered.map(({ order, customerName, customerEmail }) => <tr key={order.id}><td><b>{order.orderNumber}</b><small>{order.currency}</small></td><td>{customerName ?? "Guest customer"}<small>{customerEmail ?? "No email provided"}</small></td><td>{formatDashboardDate(order.createdAt)}</td><td>{formatPrice(order.total)}</td><td><StatusBadge status={order.status} /></td><td><form action={updateOrderStatus} className="inline-action-form"><input type="hidden" name="orderId" value={order.id} /><select name="status" defaultValue={order.status} aria-label={`Update ${order.orderNumber} status`}>{statuses.map((status) => <option value={status} key={status}>{status.replaceAll("_", " ")}</option>)}</select><button className="button button-small" type="submit">Save</button></form></td></tr>)}
        </tbody></table></div> : <div className="dashboard-inline-empty">No orders match this status filter.</div>}
      </section>
    </>}
  </>;
}
