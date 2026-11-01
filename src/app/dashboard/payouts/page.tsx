import { requestPayout } from "@/app/dashboard/actions";
import { formatPrice } from "@/config/site";
import { getStorePayouts, getStoreTransactions } from "@/db/queries";
import { DataUnavailable, Notice, PageHeading, StatusBadge, formatDashboardDate } from "../ui";

export const instant = false;

export default async function PayoutsPage({ searchParams }: PageProps<"/dashboard/payouts">) {
  const params = await searchParams;
  const [payoutData, transactions] = await Promise.all([getStorePayouts(), getStoreTransactions()]);
  if (!payoutData) return <><PageHeading title="Payouts & transactions" description="Review payment records and request a payout from your available balance." /><DataUnavailable /></>;
  return <>
    <PageHeading title="Payouts & transactions" description="Review payment records and request a payout from your available balance." />
    {params.requested && <Notice>Payout request recorded. This prototype does not transfer funds.</Notice>}
    {params.error === "amount" && <Notice tone="error">Enter a valid payout amount.</Notice>}{params.error === "balance" && <Notice tone="error">The request is larger than your available balance.</Notice>}
    <>
      <section className="payout-summary-grid"><article className="metric-card"><div className="metric-title">Available balance</div><strong>{formatPrice(payoutData.available)}</strong><div className="metric-bottom"><span>Calculated from successful demo payments</span></div></article><article className="metric-card"><div className="metric-title">Requested / paid out</div><strong>{formatPrice(payoutData.requested)}</strong><div className="metric-bottom"><span>Includes requested, processing and paid requests</span></div></article></section>
      <section className="dashboard-form-grid payout-form-grid"><article className="panel dashboard-form-panel"><div className="panel-heading"><div><h2>Request a payout</h2><p>Creates a request record only; it does not initiate a bank transfer.</p></div></div><form action={requestPayout} className="dashboard-form"><label>Amount (GH₵)<input type="number" name="amount" min="0.01" max={payoutData.available} step="0.01" required /></label><button className="button button-dark" type="submit" disabled={payoutData.available <= 0}>Submit request</button></form></article><article className="panel dashboard-form-panel"><div className="panel-heading"><div><h2>Payout requests</h2><p>Request history for this store.</p></div></div>{payoutData.rows.length ? <div className="movement-list">{payoutData.rows.map((payout) => <div className="movement-row" key={payout.id}><div><b>{payout.reference}</b><small>{formatDashboardDate(payout.requestedAt)}</small></div><span><StatusBadge status={payout.status} /> <strong>{formatPrice(payout.amount)}</strong></span></div>)}</div> : <div className="dashboard-inline-empty">No payout requests have been made.</div>}</article></section>
  <section className="panel dashboard-table-panel"><div className="panel-heading"><div><h2>Payment transactions</h2><p>Payment-provider records associated with orders.</p></div></div>{transactions.length ? <div className="dashboard-data-table-wrap"><table className="dashboard-data-table"><thead><tr><th>REFERENCE</th><th>ORDER</th><th>CUSTOMER</th><th>PROVIDER</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>{transactions.map(({ payment, orderNumber, customerName }) => <tr key={payment.id}><td>{payment.reference ?? "—"}</td><td>{orderNumber}</td><td>{customerName ?? "Guest customer"}</td><td>{payment.provider}</td><td>{formatDashboardDate(payment.createdAt)}</td><td>{formatPrice(payment.amount)}</td><td><StatusBadge status={payment.status} /></td></tr>)}</tbody></table></div> : <div className="dashboard-inline-empty">No payment transactions have been recorded.</div>}</section>
    </>
  </>;
}
