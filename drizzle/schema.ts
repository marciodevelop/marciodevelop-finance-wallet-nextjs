import { pgTable, unique, uuid, varchar, timestamp, foreignKey, numeric } from "drizzle-orm/pg-core"
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
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	balance: numeric({ precision: 10, scale:  2 }).notNull(),
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
	unique("wallet_sessions_session_token_unique").on(table.sessionToken),
]);

export const walletTransactions = pgTable("wallet_transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fromAccountId: uuid("from_account_id").notNull(),
	toAccountId: uuid("to_account_id").notNull(),
	transactionTypeId: uuid("transaction_type_id").notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	status: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fromAccountId],
			foreignColumns: [walletAccounts.id],
			name: "wallet_transactions_from_account_id_wallet_accounts_id_fk"
		}),
	foreignKey({
			columns: [table.toAccountId],
			foreignColumns: [walletAccounts.id],
			name: "wallet_transactions_to_account_id_wallet_accounts_id_fk"
		}),
	foreignKey({
			columns: [table.transactionTypeId],
			foreignColumns: [walletTransactionTypes.id],
			name: "wallet_transactions_transaction_type_id_wallet_transaction_type"
		}),
]);

export const walletTransactionReversals = pgTable("wallet_transaction_reversals", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	originalTransactionId: uuid("original_transaction_id").notNull(),
	reason: varchar({ length: 255 }).notNull(),
	status: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.originalTransactionId],
			foreignColumns: [walletTransactions.id],
			name: "wallet_transaction_reversals_original_transaction_id_wallet_tra"
		}),
]);

export const walletTransactionTypes = pgTable("wallet_transaction_types", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }),
}, (table) => [
	unique("wallet_transaction_types_name_unique").on(table.name),
]);
