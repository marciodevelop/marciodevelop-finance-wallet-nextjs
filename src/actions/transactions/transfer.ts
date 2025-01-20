import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, accounts, transactions, transactiontypes } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";


const TransferSchema = z.object({
  fromAccountNumber: z.number(),
  toAccountNumber: z.number(),
  amount: z.number().positive(),
});

export const transfer = async (body: z.infer<typeof TransferSchema>) => {
  try {
    const { fromAccountNumber, toAccountNumber, amount } = body;

    return await db.transaction(async (tx) => {
      const fromAccount = await tx.query.accounts.findFirst({
        where: (accounts, { eq }) => eq(accounts.accountNumber, fromAccountNumber),
      });

      if (!fromAccount) {
        return NextResponse.json(
          { error: "Conta de origem não encontrada." },
          { status: 404 }
        );
      }

      if (Number(fromAccount.balance) < amount) {
        return NextResponse.json(
          { error: "Saldo insuficiente para a transferência." },
          { status: 400 }
        );
      }

      const toAccount = await tx.query.accounts.findFirst({
        where: (accounts, { eq }) => eq(accounts.accountNumber, toAccountNumber),
      });

      if (!toAccount) {
        return NextResponse.json(
          { error: "Conta de destino não encontrada." },
          { status: 404 }
        );
      }

      const updatedFromBalance = Number(fromAccount.balance) - amount;
      const updatedToBalance = Number(toAccount.balance) + amount;

      await tx.update(accounts)
        .set({ balance: String(updatedFromBalance) })
        .where(eq(accounts.accountNumber, fromAccountNumber));

      await tx.update(accounts)
        .set({ balance: String(updatedToBalance) })
        .where(eq(accounts.accountNumber, toAccountNumber));

      const transferType = await tx.query.transactiontypes.findFirst({
        where: (types, { eq }) => eq(types.name, "TRANSFER"),
      });

      if (!transferType) {
        throw new Error("Tipo de transação 'TRANSFER' não encontrado.");
      }

      await tx.insert(transactions).values({
        fromAccountNumber,
        toAccountNumber,
        transactionTypeId: transferType.id,
        amount: String(amount),
        status: "completed",
        description: "Transferência entre contas",
      });

      return NextResponse.json(
        { message: "Transferência realizada com sucesso." },
        { status: 200 }
      );
    });
  } catch (error) {
    console.error("Erro na transferência:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar a transferência." },
      { status: 500 }
    );
  }
};
