import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";

const depositSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
});

export const deposit = async (body: z.infer<typeof depositSchema>) => {
  try {
    const { userId, amount } = body

    return await db.transaction(async (tx) => {

      const account = await tx.query.accounts.findFirst({
        where: (accounts, { eq }) => eq(accounts.userId, userId),
      });
      
      if (!account) {
        throw new Error("Conta não encontrada");
      }
      
      const depositType = await tx.query.transactiontypes.findFirst({
        where: (types, { eq }) => eq(types.name, "DEPOSIT"),
      });

      if (!depositType) {
        throw new Error("Tipo de transação não encontrado");
      }

      const newBalance = Number(account.balance) + amount;

      const [updatedAccount] = await tx
        .update(accounts)
        .set({
          balance: String(newBalance),
          updatedAt: new Date(),
        })
        .where(eq(accounts.accountNumber, account.accountNumber))
        .returning();

      console.log("Account updated:", updatedAccount);

      const [transaction] = await tx
        .insert(transactions)
        .values({
          fromAccountNumber: account.accountNumber,
          toAccountNumber: account.accountNumber,
          transactionTypeId: depositType.id,
          amount: String(amount),
          status: "completed",
          description: "Depósito em conta",
        })
        .returning();

      return NextResponse.json({
        message: "Depósito realizado com sucesso",
        data: {
          accountNumber: updatedAccount.accountNumber,
          newBalance: updatedAccount.balance,
          transactionId: transaction.id,
        },
      }, { status: 200 });
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Dados inválidos para depósito",
        details: error,
      }, { status: 400 });
    }

    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
      }, { status: 400 });
    }

    return NextResponse.json({
      error: "Erro ao processar depósito",
    }, { status: 500 });
  }
};