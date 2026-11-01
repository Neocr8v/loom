import { updateStoreSettings } from "@/app/dashboard/actions";
import { getCurrentStore, getDb } from "@/db";
import { DataUnavailable, Notice, PageHeading } from "../ui";

export const instant = false;

export default async function StoreSettingsPage({ searchParams }: PageProps<"/dashboard/settings">) {
  const params = await searchParams;
  const database = getDb();
  const demoMode = !database;
  const store = await getCurrentStore();
  return <>
    <PageHeading title="Store settings" description="Manage your marketplace profile and inspect the current database connection state." />
    {params.saved && <Notice>Store details saved.</Notice>}{params.error && <Notice tone="error">Check the required store fields and email address.</Notice>}
    {!store ? <DataUnavailable title="Store profile unavailable" description="The configured database does not contain this store yet." /> : <>
      <section className="dashboard-form-grid settings-grid">
        <article className="panel dashboard-form-panel"><div className="panel-heading"><div><h2>Public store profile</h2><p>These details identify your maker store in the marketplace.</p></div></div><form action={updateStoreSettings} className="dashboard-form"><label>Store name<input name="name" required maxLength={160} defaultValue={store.name} /></label><label>Store owner<input name="ownerName" required maxLength={160} defaultValue={store.ownerName} /></label><div className="form-row"><label>Business email<input name="email" type="email" required maxLength={255} defaultValue={store.email} /></label><label>Phone<input name="phone" type="tel" maxLength={40} defaultValue={store.phone ?? ""} /></label></div><label>City<input name="city" required maxLength={100} defaultValue={store.city} /></label><button className="button button-dark" type="submit">Save store profile</button></form></article>
        <article className="panel dashboard-form-panel"><div className="panel-heading"><div><h2>Workspace mode</h2><p>Database state and regional defaults for this preview.</p></div></div><dl className="settings-detail-list"><div><dt>Database</dt><dd>{demoMode ? "Demo data" : "Neon PostgreSQL"}</dd></div><div><dt>Changes</dt><dd>{demoMode ? "Preview only" : "Saved to database"}</dd></div><div><dt>Store identifier</dt><dd>{store.slug}</dd></div><div><dt>Currency</dt><dd>GHS · Ghana cedi</dd></div><div><dt>Data region</dt><dd>Africa/Accra</dd></div></dl><p className="settings-security-note">This marketing mockup accepts any non-empty access key. Use real authentication, account roles and store membership checks before production.</p></article>
      </section>
      <section className="panel dashboard-form-panel env-settings-panel"><div className="panel-heading"><div><h2>Delivery rules</h2><p>Configured centrally in the site configuration. Update the business policy before launch.</p></div></div><div className="delivery-settings-grid"><div><small>Free delivery threshold</small><b>GH₵500</b></div><div><small>Current service areas</small><b>Accra · Kumasi · Cape Coast</b></div><div><small>Default locale</small><b>English (Ghana)</b></div></div></section>
  </>}
  </>;
}
