import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users, accounts } from "@/db/schema";
import { hash } from "bcryptjs";

const registerUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

function generateAccountNumber(): number {
  const maxAccountNumber = 2147483647;
  const randomNumber = Math.floor(Math.random() * maxAccountNumber);
  return randomNumber;
}

export const registerUser = async (body: z.infer<typeof registerUserSchema>) => {
  try {
    const { name, email, password } = body;

    const isExistingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (isExistingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    let accountNumber: number = 0;
    let isAccountNumberUnique = false;

    while (!isAccountNumberUnique) {
      accountNumber = generateAccountNumber();
      const existingAccount = await db.query.accounts.findFirst({
        where: (accounts, { eq }) => eq(accounts.accountNumber, accountNumber),
      });

      if (!existingAccount) {
        isAccountNumberUnique = true;
      }
    }

    const [newAccount] = await db.insert(accounts).values({
      accountNumber,
      userId: newUser.id,
      balance: "0.00",
      status: "active",
      type: "checking",
    });

    return NextResponse.json(
      { message: "Usuário cadastrado com sucesso", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao processar o cadastro" },
      { status: 500 }
    );
  }
};
