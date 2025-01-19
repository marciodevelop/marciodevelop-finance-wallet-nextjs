"use client";
import { useSession } from "next-auth/react";

export default function Page() {
  const session = useSession();

  return (
    <section className="p-4 h-svh">
      {/* <h1>dados de sesao</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre> */}
      <div className="rounded-xl h-[100px] w-[300px] bg-rose-50 p-2 border border-zinc-300">
        <h2 className="text-md text-zinc-800">Conta</h2>
        <span className="font-bold text-3xl text-zinc-700">{Number(600).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}</span>
      </div>
    </section>
  );
}
