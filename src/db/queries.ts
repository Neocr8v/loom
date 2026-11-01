import "server-only";

import { and, count, desc, eq, gt, inArray, lt, sql, sum } from "drizzle-orm";
import { getCurrentStore, getDb } from "./index";
import { customers, inventoryMovements, orderItems, orders, payments, payouts, products } from "./schema";
import { demoCustomers, demoInventory, demoOrderItems, demoOrders, demoPayments, demoPayouts, demoProducts, demoTotals } from "./demo-data";

const paidOrderStatuses = ["paid", "processing", "shipped", "delivered"] as const;

export async function getDashboardOverview() {
  const db = getDb();
  if (!db) return {
    ...demoTotals,
    lowStockCount: demoProducts.filter((product) => product.isPublished && product.stockQuantity <= 5).length,
    recentOrders: demoOrders.slice(0, 5).map((order) => ({
      order,
      customerName: demoCustomers.find((customer) => customer.id === order.customerId)?.fullName ?? null,
    })),
  };
  const store = await getCurrentStore();
  if (!db || !store) return null;

  const [sales] = await db.select({ value: sum(orders.total), orders: count() })
    .from(orders)
    .where(and(eq(orders.storeId, store.id), inArray(orders.status, paidOrderStatuses)));
  const [pending] = await db.select({ value: count() })
    .from(orders)
    .where(and(eq(orders.storeId, store.id), inArray(orders.status, ["pending", "paid"])));
  const [visits] = await db.select({ value: count() }).from(customers).where(eq(customers.storeId, store.id));
  const [stock] = await db.select({ value: count() }).from(products)
    .where(and(eq(products.storeId, store.id), lt(products.stockQuantity, 6), eq(products.isPublished, true)));
  const recentOrders = await db.select({ order: orders, customerName: customers.fullName })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.storeId, store.id))
    .orderBy(desc(orders.createdAt))
    .limit(5);

  return {
    sales: Number(sales?.value ?? 0),
    orderCount: Number(sales?.orders ?? 0),
    pendingCount: Number(pending?.value ?? 0),
    customerCount: Number(visits?.value ?? 0),
    lowStockCount: Number(stock?.value ?? 0),
    recentOrders,
  };
}

export async function getStoreProducts() {
  const db = getDb();
  if (!db) return [...demoProducts].sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime());
  const store = await getCurrentStore();
  if (!db || !store) return [];
  return db.select().from(products).where(eq(products.storeId, store.id)).orderBy(desc(products.updatedAt));
}

export async function getStoreOrders() {
  const db = getDb();
  if (!db) return demoOrders.map((order) => {
    const customer = demoCustomers.find((entry) => entry.id === order.customerId);
    return { order, customerName: customer?.fullName ?? null, customerEmail: customer?.email ?? null };
  });
  const store = await getCurrentStore();
  if (!db || !store) return [];
  return db.select({ order: orders, customerName: customers.fullName, customerEmail: customers.email })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.storeId, store.id))
    .orderBy(desc(orders.createdAt));
}

export async function getStoreCustomers() {
  const db = getDb();
  if (!db) return demoCustomers.map((customer) => {
    const customerOrders = demoOrders.filter((order) => order.customerId === customer.id && paidOrderStatuses.includes(order.status as (typeof paidOrderStatuses)[number]));
    return {
      customer,
      orderCount: customerOrders.length,
      totalSpent: customerOrders.reduce((total, order) => total + order.total, 0),
      lastOrderAt: customerOrders[0]?.createdAt ?? null,
    };
  }).sort((left, right) => (right.lastOrderAt?.getTime() ?? 0) - (left.lastOrderAt?.getTime() ?? 0));
  const store = await getCurrentStore();
  if (!db || !store) return [];
  return db.select({
    customer: customers,
    orderCount: count(orders.id),
    totalSpent: sum(orders.total),
    lastOrderAt: sql<Date | null>`max(${orders.createdAt})`.mapWith((value) => value ? new Date(value) : null),
  }).from(customers)
    .leftJoin(orders, and(eq(orders.customerId, customers.id), inArray(orders.status, paidOrderStatuses)))
    .where(eq(customers.storeId, store.id))
    .groupBy(customers.id)
    .orderBy(desc(sql`max(${orders.createdAt})`));
}

export async function getStorePayouts() {
  const db = getDb();
  if (!db) return {
    rows: demoPayouts,
    available: demoPayments.reduce((total, payment) => total + payment.amount, 0) - demoPayouts.reduce((total, payout) => total + payout.amount, 0),
    requested: demoPayouts.filter((payout) => payout.status !== "rejected").reduce((total, payout) => total + payout.amount, 0),
  };
  const store = await getCurrentStore();
  if (!db || !store) return null;

  const [sales] = await db.select({ value: sum(payments.amount) })
    .from(payments)
    .innerJoin(orders, eq(payments.orderId, orders.id))
    .where(and(eq(orders.storeId, store.id), eq(payments.status, "succeeded")));
  const [requested] = await db.select({ value: sum(payouts.amount) })
    .from(payouts)
    .where(and(eq(payouts.storeId, store.id), inArray(payouts.status, ["requested", "processing", "paid"])));
  const rows = await db.select().from(payouts).where(eq(payouts.storeId, store.id)).orderBy(desc(payouts.requestedAt));
  return {
    rows,
    available: Math.max(0, Number(sales?.value ?? 0) - Number(requested?.value ?? 0)),
    requested: Number(requested?.value ?? 0),
  };
}

export async function getStoreTransactions() {
  const db = getDb();
  if (!db) return demoPayments.map((payment) => {
    const order = demoOrders.find((entry) => entry.id === payment.orderId)!;
    return {
      payment,
      orderNumber: order.orderNumber,
      customerName: demoCustomers.find((entry) => entry.id === order.customerId)?.fullName ?? null,
    };
  });
  const store = await getCurrentStore();
  if (!db || !store) return [];
  return db.select({ payment: payments, orderNumber: orders.orderNumber, customerName: customers.fullName })
    .from(payments)
    .innerJoin(orders, eq(payments.orderId, orders.id))
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.storeId, store.id))
    .orderBy(desc(payments.createdAt));
}

export async function getStoreInsights() {
  const db = getDb();
  if (!db) {
    const periodEnd = demoOrders.reduce(
      (latest, order) => order.createdAt > latest ? order.createdAt : latest,
      new Date(0),
    );
    const periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() - 30);
    const periodOrders = demoOrders.filter((order) => order.createdAt >= periodStart && order.createdAt <= periodEnd);
    const successfulOrders = periodOrders.filter((order) => paidOrderStatuses.includes(order.status as (typeof paidOrderStatuses)[number]));
    const successfulOrderIds = new Set(successfulOrders.map((order) => order.id));
    const revenue = successfulOrders.reduce((total, order) => total + order.total, 0);
    const rows = periodOrders.map((order) => ({
      order,
      customerName: demoCustomers.find((customer) => customer.id === order.customerId)?.fullName ?? null,
      itemCount: demoOrderItems.filter((item) => item.orderId === order.id).reduce((total, item) => total + item.quantity, 0),
    }));
    const topProducts = [...demoOrderItems.reduce((totals, item) => {
      if (!successfulOrderIds.has(item.orderId)) return totals;
      const current = totals.get(item.productName) ?? { name: item.productName, units: 0, revenue: 0 };
      current.units += item.quantity;
      current.revenue += item.lineTotal;
      totals.set(item.productName, current);
      return totals;
    }, new Map<string, { name: string; units: number; revenue: number }>()).values()]
      .sort((left, right) => right.revenue - left.revenue);
    return { rows, revenue, units: topProducts.reduce((total, item) => total + item.units, 0), averageOrder: successfulOrders.length ? revenue / successfulOrders.length : 0, topProducts, periodStart, periodEnd };
  }
  const store = await getCurrentStore();
  if (!db || !store) return null;
  const periodEnd = new Date();
  const periodStart = new Date(periodEnd);
  periodStart.setDate(periodStart.getDate() - 30);
  const rows = await db.select({
    order: orders,
    customerName: customers.fullName,
    itemCount: sum(orderItems.quantity),
  }).from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(and(eq(orders.storeId, store.id), gt(orders.createdAt, periodStart), lt(orders.createdAt, periodEnd)))
    .groupBy(orders.id, customers.fullName)
    .orderBy(desc(orders.createdAt));
  const successful = rows.filter(({ order }) => paidOrderStatuses.includes(order.status as (typeof paidOrderStatuses)[number]));
  const revenue = successful.reduce((total, row) => total + row.order.total, 0);
  const units = successful.reduce((total, row) => total + Number(row.itemCount ?? 0), 0);
  const topProducts = await db.select({ name: orderItems.productName, units: sum(orderItems.quantity), revenue: sum(orderItems.lineTotal) })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(eq(orders.storeId, store.id), gt(orders.createdAt, periodStart), lt(orders.createdAt, periodEnd), inArray(orders.status, paidOrderStatuses)))
    .groupBy(orderItems.productName)
    .orderBy(desc(sum(orderItems.lineTotal)))
    .limit(5);
  return { rows, revenue, units, averageOrder: successful.length ? revenue / successful.length : 0, topProducts, periodStart, periodEnd };
}

export async function getInventoryHistory(productId?: string) {
  const db = getDb();
  if (!db) return demoInventory.filter((movement) => !productId || movement.productId === productId).map((movement) => ({
    movement,
    productName: demoProducts.find((product) => product.id === movement.productId)?.name ?? "Product",
  }));
  const store = await getCurrentStore();
  if (!db || !store) return [];
  const conditions = [eq(inventoryMovements.storeId, store.id)];
  if (productId) conditions.push(eq(inventoryMovements.productId, productId));
  return db.select({ movement: inventoryMovements, productName: products.name })
    .from(inventoryMovements)
    .innerJoin(products, eq(inventoryMovements.productId, products.id))
    .where(and(...conditions))
    .orderBy(desc(inventoryMovements.createdAt))
    .limit(100);
}
