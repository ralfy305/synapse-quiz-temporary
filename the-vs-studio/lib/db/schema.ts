import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Drizzle schema for the local Synapse SQLite store.
 * Table DDL is also ensured at runtime in client.ts for desktop packaging.
 */

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const couples = sqliteTable("couples", {
  id: text("id").primaryKey(),
  inviteCode: text("invite_code").notNull(),
  partner1Id: text("partner1_id"),
  partner2Id: text("partner2_id"),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const quizResponses = sqliteTable("quiz_responses", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  moduleId: text("module_id").notNull(),
  questionId: text("question_id").notNull(),
  answer: text("answer").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const airlockMessages = sqliteTable("airlock_messages", {
  id: text("id").primaryKey(),
  coupleId: text("couple_id"),
  senderId: text("sender_id"),
  senderType: text("sender_type").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
});
