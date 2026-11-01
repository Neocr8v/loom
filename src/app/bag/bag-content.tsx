"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice, siteConfig } from "@/config/site";
import { useStorefrontCart } from "@/app/storefront/cart";

export function BagContent() {
  const { items, subtotal, setQuantity, removeItem } = useStorefrontCart();
  const remainingForDelivery = Math.max(0, siteConfig.delivery.freeThreshold - subtotal);

  return <main className="commerce-page">
    <div className="commerce-breadcrumb"><Link href="/">Discover</Link><span>/</span><b>Your bag</b></div>
    <div className="commerce-heading"><div className="eyebrow muted-eyebrow">A LITTLE SOMETHING GOOD</div><h1>Your bag<span>.</span></h1><p>{items.length ? "Thoughtful finds from Ghana’s independent makers." : "Your next favourite piece is waiting to be found."}</p></div>
    {!items.length ? <section className="bag-empty"><span className="bag-empty-icon">loom.</span><h2>Nothing in your bag just yet.</h2><p>Explore the collection and find something made with care.</p><Link className="button button-dark" href="/#collection">Explore the collection <ArrowRight size={15} /></Link></section> : <div className="bag-layout">
      <section className="bag-items" aria-label="Items in your shopping bag">
        {items.map(({ product, quantity }) => <article className="bag-item" key={product.id}>
          <div className="bag-item-image" style={{ backgroundImage: `url("${product.image}")` }} role="img" aria-label={product.name} />
          <div className="bag-item-details"><span>{product.maker} · {product.city}</span><h2>{product.name}</h2><b>{formatPrice(product.price)}</b>
            <div className="bag-item-actions"><div className="quantity-control" aria-label={`Quantity for ${product.name}`}><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(product.id, quantity - 1)}><Minus size={13} /></button><span>{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity(product.id, quantity + 1)}><Plus size={13} /></button></div><button className="remove-item" type="button" onClick={() => removeItem(product.id)}><Trash2 size={13} /> Remove</button></div>
          </div><strong className="bag-item-total">{formatPrice(product.price * quantity)}</strong>
        </article>)}
      </section>
      <aside className="bag-summary"><h2>Order summary</h2><div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div><span>Delivery</span><b>{remainingForDelivery ? "Calculated at checkout" : "Complimentary"}</b></div>{remainingForDelivery > 0 && <p>Add {formatPrice(remainingForDelivery)} more for complimentary {siteConfig.delivery.primaryCity} delivery.</p>}<hr /><div className="bag-total"><span>Estimated total</span><b>{formatPrice(subtotal)}</b></div><Link className="button button-dark" href="/checkout">Continue to checkout <ArrowRight size={15} /></Link><Link className="continue-shopping" href="/#collection">Continue shopping</Link><small>Demo checkout only. No payment will be collected.</small></aside>
    </div>}
  </main>;
}
