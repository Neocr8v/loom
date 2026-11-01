import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);

export const payoutStatusEnum = pgEnum("payout_status", [
  "requested",
  "processing",
  "paid",
  "rejected",
]);

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    ownerName: varchar("owner_name", { length: 160 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 40 }),
    city: varchar("city", { length: 100 }).notNull().default("Accra"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("stores_slug_idx").on(table.slug)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 80 }).notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    description: text("description").notNull().default(""),
    category: varchar("category", { length: 100 }).notNull(),
    price: numeric("price", { precision: 12, scale: 2, mode: "number" }).notNull(),
    imageUrl: text("image_url"),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("products_store_sku_idx").on(table.storeId, table.sku),
    index("products_store_name_idx").on(table.storeId, table.name),
  ],
);

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    fullName: varchar("full_name", { length: 180 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 40 }),
    city: varchar("city", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("customers_store_email_idx").on(table.storeId, table.email),
    index("customers_store_name_idx").on(table.storeId, table.fullName),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    orderNumber: varchar("order_number", { length: 32 }).notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2, mode: "number" }).notNull(),
    deliveryFee: numeric("delivery_fee", { precision: 12, scale: 2, mode: "number" }).notNull().default(0),
    total: numeric("total", { precision: 12, scale: 2, mode: "number" }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("GHS"),
    shippingAddress: text("shipping_address"),
    customerNote: text("customer_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("orders_store_number_idx").on(table.storeId, table.orderNumber),
    index("orders_store_status_idx").on(table.storeId, table.status),
    index("orders_store_created_idx").on(table.storeId, table.createdAt),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: varchar("product_name", { length: 180 }).notNull(),
    quantity: integer("quantity").notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2, mode: "number" }).notNull(),
    lineTotal: numeric("line_total", { precision: 12, scale: 2, mode: "number" }).notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 80 }).notNull(),
    reference: varchar("reference", { length: 180 }),
    amount: numeric("amount", { precision: 12, scale: 2, mode: "number" }).notNull(),
    status: paymentStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("payments_reference_idx").on(table.reference), index("payments_order_idx").on(table.orderId)],
);

export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    quantityChange: integer("quantity_change").notNull(),
    reason: varchar("reason", { length: 120 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("inventory_store_created_idx").on(table.storeId, table.createdAt)],
);

export const payouts = pgTable(
  "payouts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 12, scale: 2, mode: "number" }).notNull(),
    status: payoutStatusEnum("status").notNull().default("requested"),
    reference: varchar("reference", { length: 100 }).notNull(),
    requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [index("payouts_store_requested_idx").on(table.storeId, table.requestedAt)],
);
