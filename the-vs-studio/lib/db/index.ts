/**
 * Database barrel export.
 * Prefer getDb() at call sites so SQLite is not opened during static builds.
 */
export { createSqliteDb, getDb } from "./client";
export * from "./schema";
