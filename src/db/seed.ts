import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env.local" });
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Set DATABASE_URL before running the seed script.");

const db = drizzle(neon(connectionString), { schema });
const storeSlug = process.env.DASHBOARD_STORE_SLUG ?? "next-store";

async function seed() {
  const [store] = await db
    .insert(schema.stores)
    .values({
      name: "Next Store",
      slug: storeSlug,
      ownerName: "Store owner",
      email: "owner@example.test",
      city: "Accra",
    })
    .onConflictDoUpdate({
      target: schema.stores.slug,
      set: { name: "Next Store", updatedAt: new Date() },
    })
    .returning();

  const productSeeds = [
    { sku: "NS-DRESS-001", name: "The Naa red top-handle bag", category: "Accessories", description: "A structured red top-handle bag with polished hardware.", price: 680, stockQuantity: 12, imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85" },
    { sku: "NS-BAG-001", name: "Sunday market tote", category: "Accessories", description: "A roomy everyday tote.", price: 240, stockQuantity: 18, imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85" },
    { sku: "NS-SHIRT-001", name: "Everyday linen shirt", category: "Clothing", description: "An easy-fit linen shirt.", price: 420, stockQuantity: 12, imageUrl: "https://images.pexels.com/photos/3021601/pexels-photo-3021601.jpeg?auto=compress&cs=tinysrgb&w=900" },
    { sku: "NS-DRESS-002", name: "Kente knot mini", category: "Clothing", description: "A limited-run contemporary mini dress.", price: 560, stockQuantity: 5, imageUrl: "https://images.pexels.com/photos/14761883/pexels-photo-14761883.jpeg?auto=compress&cs=tinysrgb&w=900" },
  ];

  const productRows = await Promise.all(productSeeds.map((product) =>
    db.insert(schema.products).values({ ...product, storeId: store.id }).onConflictDoUpdate({
      target: [schema.products.storeId, schema.products.sku],
      set: { ...product, updatedAt: new Date() },
    }).returning(),
  ));
  const productBySku = new Map(productRows.flat().map((product) => [product.sku, product]));

  const customerSeeds = [
    { fullName: "Ama Mensah", email: "ama@example.test", phone: "+233 20 000 1001", city: "Accra" },
    { fullName: "Kojo Owusu", email: "kojo@example.test", phone: "+233 24 000 1002", city: "Kumasi" },
    { fullName: "Efua Frimpong", email: "efua@example.test", phone: "+233 50 000 1003", city: "Cape Coast" },
  ];
  const customerRows = await Promise.all(customerSeeds.map((customer) =>
    db.insert(schema.customers).values({ ...customer, storeId: store.id }).onConflictDoUpdate({
      target: [schema.customers.storeId, schema.customers.email],
      set: customer,
    }).returning(),
  ));
  const customerByEmail = new Map(customerRows.flat().filter((customer) => customer.email).map((customer) => [customer.email!, customer]));

  const orderSeeds = [
    { orderNumber: "NS-2048", customerEmail: "ama@example.test", status: "processing" as const, sku: "NS-DRESS-001", quantity: 1, deliveryFee: 0, createdAt: new Date(Date.now() - 1000 * 60 * 35) },
    { orderNumber: "NS-2047", customerEmail: "kojo@example.test", status: "shipped" as const, sku: "NS-SHIRT-001", quantity: 1, deliveryFee: 0, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) },
    { orderNumber: "NS-2046", customerEmail: "efua@example.test", status: "paid" as const, sku: "NS-BAG-001", quantity: 1, deliveryFee: 0, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27) },
  ];

  for (const seedOrder of orderSeeds) {
    const product = productBySku.get(seedOrder.sku);
    const customer = customerByEmail.get(seedOrder.customerEmail);
    if (!product || !customer) continue;
    const subtotal = product.price * seedOrder.quantity;
    const [order] = await db.insert(schema.orders).values({
      storeId: store.id,
      customerId: customer.id,
      orderNumber: seedOrder.orderNumber,
      status: seedOrder.status,
      subtotal,
      deliveryFee: seedOrder.deliveryFee,
      total: subtotal + seedOrder.deliveryFee,
      currency: "GHS",
      createdAt: seedOrder.createdAt,
      updatedAt: seedOrder.createdAt,
    }).onConflictDoUpdate({
      target: [schema.orders.storeId, schema.orders.orderNumber],
      set: { customerId: customer.id, status: seedOrder.status, subtotal, total: subtotal + seedOrder.deliveryFee, updatedAt: new Date() },
    }).returning();

    await db.delete(schema.orderItems).where(eq(schema.orderItems.orderId, order.id));
    await db.insert(schema.orderItems).values({
      orderId: order.id,
      productId: product.id,
      productName: product.name,
      quantity: seedOrder.quantity,
      unitPrice: product.price,
      lineTotal: subtotal,
    });
    await db.insert(schema.payments).values({
      orderId: order.id,
      provider: "Demo payment",
      reference: `DEMO-${seedOrder.orderNumber}`,
      amount: subtotal + seedOrder.deliveryFee,
      status: "succeeded",
    }).onConflictDoUpdate({
      target: schema.payments.reference,
      set: { amount: subtotal + seedOrder.deliveryFee, status: "succeeded" },
    });
  }

  console.info(`Seeded ${store.name} with ${productSeeds.length} products, ${customerSeeds.length} customers and ${orderSeeds.length} sample orders.`);
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
