import "server-only";

import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { demoStore } from "./demo-data";

const globalForDb = globalThis as typeof globalThis & {
  fashionDb?: ReturnType<typeof drizzle<typeof schema>>;
};

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  globalForDb.fashionDb ??= drizzle(neon(connectionString), { schema });
  return globalForDb.fashionDb;
}

export function requireDb() {
  const db = getDb();
  if (!db) {
    throw new Error("DATABASE_URL is missing. Configure your Neon database before using maker tools.");
  }
  return db;
}

export async function getCurrentStore() {
  const db = getDb();
  if (!db) return demoStore;

  const { stores } = schema;
  try {
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.slug, process.env.DASHBOARD_STORE_SLUG ?? "next-store"))
      .limit(1);
    return store ?? null;
  } catch (error) {
    console.error("Unable to read the configured Neon store. Verify migrations and DATABASE_URL.", error);
    return null;
  }
}
