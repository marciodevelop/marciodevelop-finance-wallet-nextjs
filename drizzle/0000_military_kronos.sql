CREATE TABLE "wallet_accounts" (
	"id" uuid DEFAULT gen_random_uuid(),
	"account_number" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"balance" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"type" varchar(20) DEFAULT 'checking' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet_transaction_reversals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reversal_number" serial NOT NULL,
	"original_transaction_number" integer NOT NULL,
	"reason" varchar(255) NOT NULL,
	"status" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_transaction_reversals_reversal_number_unique" UNIQUE("reversal_number")
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_number" serial NOT NULL,
	"from_account_number" integer NOT NULL,
	"to_account_number" integer NOT NULL,
	"transaction_type_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" varchar(20) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_transactions_transaction_number_unique" UNIQUE("transaction_number")
);
--> statement-breakpoint
CREATE TABLE "wallet_transaction_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "wallet_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"email_verified" timestamp,
	"image" varchar(255),
	CONSTRAINT "wallet_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "wallet_accounts" ADD CONSTRAINT "wallet_accounts_user_id_wallet_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."wallet_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_sessions" ADD CONSTRAINT "wallet_sessions_user_id_wallet_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."wallet_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transaction_reversals" ADD CONSTRAINT "wallet_transaction_reversals_original_transaction_number_wallet_transactions_transaction_number_fk" FOREIGN KEY ("original_transaction_number") REFERENCES "public"."wallet_transactions"("transaction_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_from_account_number_wallet_accounts_account_number_fk" FOREIGN KEY ("from_account_number") REFERENCES "public"."wallet_accounts"("account_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_to_account_number_wallet_accounts_account_number_fk" FOREIGN KEY ("to_account_number") REFERENCES "public"."wallet_accounts"("account_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_transaction_type_id_wallet_transaction_types_id_fk" FOREIGN KEY ("transaction_type_id") REFERENCES "public"."wallet_transaction_types"("id") ON DELETE no action ON UPDATE no action;