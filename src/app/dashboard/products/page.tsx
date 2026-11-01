import { createProduct, deleteProduct, setProductPublished, updateStock } from "@/app/dashboard/actions";
import { formatPrice } from "@/config/site";
import { getStoreProducts, getInventoryHistory } from "@/db/queries";
import { DataUnavailable, Notice, PageHeading, formatDashboardDate } from "../ui";

export const instant = false;

export default async function ProductsPage({ searchParams }: PageProps<"/dashboard/products">) {
  const params = await searchParams;
  const [products, history] = await Promise.all([getStoreProducts(), getInventoryHistory()]);
  return <>
    <PageHeading title="Products & inventory" description="Create products, update stock, and control what is visible in your storefront." action={<a className="button button-dark" href="#add-product">Add a product</a>} />
    {params.created && <Notice>Product created.</Notice>}{params.updated && <Notice>Inventory updated.</Notice>}{params.deleted && <Notice>Product removed.</Notice>}
    {params.error === "product" && <Notice tone="error">Check the product details, SKU, price and stock quantity.</Notice>}
    {params.error === "stock" && <Notice tone="error">Stock adjustment must be non-zero and cannot make stock negative.</Notice>}
    {!products.length && <DataUnavailable title="No products in this store" description="Add your first product below, or run the database seed command to load sample products." />}
    <section className="panel dashboard-table-panel"><div className="panel-heading"><div><h2>Catalog</h2><p>{products.length} products registered in this store.</p></div></div>
      {products.length > 0 && <div className="dashboard-data-table-wrap"><table className="dashboard-data-table"><thead><tr><th>PRODUCT</th><th>SKU</th><th>PRICE</th><th>STOCK</th><th>VISIBILITY</th><th>ACTIONS</th></tr></thead><tbody>
        {products.map((product) => <tr key={product.id}><td><b>{product.name}</b><small>{product.category}</small></td><td>{product.sku}</td><td>{formatPrice(product.price)}</td><td><span className={product.stockQuantity <= 5 ? "inventory-number inventory-low" : "inventory-number"}>{product.stockQuantity}</span></td><td>{product.isPublished ? "Published" : "Hidden"}</td><td><div className="table-actions"><form action={updateStock} className="inline-action-form"><input type="hidden" name="productId" value={product.id} /><input type="number" name="adjustment" aria-label={`Adjust ${product.name} stock`} min={-product.stockQuantity} max="9999" placeholder="±qty" required /><input type="hidden" name="reason" value="Manual stock adjustment" /><button className="button button-small" type="submit">Adjust</button></form><form action={setProductPublished}><input type="hidden" name="productId" value={product.id} /><input type="hidden" name="publish" value={String(!product.isPublished)} /><button className="button button-small button-outline" type="submit">{product.isPublished ? "Hide" : "Publish"}</button></form><form action={deleteProduct}><input type="hidden" name="productId" value={product.id} /><button className="text-danger-button" type="submit">Remove</button></form></div></td></tr>)}
      </tbody></table></div>}
    </section>
    <section className="dashboard-form-grid" id="add-product">
      <article className="panel dashboard-form-panel"><div className="panel-heading"><div><h2>Add a product</h2><p>Prices are stored as Ghana cedi amounts.</p></div></div>
        <form action={createProduct} className="dashboard-form"><label>Product name<input name="name" required maxLength={180} /></label><div className="form-row"><label>SKU<input name="sku" required maxLength={80} /></label><label>Category<input name="category" required maxLength={100} placeholder="Clothing" /></label></div><div className="form-row"><label>Price (GH₵)<input name="price" type="number" min="0.01" step="0.01" required /></label><label>Opening stock<input name="stockQuantity" type="number" min="0" step="1" required defaultValue="0" /></label></div><label>Image URL<input name="imageUrl" type="url" placeholder="Optional product image" /></label><label>Description<textarea name="description" rows={3} maxLength={2000} /></label><button className="button button-dark" type="submit">Save product</button></form>
      </article>
      <article className="panel dashboard-form-panel"><div className="panel-heading"><div><h2>Recent stock changes</h2><p>Inventory adjustment audit trail.</p></div></div>{history.length ? <div className="movement-list">{history.slice(0, 8).map(({ movement, productName }) => <div className="movement-row" key={movement.id}><div><b>{productName}</b><small>{movement.reason} · {formatDashboardDate(movement.createdAt)}</small></div><strong className={movement.quantityChange > 0 ? "movement-positive" : "movement-negative"}>{movement.quantityChange > 0 ? "+" : ""}{movement.quantityChange}</strong></div>)}</div> : <div className="dashboard-inline-empty">Stock adjustments will be recorded here.</div>}</article>
    </section>
  </>;
}
