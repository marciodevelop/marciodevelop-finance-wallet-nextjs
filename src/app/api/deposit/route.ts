import { deposit } from "@/actions/transactions"; 
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await deposit(body);

    return NextResponse.json(response,  { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
