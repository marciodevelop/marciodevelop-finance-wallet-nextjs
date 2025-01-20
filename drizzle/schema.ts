import { pgTable, unique, uuid, varchar, timestamp, foreignKey, serial, numeric, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const walletUsers = pgTable("wallet_users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	emailVerified: timestamp("email_verified", { mode: 'string' }),
	image: varchar({ length: 255 }),
}, (table) => [
	unique("wallet_users_email_unique").on(table.email),
]);

export const walletAccounts = pgTable("wallet_accounts", {
	id: uuid().defaultRandom(),
	accountNumber: serial("account_number").primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	balance: numeric({ precision: 10, scale:  2 }).notNull(),
	status: varchar({ length: 20 }).default('active').notNull(),
	type: varchar({ length: 20 }).default('checking').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [walletUsers.id],
			name: "wallet_accounts_user_id_wallet_users_id_fk"
		}),
]);

export const walletSessions = pgTable("wallet_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	sessionToken: varchar("session_token", { length: 255 }).notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [walletUsers.id],
			name: "wallet_sessions_user_id_wallet_users_id_fk"
		}),
]);

export const walletTransactions = pgTable("wallet_transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	transactionNumber: serial("transaction_number").notNull(),
	fromAccountNumber: integer("from_account_number").notNull(),
	toAccountNumber: integer("to_account_number").notNull(),
	transactionTypeId: uuid("transaction_type_id").notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	status: varchar({ length: 20 }).notNull(),
	description: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fromAccountNumber],
			foreignColumns: [walletAccounts.accountNumber],
			name: "wallet_transactions_from_account_number_wallet_accounts_account"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.toAccountNumber],
			foreignColumns: [walletAccounts.accountNumber],
			name: "wallet_transactions_to_account_number_wallet_accounts_account_n"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.transactionTypeId],
			foreignColumns: [walletTransactionTypes.id],
			name: "wallet_transactions_transaction_type_id_wallet_transaction_type"
		}),
	unique("wallet_transactions_transaction_number_unique").on(table.transactionNumber),
]);

export const walletTransactionReversals = pgTable("wallet_transaction_reversals", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	reversalNumber: serial("reversal_number").notNull(),
	originalTransactionNumber: integer("original_transaction_number").notNull(),
	reason: varchar({ length: 255 }).notNull(),
	status: varchar({ length: 20 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.originalTransactionNumber],
			foreignColumns: [walletTransactions.transactionNumber],
			name: "wallet_transaction_reversals_original_transaction_number_wallet"
		}).onDelete("cascade"),
	unique("wallet_transaction_reversals_reversal_number_unique").on(table.reversalNumber),
]);

export const walletTransactionTypes = pgTable("wallet_transaction_types", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }),
});
