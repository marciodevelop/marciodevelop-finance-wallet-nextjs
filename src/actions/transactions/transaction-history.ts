import { db } from "@/db";
import { NextResponse } from "next/server";

export async function transactionHistory(fromAccountNumber: number) {
  
  try {
    if (!fromAccountNumber || typeof fromAccountNumber !== 'number') {
      return NextResponse.json(
        { error: "Invalid account number" },
        { status: 400 }
      );
    }

    const transactionHistory = await db.query.transactions.findMany({
      where: (transactions, { eq }) =>
        eq(transactions.fromAccountNumber, fromAccountNumber),
    });

    if (!transactionHistory || transactionHistory.length === 0) {
      return NextResponse.json(
        { error: "No transactions found for this account" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: transactionHistory },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching transaction history" },
      { status: 500 }
    );
  }
}