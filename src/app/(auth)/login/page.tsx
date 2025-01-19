"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const siginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type siginType = z.infer<typeof siginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<siginType>({
    resolver: zodResolver(siginSchema),
  });

  async function handleSignIn({ email, password }: siginType) {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      await signIn("credentials", {
        password,
        email,
        redirect: true,
        redirectTo: "/",
      });
    } catch (error) {
      alert("Erro ao fazer login");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleSignIn)}
      className="flex flex-col gap-2 w-full p-4 bg-rose-50 rounded-xl drop-shadow-md"
      action=""
    >
      <span className="mx-auto font-bold text-zinc-700 text-2xl">Fiance Wallet</span>
      <h1 className="text-xl font-semibold text-zinc-700">Login</h1>
      <div>
        <label htmlFor="email">Email</label>
        <Input
          {...register("email")}
          id="email"
          className="rounded-lg bg-white"
          placeholder="example@email.com"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <Input
          {...register("password")}
          id="password"
          className="rounded-lg bg-white"
          placeholder="password"
          type="password"
        />
        {errors.password && (
          <span className="text-red-500 text-xs">{errors.password.message}</span>
        )}
      </div>
      <div className="">
        <span className="text-sm">
          Ainda não tem conta?{" "}
          <Link href="/register" className="hover:underline">
            cadastre-se
          </Link>
        </span>
      </div>
      <Button type="submit" className="bg-rose-400 hover:bg-rose-500 rounded-lg">Entrar</Button>
    </form>
  );
}
