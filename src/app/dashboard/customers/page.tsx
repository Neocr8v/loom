import { addCustomer } from "@/app/dashboard/actions";
import { formatPrice } from "@/config/site";
import { getStoreCustomers } from "@/db/queries";
import { DataUnavailable, Notice, PageHeading, formatDashboardDate } from "../ui";

export const instant = false;

export default async function CustomersPage({ searchParams }: PageProps<"/dashboard/customers">) {
  const params = await searchParams;
  const customers = await getStoreCustomers();
  const search = typeof params.q === "string" ? params.q.toLowerCase() : "";
  const filtered = customers.filter(({ customer }) => `${customer.fullName} ${customer.email ?? ""} ${customer.city ?? ""}`.toLowerCase().includes(search));
  return <>
    <PageHeading title="Customers" description="Customer records and lifetime order activity for your store." />
    {params.created && <Notice>Customer added.</Notice>}{params.error && <Notice tone="error">Enter a customer name and a valid email address.</Notice>}
    {!customers.length ? <DataUnavailable title="No customers yet" description="Customers are added when orders are recorded. You can also add a customer manually." /> : <>
      <form className="dashboard-filter-bar" method="get"><label htmlFor="customer-search">Find a customer</label><input id="customer-search" name="q" type="search" defaultValue={search} placeholder="Name, email or city" /><button className="button button-outline" type="submit">Search</button></form>
      <section className="panel dashboard-table-panel"><div className="panel-heading"><div><h2>{filtered.length} customers</h2><p>Sorted by most recent order.</p></div></div>{filtered.length ? <div className="dashboard-data-table-wrap"><table className="dashboard-data-table"><thead><tr><th>CUSTOMER</th><th>CONTACT</th><th>CITY</th><th>ORDERS</th><th>SPENT</th><th>LAST ORDER</th></tr></thead><tbody>{filtered.map(({ customer, orderCount, totalSpent, lastOrderAt }) => <tr key={customer.id}><td><b>{customer.fullName}</b><small>Customer since {formatDashboardDate(customer.createdAt)}</small></td><td>{customer.email ?? "—"}<small>{customer.phone ?? ""}</small></td><td>{customer.city ?? "—"}</td><td>{orderCount}</td><td>{formatPrice(Number(totalSpent ?? 0))}</td><td>{formatDashboardDate(lastOrderAt)}</td></tr>)}</tbody></table></div> : <div className="dashboard-inline-empty">No customers match your search.</div>}</section>
    </>}
    <section className="panel dashboard-form-panel customer-create-panel"><div className="panel-heading"><div><h2>Add customer</h2><p>Record a customer manually if they placed an offline order.</p></div></div><form action={addCustomer} className="dashboard-form"><div className="form-row"><label>Full name<input name="fullName" required maxLength={180} /></label><label>Email<input name="email" type="email" maxLength={255} /></label></div><div className="form-row"><label>Phone<input name="phone" type="tel" maxLength={40} /></label><label>City<input name="city" maxLength={100} /></label></div><button className="button button-dark" type="submit">Save customer</button></form></section>
  </>;
}
