"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronDown,
  Heart, LayoutDashboard, Leaf, Menu, Plus, Search, ShoppingBag,
  Sparkles, Truck, X,
} from "lucide-react";
import { formatPrice, siteConfig } from "@/config/site";
import Link from "next/link";
import { products, type Product } from "@/app/storefront/products";
import { useStorefrontCart } from "@/app/storefront/cart";
import { journalArticles } from "@/app/journal/articles";

const categories = ["All pieces", "Clothing", "Accessories"];

function Header({ cartCount, search, onSearch }: { cartCount: number; search: string; onSearch: (value: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <><div className="topline">COMPLIMENTARY {siteConfig.delivery.primaryCity.toUpperCase()} DELIVERY ON ORDERS OVER {formatPrice(siteConfig.delivery.freeThreshold)}</div><header className="site-header"><Link className="wordmark" href="/#home">loom<span>.</span></Link><nav className={menuOpen ? "main-nav mobile-nav-open" : "main-nav"} aria-label="Main navigation"><Link className="nav-link active" href="/#home" onClick={closeMenu}>Discover</Link><Link className="nav-link" href="/#maker-list" onClick={closeMenu}>Our makers</Link><Link className="nav-link" href="/#story" onClick={closeMenu}>Our story</Link><Link className="nav-link mobile-makers-link" href="/dashboard" onClick={closeMenu}>For makers</Link></nav><div className="header-actions"><label className={mobileSearchOpen ? "search-box mobile-search-open" : "search-box"}><Search size={16} /><input aria-label="Search products and makers" value={search} onChange={(event) => onSearch(event.target.value)} onFocus={() => { setMenuOpen(false); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }} placeholder="Find your next favourite" /></label><button className="icon-button mobile-search" aria-label={mobileSearchOpen ? "Close search" : "Search"} aria-expanded={mobileSearchOpen} onClick={() => setMobileSearchOpen((open) => !open)}>{mobileSearchOpen ? <X size={18} /> : <Search size={18} />}</button><Link className="cart-button" href="/bag" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={18} /><span className="cart-count">{cartCount}</span></Link><Link className="studio-switch" href="/dashboard"><LayoutDashboard size={15} /> For makers</Link><button className="icon-button mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div></header></>;
}

function Hero({ onExplore }: { onExplore: () => void }) {
  return <section className="hero" id="home">
    <div className="hero-copy">
      <div className="eyebrow"><span className="eyebrow-dot" /> GHANA&apos;S INDEPENDENT STYLE MARKETPLACE</div>
      <h1>Style well.<br /><span>Choose local.</span></h1>
      <p>Meet the designers, makers and small labels shaping what Ghana wears next.</p>
      <div className="hero-actions">
        <button className="button button-dark" onClick={onExplore}>Shop the collection <ArrowRight size={16} /></button>
        <a className="text-link" href="#makers">Meet the makers <ArrowDownRight size={15} /></a>
      </div>
      <div className="hero-footnote"><div className="mini-avatars"><i>A</i><i>K</i><i>N</i></div><span><b>Independent Ghanaian labels</b> · made close to home</span></div>
    </div>
    <div className="hero-art" aria-label="Fashion editorial from the Ghanaian independent style collection">
      <div className="hero-art-caption"><span>THE ACCRA EDIT · 01</span><b>Independent Ghanaian design.</b></div>
    </div>
  </section>;
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  const [saved, setSaved] = useState(false);
  return <article className="product-card"><div className="product-art" role="img" aria-label={`${product.name} by ${product.maker}`} style={{ backgroundImage: `url("${product.image}")` }}><div className="product-art-topline">{product.label && <span className="product-label">{product.label}</span>}<button className={`favorite-button ${saved ? "is-saved" : ""}`} aria-label={saved ? "Remove from saved items" : "Save item"} aria-pressed={saved} onClick={() => setSaved(!saved)}><Heart size={16} fill={saved ? "currentColor" : "none"} /></button></div><button className="quick-add" onClick={() => onAdd(product)}><Plus size={15} /> Add to bag</button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.maker} <span>·</span> {product.city}</p></div><strong>{formatPrice(product.price)}</strong></div></article>;
}

function Marketplace({ addToCart, search, onSearch }: { addToCart: (product: Product) => void; search: string; onSearch: (value: string) => void }) {
  const [activeCategory, setActiveCategory] = useState("All pieces");
  const [selectedCity, setSelectedCity] = useState("All cities");
  const [sortOrder, setSortOrder] = useState("featured");
  const [subscribed, setSubscribed] = useState(false);
  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === "All pieces" || product.category === activeCategory;
    const matchesSearch = `${product.name} ${product.maker} ${product.city}`.toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity === "All cities" || product.city === selectedCity;
    return matchesCategory && matchesSearch && matchesCity;
  }).sort((left, right) => {
    if (sortOrder === "price-low") return left.price - right.price;
    if (sortOrder === "price-high") return right.price - left.price;
    return products.indexOf(left) - products.indexOf(right);
  }), [activeCategory, search, selectedCity, sortOrder]);
  const selectCategory = (category: string) => {
    setActiveCategory(category);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };
  const selectEdit = (query: string) => {
    setActiveCategory("All pieces");
    setSelectedCity("All cities");
    onSearch(query);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  return <main>
    <Hero onExplore={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })} />

    <section className="trust-strip" id="story" aria-label="Shopping benefits">
      <div><span className="trust-icon"><Leaf size={17} /></span><span><b>Thoughtfully made</b><small>Small runs, made to be kept.</small></span></div>
      <div><span className="trust-icon"><BadgeCheck size={17} /></span><span><b>Independent labels</b><small>Shop the people behind the work.</small></span></div>
      <div><span className="trust-icon"><Truck size={17} /></span><span><b>Delivery across Ghana</b><small>Easy delivery, wherever you are.</small></span></div>
    </section>

    <section className="category-showcase" id="categories">
      <div className="section-heading category-heading">
        <div><div className="eyebrow muted-eyebrow">FIND YOUR POINT OF VIEW</div><h2>Shop by category<span>.</span></h2><p>Start with what you love. Find the makers behind it.</p></div>
      </div>
      <div className="category-cards">
        <button className="category-card category-women" onClick={() => selectCategory("Clothing")}><span className="category-card-image" /><span className="category-card-copy"><small>01 / CLOTHING</small><b>Clothes with character</b><i>Explore clothing <ArrowRight size={14} /></i></span></button>
        <button className="category-card category-accessories" onClick={() => selectCategory("Accessories")}><span className="category-card-image" /><span className="category-card-copy"><small>02 / ACCESSORIES</small><b>The finishing touches</b><i>Explore accessories <ArrowRight size={14} /></i></span></button>
        <a className="category-card category-makers" href="#maker-list"><span className="category-card-image" /><span className="category-card-copy"><small>03 / OUR COMMUNITY</small><b>Meet the makers</b><i>Get to know them <ArrowRight size={14} /></i></span></a>
      </div>
    </section>

    <section className="shop-edit-section" aria-labelledby="shop-edit-title">
      <div className="shop-edit-heading"><div><div className="eyebrow muted-eyebrow">A GOOD PLACE TO START</div><h2 id="shop-edit-title">Shop the edit<span>.</span></h2><p>Three little directions for finding your next favourite.</p></div><span className="shop-edit-note">CURATED IN GHANA <span>✳</span></span></div>
      <div className="shop-edit-grid">
        <button className="shop-edit-card edit-everyday" onClick={() => selectEdit("shirt")}><span className="shop-edit-copy"><small>THE EVERYDAY EDIT</small><b>Easy pieces,<br />beautifully done.</b><i>Shop the edit <ArrowRight size={14} /></i></span></button>
        <button className="shop-edit-card edit-carry" onClick={() => selectEdit("Kasa Goods")}><span className="shop-edit-copy"><small>MADE TO GO PLACES</small><b>A little craft<br />to carry with you.</b><i>Shop the edit <ArrowRight size={14} /></i></span></button>
        <button className="shop-edit-card edit-occasion" onClick={() => selectEdit("dress")}><span className="shop-edit-copy"><small>THE OCCASION EDIT</small><b>Make room<br />for a moment.</b><i>Shop the edit <ArrowRight size={14} /></i></span></button>
      </div>
    </section>

    <section className="collection-section" id="collection">
      <div className="section-heading"><div><div className="eyebrow muted-eyebrow">THE LOOM. SELECTION</div><h2>Considered pieces, made here<span>.</span></h2><p>Independent design, small-batch finds, and the makers behind each piece.</p></div><a className="text-link desktop-link" href="#maker-list">Meet the makers <ArrowRight size={15} /></a></div>
      <div className="collection-controls"><div className="category-tabs" role="tablist" aria-label="Product categories">{categories.map((category) => <button key={category} role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? "category-tab selected" : "category-tab"} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="collection-tools"><label className="collection-sort-label"><span>Sort</span><select className="collection-sort" aria-label="Sort products" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label><label className="collection-search"><Search size={15} /><input aria-label="Search products and makers" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search pieces & makers" />{search && <button className="clear-search" type="button" aria-label="Clear search" onClick={() => onSearch("")}><X size={14} /></button>}</label></div></div>
      <div className="collection-caption"><span>{filtered.length} {filtered.length === 1 ? "piece" : "pieces"} to discover</span><span>Small-batch design, selected with care</span></div>
      {filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.name} product={product} onAdd={addToCart} />)}</div> : <div className="empty-state">No pieces found just yet. Try another search.</div>}
    </section>

    <section className="maker-banner" id="makers"><div className="maker-banner-art" role="img" aria-label="Ghanaian fashion portrait" /><div className="maker-banner-copy"><div className="eyebrow">INDEPENDENT BY NATURE</div><h2>Made in Ghana.<br />Worn on your<br /><em>own terms.</em></h2><p>Meet the designers bringing a new perspective to contemporary African fashion.</p><a className="button button-light" href="#maker-list">Discover the designers <ArrowRight size={16} /></a></div></section>

    <section className="maker-list" id="maker-list"><div className="maker-list-heading"><div><div className="eyebrow muted-eyebrow">PEOPLE BEHIND THE PIECES</div><h2>Meet the makers<span>.</span></h2></div><label className="maker-city-filter"><span>Show makers in</span><select className="sort-button" aria-label="Filter makers by city" value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}><option>All cities</option>{siteConfig.delivery.coverage.map((city) => <option key={city}>{city}</option>)}</select><ChevronDown size={14} /></label></div><div className="maker-cards">{[
      { name: "Aduke Studio", city: "Accra", category: "Contemporary clothing", detail: "Made for all the ways you move.", initial: "A" },
      { name: "Kasa Goods", city: "Kumasi", category: "Woven accessories", detail: "Handwoven, never mass-produced.", initial: "K" },
      { name: "Next Store", city: "Cape Coast", category: "Modern heritage", detail: "Heritage craft, with a new point of view.", initial: "N" },
    ].filter((maker) => selectedCity === "All cities" || maker.city === selectedCity).map((maker) => <button className="maker-card" key={maker.name} onClick={() => { setActiveCategory("All pieces"); setSelectedCity("All cities"); onSearch(maker.name); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}><span className="maker-monogram">{maker.initial}</span><div><h3>{maker.name} <BadgeCheck size={15} /></h3><p>{maker.category} · {maker.city}</p><span className="maker-detail">{maker.detail}</span></div><ArrowUpRight size={16} /></button>)}</div>{selectedCity !== "All cities" && <button className="clear-city-filter" onClick={() => setSelectedCity("All cities")}>Show all makers</button>}</section>

    <section className="journal-section">
      <div className="section-heading"><div><div className="eyebrow muted-eyebrow">NOT JUST WHAT YOU WEAR</div><h2>Stories from the studio<span>.</span></h2><p>A closer look at the ideas, places and people shaping local style.</p></div><Link className="text-link desktop-link" href="/journal">More maker stories <ArrowRight size={15} /></Link></div>
      <div className="journal-grid">
        {journalArticles.map((article, index) => <Link className={`journal-card ${index === 0 ? "journal-feature" : ""}`} href={`/journal/${article.slug}`} key={article.slug}><div className={`journal-image ${article.imageClass}`} /><div className="journal-copy"><span>{article.category} · {article.city}</span><h3>{article.title}</h3><span className="journal-card-link">{index === 0 ? "Read the story" : "Meet the maker"} <ArrowRight size={14} /></span></div></Link>)}
      </div>
    </section>

    <section className="newsletter"><div><span className="newsletter-icon"><Sparkles size={17} /></span><div><h2>Good things, in your inbox.</h2><p>New designers, considered finds, and stories worth reading.</p></div></div>{subscribed ? <p className="newsletter-success" role="status">Thanks for your interest — newsletter sign-up is a demo.</p> : <form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}><input type="email" placeholder="Your email address" required aria-label="Your email address" /><button aria-label="Subscribe"><ArrowRight size={18} /></button></form>}</section>
  </main>;
}

export default function Home() {
  const [toastVisible, setToastVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { itemCount, addItem } = useStorefrontCart();
  useEffect(() => {
    if (!toastVisible) return;
    const timeout = window.setTimeout(() => setToastVisible(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [toastVisible]);
  const addToCart = (product: Product) => {
    addItem(product);
    setToastVisible(true);
  };
  return <div className="site-shell"><Header cartCount={itemCount} search={search} onSearch={setSearch} /><Marketplace addToCart={addToCart} search={search} onSearch={setSearch} /><footer className="site-footer"><Link className="wordmark" href="/#home">loom<span>.</span></Link><span>Made with care in Ghana <span className="footer-heart">♥</span></span><div><Link href="/dashboard">For makers</Link><Link href="/#story">Our story</Link><Link href="/#home">Back to top ↑</Link><Link href="/bag">Your bag</Link></div></footer><div className={toastVisible ? "toast toast-visible" : "toast"} aria-live="polite"><Check size={14} /> Added to your bag</div></div>;
}
