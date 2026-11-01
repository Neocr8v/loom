"use server";

import { randomUUID } from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStorePayouts } from "@/db/queries";
import { getCurrentStore, getDb } from "@/db";
import { customers, inventoryMovements, orders, payouts, products, stores } from "@/db/schema";
import { requireDashboardSession } from "@/lib/dashboard-auth";
import { dashboardCookieName } from "@/config/dashboard";

async function getAuthorizedStore() {
  await requireDashboardSession();
  const db = getDb();
  if (!db) return null;
  const store = await getCurrentStore();
  if (!store) return null;
  return { db, store };
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function positiveAmount(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export async function createProduct(formData: FormData) {
  const context = await getAuthorizedStore();
  if (!context) return;
  const { db, store } = context;
  const name = textValue(formData, "name");
  const sku = textValue(formData, "sku").toUpperCase();
  const category = textValue(formData, "category");
  const price = positiveAmount(textValue(formData, "price"));
  const stockQuantity = Number.parseInt(textValue(formData, "stockQuantity"), 10);
  if (!name || !sku || !category || !price || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
    redirect("/dashboard/products?error=product");
  }

  const [product] = await db.insert(products).values({
    storeId: store.id,
    name,
    sku,
    category,
    price,
    stockQuantity,
    description: textValue(formData, "description"),
    imageUrl: textValue(formData, "imageUrl") || null,
  }).returning();

  if (stockQuantity > 0) {
    await db.insert(inventoryMovements).values({
      storeId: store.id,
      productId: product.id,
      quantityChange: stockQuantity,
      reason: "Initial stock",
    });
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products?created=1");
}

export async function updateStock(formData: FormData) {
  const context = await getAuthorizedStore();
  if (!context) return;
  const { db, store } = context;
  const productId = textValue(formData, "productId");
  const adjustment = Number.parseInt(textValue(formData, "adjustment"), 10);
  const reason = textValue(formData, "reason") || "Manual stock adjustment";
  if (!productId || !Number.isInteger(adjustment) || adjustment === 0) redirect("/dashboard/products?error=stock");

  const [updated] = await db.update(products)
    .set({ stockQuantity: sql`${products.stockQuantity} + ${adjustment}`, updatedAt: new Date() })
    .where(and(eq(products.id, productId), eq(products.storeId, store.id), gte(sql`${products.stockQuantity} + ${adjustment}`, 0)))
    .returning({ id: products.id });
  if (!updated) redirect("/dashboard/products?error=stock");

  await db.insert(inventoryMovements).values({ storeId: store.id, productId, quantityChange: adjustment, reason });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/insights");
  redirect("/dashboard/products?updated=1");
}

export async function setProductPublished(formData: FormData) {
  const context = await getAuthorizedStore();
  if (!context) return;
  const { db, store } = context;
  const productId = textValue(formData, "productId");
  const publish = textValue(formData, "publish") === "true";
  await db.update(products).set({ isPublished: publish, updatedAt: new Date() })
    .where(and(eq(products.id, productId), eq(products.storeId, store.id)));
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
}

export async function deleteProduct(formData: FormData) {
  const context = await getAuthorizedStore();
  if (!context) return;
  const { db, store } = context;
  const productId = textValue(formData, "productId");
  await db.delete(products).where(and(eq(products.id, productId), eq(products.storeId, store.id)));
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  redirect("/dashboard/products?deleted=1");
}

export async function updateOrderStatus(formData: FormData) {
  const context = await getAuthorizedStore();
  if (!context) return;
  const { db, store } = context;
  const orderId = textValue(formData, "orderId");
  const status = textValue(formData, "status");
  const allowed = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"] as const;
  if (!orderId || !allowed.includes(status as (typeof allowed)[number])) redirect("/dashboard/orders?error=status");
  await db.update(orders).set({ status: status as (typeof allowed)[number], updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.storeId, store.id)));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/insights");
  revalidatePath("/dashboard/payouts");
  redirect("/dashboard/orders?updated=1");
}

export async function requestPayout(formData: FormData) {
  const context = await getAuthorizedStore();
  if (!context) return;
  const { db, store } = context;
  const amount = positiveAmount(textValue(formData, "amount"));
  if (!amount) redirect("/dashboard/payouts?error=amount");
  const payoutTotals = await getStorePayouts();
  if (!payoutTotals || amount > payoutTotals.available) redirect("/dashboard/payouts?error=balance");
  await db.insert(payouts).values({
    storeId: store.id,
    amount,
    reference: `PO-${randomUUID().slice(0, 8).toUpperCase()}`,
    status: "requested",
  });
  revalidatePath("/dashboard/payouts");
  redirect("/dashboard/payouts?requested=1");
}

export async function updateStoreSettings(formData: FormData) {
  const context = await getAuthorizedStore();
  if (!context) return;
  const { db, store } = context;
  const name = textValue(formData, "name");
  const ownerName = textValue(formData, "ownerName");
  const email = textValue(formData, "email");
  const phone = textValue(formData, "phone");
  const city = textValue(formData, "city");
  if (!name || !ownerName || !email.includes("@") || !city) redirect("/dashboard/settings?error=details");

  await db.update(stores).set({
    name,
    ownerName,
    email,
    phone: phone || null,
    city,
    updatedAt: new Date(),
  }).where(eq(stores.id, store.id));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?saved=1");
}

export async function signOut() {
  const jar = await cookies();
  jar.set(dashboardCookieName, "", { httpOnly: true, sameSite: "strict", path: "/dashboard", maxAge: 0 });
  redirect("/login");
}

export async function addCustomer(formData: FormData) {
  const context = await getAuthorizedStore();
  if (!context) return;
  const { db, store } = context;
  const fullName = textValue(formData, "fullName");
  const email = textValue(formData, "email");
  const phone = textValue(formData, "phone");
  const city = textValue(formData, "city");
  if (!fullName || (email && !email.includes("@"))) redirect("/dashboard/customers?error=customer");
  await db.insert(customers).values({ storeId: store.id, fullName, email: email || null, phone: phone || null, city: city || null });
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers?created=1");
}
