import { varchar, timestamp, decimal, uuid, pgTableCreator } from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `wallet_${name}`);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  emailVerified: timestamp("email_verified"),
  image: varchar("image", { length: 255 })
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromAccountId: uuid("from_account_id").notNull().references(() => accounts.id),
  toAccountId: uuid("to_account_id").notNull().references(() => accounts.id),
  transactionTypeId: uuid("transaction_type_id").notNull().references(() => transactiontypes.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactiontypes = pgTable("transaction_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
});

export const transactionReversals = pgTable("transaction_reversals", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalTransactionId: uuid("original_transaction_id").notNull().references(() => transactions.id),
  reason: varchar("reason", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
