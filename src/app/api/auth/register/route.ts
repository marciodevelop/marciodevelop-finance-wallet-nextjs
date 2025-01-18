import { NextResponse } from "next/server";
import { registerUser } from "@/actions/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const response = await registerUser(body);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json({ error: "Erro ao cadastrar usuáriod" }, { status: 500 });
  }
}