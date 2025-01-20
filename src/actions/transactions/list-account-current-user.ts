import { db } from "@/db";
import { NextResponse } from "next/server";

export const listAccountCurrentUser = async (userId: string) => {
  try {
    const account = await db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.userId, userId),
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
