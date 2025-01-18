import "dotenv"
import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import CredentialsProvider from "next-auth/providers/credentials"
import { eq } from "drizzle-orm"
import { users } from "@/db/schema"
import bcript from "bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
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
        
        const isValidPassword = await bcript.compare(credentials.password as string, user.password);
        console.log("Is valid password:", isValidPassword);

        if (!isValidPassword) {
          throw new Error("Invalid password.");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: 'znRe4f/JTgU5RPxHnQW37XfxZwIeAwPamxVIn6X/8EA=',
})