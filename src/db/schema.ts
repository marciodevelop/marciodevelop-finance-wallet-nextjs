import {
  varchar,
  timestamp,
  decimal,
  uuid,
  pgTableCreator,
  serial,
  integer,
} from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `wallet_${name}`);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  emailVerified: timestamp("email_verified"),
  image: varchar("image", { length: 255 }),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom(),
  accountNumber: serial("account_number").primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  type: varchar("type", { length: 20 }).notNull().default("checking"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionNumber: serial("transaction_number").notNull().unique(),
  fromAccountNumber: integer("from_account_number")
    .notNull()
    .references(() => accounts.accountNumber, { onDelete: "cascade" }),
  toAccountNumber: integer("to_account_number")
    .notNull()
    .references(() => accounts.accountNumber, { onDelete: "cascade" }),
  transactionTypeId: uuid("transaction_type_id")
    .notNull()
    .references(() => transactiontypes.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactiontypes = pgTable("transaction_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
});

export const transactionReversals = pgTable("transaction_reversals", {
  id: uuid("id").primaryKey().defaultRandom(),
  reversalNumber: serial("reversal_number").unique().notNull(),
  originalTransactionNumber: integer("original_transaction_number")
    .notNull()
    .references(() => transactions.transactionNumber, { onDelete: "cascade" }),
  reason: varchar("reason", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  sessionToken: varchar("session_token", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});