import { transactionHistory } from "@/actions/transactions/transaction-history";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const param = url.searchParams.get("fromAccountNumber")
    const response = await transactionHistory(Number(param));

    return response;
  } catch (error) {
    return error;
  }
}