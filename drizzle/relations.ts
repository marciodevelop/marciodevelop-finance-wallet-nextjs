import { relations } from "drizzle-orm/relations";
import { walletUsers, walletAccounts, walletSessions, walletTransactions, walletTransactionTypes, walletTransactionReversals } from "./schema";

export const walletAccountsRelations = relations(walletAccounts, ({one, many}) => ({
	walletUser: one(walletUsers, {
		fields: [walletAccounts.userId],
		references: [walletUsers.id]
	}),
	walletTransactions_fromAccountId: many(walletTransactions, {
		relationName: "walletTransactions_fromAccountId_walletAccounts_id"
	}),
	walletTransactions_toAccountId: many(walletTransactions, {
		relationName: "walletTransactions_toAccountId_walletAccounts_id"
	}),
}));

export const walletUsersRelations = relations(walletUsers, ({many}) => ({
	walletAccounts: many(walletAccounts),
	walletSessions: many(walletSessions),
}));

export const walletSessionsRelations = relations(walletSessions, ({one}) => ({
	walletUser: one(walletUsers, {
		fields: [walletSessions.userId],
		references: [walletUsers.id]
	}),
}));

export const walletTransactionsRelations = relations(walletTransactions, ({one, many}) => ({
	walletAccount_fromAccountId: one(walletAccounts, {
		fields: [walletTransactions.fromAccountId],
		references: [walletAccounts.id],
		relationName: "walletTransactions_fromAccountId_walletAccounts_id"
	}),
	walletAccount_toAccountId: one(walletAccounts, {
		fields: [walletTransactions.toAccountId],
		references: [walletAccounts.id],
		relationName: "walletTransactions_toAccountId_walletAccounts_id"
	}),
	walletTransactionType: one(walletTransactionTypes, {
		fields: [walletTransactions.transactionTypeId],
		references: [walletTransactionTypes.id]
	}),
	walletTransactionReversals: many(walletTransactionReversals),
}));

export const walletTransactionTypesRelations = relations(walletTransactionTypes, ({many}) => ({
	walletTransactions: many(walletTransactions),
}));

export const walletTransactionReversalsRelations = relations(walletTransactionReversals, ({one}) => ({
	walletTransaction: one(walletTransactions, {
		fields: [walletTransactionReversals.originalTransactionId],
		references: [walletTransactions.id]
	}),
}));