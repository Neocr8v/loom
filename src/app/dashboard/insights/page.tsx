import { formatPrice } from "@/config/site";
import { getStoreInsights } from "@/db/queries";
import { DataUnavailable, PageHeading } from "../ui";
import InsightsCharts from "./insights-charts";

const successfulStatuses = new Set(["paid", "processing", "shipped", "delivered"]);

export default async function InsightsPage() {
  const insights = await getStoreInsights();
  if (!insights) return <><PageHeading title="Insights" description="Sales and product performance for the last 30 days." /><DataUnavailable /></>;

  const successfulOrders = insights.rows.filter(({ order }) => successfulStatuses.has(order.status));
  const orderCount = successfulOrders.length;
  const maxRevenue = Math.max(...insights.topProducts.map((item) => Number(item.revenue ?? 0)), 1);

  return <>
    <PageHeading title="Insights" description="Sales and product performance from the last 30 days." />
    <section className="metric-grid insights-metrics" aria-label="Sales analytics">
      <article className="metric-card"><div className="metric-title">Net sales · 30 days</div><strong>{formatPrice(insights.revenue)}</strong><div className="metric-bottom"><span>Paid and fulfilled orders</span></div></article>
      <article className="metric-card"><div className="metric-title">Orders · 30 days</div><strong>{orderCount}</strong><div className="metric-bottom"><span>Successful orders</span></div></article>
      <article className="metric-card"><div className="metric-title">Units sold · 30 days</div><strong>{insights.units}</strong><div className="metric-bottom"><span>Across all products</span></div></article>
      <article className="metric-card"><div className="metric-title">Average order value</div><strong>{formatPrice(insights.averageOrder)}</strong><div className="metric-bottom"><span>Paid order average</span></div></article>
    </section>
    <InsightsCharts
      rows={insights.rows.map(({ order }) => ({
        status: order.status,
        total: order.total,
        createdAt: order.createdAt.toISOString(),
      }))}
      periodEnd={insights.periodEnd.toISOString()}
    />
    <section className="dashboard-panels insights-products">
      <article className="panel">
        <div className="panel-heading"><div><h2>Top products</h2><p>By sales revenue in the last 30 days.</p></div></div>
        {insights.topProducts.length ? <div className="top-product-list">{insights.topProducts.map((item) => {
          const value = Number(item.revenue ?? 0);
          return <div className="top-product-row" key={item.name}>
            <div className="top-product-label"><b>{item.name}</b><span>{Number(item.units ?? 0)} units · {formatPrice(value)}</span></div>
            <div className="top-product-track"><i style={{ width: `${Math.max(4, value / maxRevenue * 100)}%` }} /></div>
          </div>;
        })}</div> : <div className="dashboard-inline-empty">No completed sales in this period yet.</div>}
      </article>
    </section>
  </>;
}
