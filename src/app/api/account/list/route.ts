import { listAccountCurrentUser } from "@/actions/transactions/list-account-current-user";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const param = url.searchParams.get("userId")

    if (!param) {
      return NextResponse.json({ error: "O Parametro 'userId' e obrigatorio" }, { status: 400 });
    }

    const response = await listAccountCurrentUser(param);
    return response;
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
