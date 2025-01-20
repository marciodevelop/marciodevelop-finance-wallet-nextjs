import { relations } from "drizzle-orm/relations";
import { walletUsers, walletAccounts, walletSessions, walletTransactions, walletTransactionTypes, walletTransactionReversals } from "./schema";

export const walletAccountsRelations = relations(walletAccounts, ({one, many}) => ({
	walletUser: one(walletUsers, {
		fields: [walletAccounts.userId],
		references: [walletUsers.id]
	}),
	walletTransactions_fromAccountNumber: many(walletTransactions, {
		relationName: "walletTransactions_fromAccountNumber_walletAccounts_accountNumber"
	}),
	walletTransactions_toAccountNumber: many(walletTransactions, {
		relationName: "walletTransactions_toAccountNumber_walletAccounts_accountNumber"
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
	walletAccount_fromAccountNumber: one(walletAccounts, {
		fields: [walletTransactions.fromAccountNumber],
		references: [walletAccounts.accountNumber],
		relationName: "walletTransactions_fromAccountNumber_walletAccounts_accountNumber"
	}),
	walletAccount_toAccountNumber: one(walletAccounts, {
		fields: [walletTransactions.toAccountNumber],
		references: [walletAccounts.accountNumber],
		relationName: "walletTransactions_toAccountNumber_walletAccounts_accountNumber"
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
		fields: [walletTransactionReversals.originalTransactionNumber],
		references: [walletTransactions.transactionNumber]
	}),
}));