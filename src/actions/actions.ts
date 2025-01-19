import { NextResponse } from "next/server";
import { db } from "@/db"
import { users } from "@/db/schema"
import { z } from "zod"
import { hash } from "bcryptjs"

const registerUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

export const registerUser = async (body: any) => {
  
  const { name, email, password } = await body

  const isExistingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if(isExistingUser) {
    return NextResponse.json({ error: "email ja cadastrado" }, { status: 400 })
  }

  const hashedpassword = await hash(password, 10)

  await db.insert(users).values({
    name,
    email,
    password: hashedpassword,
  })

  return NextResponse.json({ message: "Usuário cadastrado com sucesso" }, { status: 201 })
}