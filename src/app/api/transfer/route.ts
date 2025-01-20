import { transfer } from "@/actions/transactions/transfer";
import { NextRequest } from "next/server";


export async function POST(resquest: NextRequest) {
  try {
    const body = await resquest.json();

    const response = await transfer(body);
    return response;
  } catch (error) {
    return error;
  }
} 