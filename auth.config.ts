import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"

export default {
  providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required.");
          }
  
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email as string),
          });
  
          if (!user) {
            throw new Error("No user found with this email.");
          }
          
          const isValidPassword = await compare(credentials.password as string, user.password);
          console.log("Is valid password:", isValidPassword);
  
          if (!isValidPassword) {
            throw new Error("Invalid password.");
          }
  
          return user;
        },
      }),
    ],
} as NextAuthConfig