'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const newUserSchemavalidationSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

type NewUserFormData = z.infer<typeof newUserSchemavalidationSchema>;

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<NewUserFormData>({
    resolver: zodResolver(newUserSchemavalidationSchema),
  });

  async function handleCreateNewUser(data: NewUserFormData) {
    const formData = {
      name: data.name,
      email: data.email,
      password: data.password,
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        }
      })

      const data = await response.json();

      console.log(data);

      // const response = await signup(formData);
    } catch (error) {
      console.error("Erro ao cadastrar usuário ss:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleCreateNewUser)} className="flex flex-col gap-2 w-full">
      <div>
        <label htmlFor="name">Nome</label>
        <Input {...register("name")} id="name" placeholder="Jose" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input
          {...register("email")}
          id="email"
          placeholder="example@email.com"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Senha</label>
        <Input
          {...register("password")}
          id="password"
          placeholder="password"
          type="password"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirme a senha</label>
        <Input
          {...register("confirmPassword")}
          id="confirmPassword"
          placeholder="password"
          type="password"
        />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" className="w-full">Cadastrar</Button>
    </form>
  );
}
