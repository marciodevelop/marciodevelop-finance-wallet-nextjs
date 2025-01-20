"use client";
import { useSession } from "next-auth/react";
import { TransactionButton } from "./(components)/transaction-button";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const schema = z.object({
  amount: z.coerce.number().positive(),
});

const schemaTransfer = z.object({
  toAccountNumber: z.any(),
  amount: z.coerce.number().positive(),
});

export default function Page() {
  const session = useSession();
  const [userAccountId, setUserAccountId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { register: registerTransfer, handleSubmit: handleSubmitTransfer } = useForm<z.infer<typeof schemaTransfer>>({
    resolver: zodResolver(schemaTransfer),
  });

  async function handleDeposit(data: z.infer<typeof schema>) {
    const bodyData = {
      userId: session.data?.user?.id,
      amount: data.amount,
    };

    try {
      const response = await fetch("/api/deposit", {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleTransfer(data: any) {
    const bodyData = {
      fromAccountNumber: userAccountId,
      toAccountNumber: Number(data.toAccountNumber),
      amount: data.amount,
    };
      try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getAccountId(userId: string) {
    try {
      const response = await fetch(`/api/account/list?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch account data");
      }

      const data = await response.json();

      setUserAccountId(data.accountNumber);
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  }

  async function getTransactions(fromAccountNumber: number) {
    try {
      const response = await fetch(`/api/transactions?fromAccountNumber=${fromAccountNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTransactions(data.data);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    if(!userAccountId && session.data?.user?.id) {
      getAccountId(session.data?.user?.id)
    }
  }, [session.data?.user?.id])
  
  useEffect(() => {
    if (userAccountId) {
      getTransactions(Number(userAccountId));
    }
  }, [userAccountId]);
 

  return (
    <section className="p-4 h-svh grid grid-cols-5 gap-2">
      <div className="col-span-3 flex flex-col items-start justify-center rounded-xl h-[110px] w-full bg-rose-50 p-2 border border-zinc-300">
        <h2 className="text-sm text-zinc-800">Conta</h2>
        <span className="font-bold text-3xl text-zinc-700">
          {Number(600).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>
      <div className="col-span-2 flex flex-col gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <TransactionButton title="Depositar" icon="ArrowDownCircleIcon" />
          </DialogTrigger>
          <DialogContent className="w-[400px] bg-rose-50 rounded-lg">
            <DialogHeader>
              <DialogTitle>Depositar</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(handleDeposit)}
              className="flex flex-col gap-2"
            >
              <label htmlFor="amount">Valor</label>
              <Input {...register("amount")} id="amount" type="number" />
              <Button
                type="submit"
                className="bg-rose-400 hover:bg-rose-500 rounded-lg"
              >
                Depositar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <TransactionButton title="Transferir" icon="ArrowUpCircleIcon" />
          </DialogTrigger>
          <DialogContent className="w-[400px] bg-rose-50 rounded-lg">
            <DialogHeader>
              <DialogTitle>Transferir</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitTransfer(handleTransfer)} className="flex flex-col gap-2">
              <label htmlFor="amount">Valor</label>
              <Input {...registerTransfer('amount')} id="amount" type="number" />
              <label htmlFor="toAccountNumber">Conta de destino</label>
              <Input {...registerTransfer('toAccountNumber')} id="toAccountNumber" type="number" />
              <Button
                type="submit"
                className="bg-rose-400 hover:bg-rose-500 rounded-lg"
              >
                Transferir
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="col-span-5 flex flex-col gap-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>valor</TableHead>
              <TableHead>data</TableHead>
              <TableHead>descri</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                const date = new Date(transaction.createdAt);

                return (
                  <TableRow key={transaction.id}>
                  <TableHead>{transaction.amount}</TableHead>
                  <TableHead>{date.toLocaleDateString('pt-BR')}</TableHead>
                  <TableHead>{transaction.description}</TableHead>
                </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableHead>Nenhuma transação encontrada</TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
