export type Product = {
  id: string;
  name: string;
  maker: string;
  city: string;
  price: number;
  category: string;
  image: string;
  label?: string;
};

export const products: Product[] = [
  { id: "naa-wrap-dress", name: "The Naa red top-handle bag", maker: "Aduke Studio", city: "Accra", price: 680, category: "Accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85", label: "BESTSELLER" },
  { id: "sunday-market-tote", name: "Sunday market tote", maker: "Kasa Goods", city: "Kumasi", price: 240, category: "Accessories", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85", label: "HANDWOVEN" },
  { id: "everyday-linen-shirt", name: "Everyday linen shirt", maker: "The Cloth House", city: "Accra", price: 420, category: "Clothing", image: "https://images.pexels.com/photos/3021601/pexels-photo-3021601.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: "osu-cropped-jacket", name: "Osu cropped jacket", maker: "Aduke Studio", city: "Accra", price: 890, category: "Clothing", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85", label: "JUST IN" },
  { id: "kente-knot-mini", name: "Kente knot mini", maker: "Next Store", city: "Cape Coast", price: 560, category: "Clothing", image: "https://images.pexels.com/photos/14761883/pexels-photo-14761883.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: "palm-wine-bucket-bag", name: "Palm wine bucket bag", maker: "Kasa Goods", city: "Kumasi", price: 350, category: "Accessories", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85" },
  { id: "studio-to-street-shirt", name: "Studio-to-street shirt", maker: "The Cloth House", city: "Accra", price: 460, category: "Clothing", image: "https://images.pexels.com/photos/36830952/pexels-photo-36830952.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { id: "ahenema-slides", name: "Blue floral pointed-toe heels", maker: "Next Store", city: "Cape Coast", price: 390, category: "Accessories", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85", label: "SMALL BATCH" },
];
