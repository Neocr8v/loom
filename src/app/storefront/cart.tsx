"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "./products";

type CartItem = { productId: string; quantity: number };
type CartContextValue = {
  items: Array<{ product: Product; quantity: number }>;
  itemCount: number;
  subtotal: number;
  addItem: (product: Product) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const storageKey = "loom-shopping-bag";
const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter((item): item is CartItem =>
      typeof item === "object" &&
      item !== null &&
      "productId" in item &&
      typeof item.productId === "string" &&
      products.some((product) => product.id === item.productId) &&
      "quantity" in item &&
      typeof item.quantity === "number" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 20,
    );
  } catch (error) {
    console.error("Unable to read the saved shopping bag.", error);
    return [];
  }
}

export function StorefrontCartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      setCart(readCart());
      setLoaded(true);
    }, 0);
    const syncCart = (event: StorageEvent) => {
      if (event.key === storageKey) setCart(readCart());
    };
    window.addEventListener("storage", syncCart);
    return () => {
      window.clearTimeout(loadTimer);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error("Unable to save the shopping bag in this browser.", error);
    }
  }, [cart, loaded]);

  const value = useMemo<CartContextValue>(() => {
    const items = cart.flatMap(({ productId, quantity }) => {
      const product = products.find((entry) => entry.id === productId);
      return product ? [{ product, quantity }] : [];
    });
    return {
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      addItem: (product) => setCart((current) => {
        const existing = current.find((item) => item.productId === product.id);
        if (existing) {
          return current.map((item) => item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 20) }
            : item);
        }
        return [...current, { productId: product.id, quantity: 1 }];
      }),
      setQuantity: (productId, quantity) => setCart((current) =>
        quantity < 1
          ? current.filter((item) => item.productId !== productId)
          : current.map((item) => item.productId === productId
            ? { ...item, quantity: Math.min(quantity, 20) }
            : item),
      ),
      removeItem: (productId) => setCart((current) => current.filter((item) => item.productId !== productId)),
      clear: () => setCart([]),
    };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useStorefrontCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useStorefrontCart must be used within StorefrontCartProvider.");
  return context;
}
