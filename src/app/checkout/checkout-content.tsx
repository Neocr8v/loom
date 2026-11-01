"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { formatPrice, siteConfig } from "@/config/site";
import { useStorefrontCart } from "@/app/storefront/cart";

export function CheckoutContent() {
  const { items, subtotal, clear } = useStorefrontCart();
  const [orderNumber, setOrderNumber] = useState("");

  function placeDemoOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    setOrderNumber(`LOOM-${Date.now().toString().slice(-6)}`);
    clear();
  }

  if (orderNumber) return <main className="commerce-page checkout-confirmation">
    <div className="confirmation-icon"><Check size={25} /></div><div className="eyebrow muted-eyebrow">THAT’S A WRAP</div><h1>Thanks for shopping local<span>.</span></h1><p>Your demo order <b>{orderNumber}</b> is ready for the mockup. No payment was taken and no real order was submitted.</p><Link className="button button-dark" href="/">Back to the marketplace <ArrowRight size={15} /></Link>
  </main>;

  if (!items.length) return <main className="commerce-page bag-empty"><h1>Your bag is empty.</h1><p>Add a piece to your bag before checking out.</p><Link className="button button-dark" href="/#collection">Explore the collection <ArrowRight size={15} /></Link></main>;

  return <main className="commerce-page">
    <div className="commerce-breadcrumb"><Link href="/bag"><ArrowLeft size={13} /> Your bag</Link><span>/</span><b>Checkout</b></div>
    <div className="commerce-heading"><div className="eyebrow muted-eyebrow">A SIMPLE, SECURE-FEELING DEMO</div><h1>Delivery details<span>.</span></h1><p>This mock checkout previews the customer journey. It will not collect payment or create a live order.</p></div>
    <div className="checkout-layout"><form className="checkout-form" onSubmit={placeDemoOrder}>
      <section><h2>Contact</h2><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Full name<input name="name" autoComplete="name" required /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" required /></label></section>
      <section><h2>Delivery</h2><label>Delivery city<select name="city" required defaultValue=""><option value="" disabled>Choose your city</option>{siteConfig.delivery.coverage.map((city) => <option key={city}>{city}</option>)}</select></label><label>Address<input name="address" autoComplete="street-address" required /></label><label>Delivery note <span>(optional)</span><textarea name="note" rows={3} /></label></section>
      <button className="button button-dark" type="submit">Place demo order <ArrowRight size={15} /></button><p className="checkout-disclaimer">Demo only: details are not sent to a payment provider or stored.</p>
    </form><aside className="bag-summary checkout-summary"><h2>Your order</h2>{items.map(({ product, quantity }) => <div className="checkout-line" key={product.id}><span>{product.name} <i>× {quantity}</i></span><b>{formatPrice(product.price * quantity)}</b></div>)}<hr /><div className="bag-total"><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div><span>Delivery</span><b>{subtotal >= siteConfig.delivery.freeThreshold ? "Complimentary" : "Calculated at checkout"}</b></div><p>Prices shown in Ghana cedis (GH₵).</p></aside></div>
  </main>;
}
