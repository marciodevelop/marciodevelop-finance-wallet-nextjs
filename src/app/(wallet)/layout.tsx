"use client";
import { Header } from "@/components/ui/header";
import { useSession } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  console.log("Session:", status);

  return (
    <section className="max-w-[800px] mx-auto h-screen">
      <Header />
      {children}
    </section>
  );
}
