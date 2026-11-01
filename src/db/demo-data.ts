import type * as schema from "./schema";

type StoreRow = typeof schema.stores.$inferSelect;
type ProductRow = typeof schema.products.$inferSelect;
type CustomerRow = typeof schema.customers.$inferSelect;
type OrderRow = typeof schema.orders.$inferSelect;
type OrderItemRow = typeof schema.orderItems.$inferSelect;
type PaymentRow = typeof schema.payments.$inferSelect;
type PayoutRow = typeof schema.payouts.$inferSelect;
type InventoryRow = typeof schema.inventoryMovements.$inferSelect;

const storeId = "10000000-0000-4000-8000-000000000001";
const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 86_400_000);

export const demoStore: StoreRow = {
  id: storeId,
  name: "Next Store",
  slug: "next-store",
  ownerName: "Akosua Agyeman",
  email: "hello@nextstore.example",
  phone: "+233 20 000 0000",
  city: "Accra",
  createdAt: daysAgo(190),
  updatedAt: now,
};

export const demoProducts: ProductRow[] = [
  { id: "20000000-0000-4000-8000-000000000001", storeId, sku: "NS-DRESS-001", name: "The Naa red top-handle bag", description: "A structured red top-handle bag with polished hardware.", category: "Accessories", price: 680, imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85", stockQuantity: 3, isPublished: true, createdAt: daysAgo(60), updatedAt: now },
  { id: "20000000-0000-4000-8000-000000000002", storeId, sku: "NS-BAG-001", name: "Sunday market tote", description: "A roomy everyday tote.", category: "Accessories", price: 240, imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85", stockQuantity: 18, isPublished: true, createdAt: daysAgo(45), updatedAt: daysAgo(2) },
  { id: "20000000-0000-4000-8000-000000000003", storeId, sku: "NS-SHIRT-001", name: "Everyday linen shirt", description: "An easy-fit linen shirt.", category: "Clothing", price: 420, imageUrl: "https://images.pexels.com/photos/3021601/pexels-photo-3021601.jpeg?auto=compress&cs=tinysrgb&w=900", stockQuantity: 12, isPublished: true, createdAt: daysAgo(34), updatedAt: daysAgo(4) },
  { id: "20000000-0000-4000-8000-000000000004", storeId, sku: "NS-DRESS-002", name: "Kente knot mini", description: "A limited-run contemporary mini dress.", category: "Clothing", price: 560, imageUrl: "https://images.pexels.com/photos/14761883/pexels-photo-14761883.jpeg?auto=compress&cs=tinysrgb&w=900", stockQuantity: 5, isPublished: true, createdAt: daysAgo(21), updatedAt: daysAgo(1) },
  { id: "20000000-0000-4000-8000-000000000005", storeId, sku: "NS-JACKET-001", name: "Osu cropped jacket", description: "A relaxed cropped jacket.", category: "Clothing", price: 890, imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85", stockQuantity: 8, isPublished: false, createdAt: daysAgo(12), updatedAt: daysAgo(1) },
];

export const demoCustomers: CustomerRow[] = [
  { id: "30000000-0000-4000-8000-000000000001", storeId, fullName: "Ama Mensah", email: "ama@example.test", phone: "+233 20 000 1001", city: "Accra", createdAt: daysAgo(35) },
  { id: "30000000-0000-4000-8000-000000000002", storeId, fullName: "Kojo Owusu", email: "kojo@example.test", phone: "+233 24 000 1002", city: "Kumasi", createdAt: daysAgo(21) },
  { id: "30000000-0000-4000-8000-000000000003", storeId, fullName: "Efua Frimpong", email: "efua@example.test", phone: "+233 50 000 1003", city: "Cape Coast", createdAt: daysAgo(13) },
  { id: "30000000-0000-4000-8000-000000000004", storeId, fullName: "Yaw Boateng", email: "yaw@example.test", phone: "+233 27 000 1004", city: "Accra", createdAt: daysAgo(6) },
];

export const demoOrders: OrderRow[] = [
  { id: "40000000-0000-4000-8000-000000000001", storeId, customerId: demoCustomers[0].id, orderNumber: "NS-2048", status: "processing", subtotal: 680, deliveryFee: 0, total: 680, currency: "GHS", shippingAddress: "Osu, Accra", customerNote: null, createdAt: new Date(now.getTime() - 35 * 60_000), updatedAt: now },
  { id: "40000000-0000-4000-8000-000000000002", storeId, customerId: demoCustomers[1].id, orderNumber: "NS-2047", status: "shipped", subtotal: 420, deliveryFee: 0, total: 420, currency: "GHS", shippingAddress: "Adum, Kumasi", customerNote: null, createdAt: new Date(now.getTime() - 4 * 3_600_000), updatedAt: now },
  { id: "40000000-0000-4000-8000-000000000003", storeId, customerId: demoCustomers[2].id, orderNumber: "NS-2046", status: "paid", subtotal: 240, deliveryFee: 0, total: 240, currency: "GHS", shippingAddress: "Cape Coast", customerNote: null, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: "40000000-0000-4000-8000-000000000004", storeId, customerId: demoCustomers[3].id, orderNumber: "NS-2045", status: "delivered", subtotal: 560, deliveryFee: 20, total: 580, currency: "GHS", shippingAddress: "East Legon, Accra", customerNote: null, createdAt: daysAgo(4), updatedAt: daysAgo(2) },
  { id: "40000000-0000-4000-8000-000000000005", storeId, customerId: demoCustomers[0].id, orderNumber: "NS-2044", status: "pending", subtotal: 890, deliveryFee: 0, total: 890, currency: "GHS", shippingAddress: "Osu, Accra", customerNote: null, createdAt: daysAgo(7), updatedAt: daysAgo(7) },
];

const orderItemsForDemo: OrderItemRow[] = [
  { id: "50000000-0000-4000-8000-000000000001", orderId: demoOrders[0].id, productId: demoProducts[0].id, productName: demoProducts[0].name, quantity: 1, unitPrice: 680, lineTotal: 680 },
  { id: "50000000-0000-4000-8000-000000000002", orderId: demoOrders[1].id, productId: demoProducts[2].id, productName: demoProducts[2].name, quantity: 1, unitPrice: 420, lineTotal: 420 },
  { id: "50000000-0000-4000-8000-000000000003", orderId: demoOrders[2].id, productId: demoProducts[1].id, productName: demoProducts[1].name, quantity: 1, unitPrice: 240, lineTotal: 240 },
  { id: "50000000-0000-4000-8000-000000000004", orderId: demoOrders[3].id, productId: demoProducts[3].id, productName: demoProducts[3].name, quantity: 1, unitPrice: 560, lineTotal: 560 },
  { id: "50000000-0000-4000-8000-000000000005", orderId: demoOrders[4].id, productId: demoProducts[4].id, productName: demoProducts[4].name, quantity: 1, unitPrice: 890, lineTotal: 890 },
];

export const demoPayments: PaymentRow[] = demoOrders.slice(0, 4).map((order, index) => ({
  id: `60000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  orderId: order.id,
  provider: "Demo payment",
  reference: `DEMO-${order.orderNumber}`,
  amount: order.total,
  status: "succeeded",
  createdAt: order.createdAt,
}));

export const demoPayouts: PayoutRow[] = [
  { id: "70000000-0000-4000-8000-000000000001", storeId, amount: 1000, status: "paid", reference: "PO-DEMO-1001", requestedAt: daysAgo(10), completedAt: daysAgo(8) },
  { id: "70000000-0000-4000-8000-000000000002", storeId, amount: 500, status: "processing", reference: "PO-DEMO-1002", requestedAt: daysAgo(2), completedAt: null },
];

export const demoInventory: InventoryRow[] = demoProducts.map((product, index) => ({
  id: `80000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  storeId,
  productId: product.id,
  orderId: null,
  quantityChange: product.stockQuantity,
  reason: "Opening stock (demo)",
  createdAt: product.createdAt,
}));

export const demoOrderItems = orderItemsForDemo;
export const demoTotals = { sales: 12_840, orderCount: 48, pendingCount: 4, customerCount: 186 };
