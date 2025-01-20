import "dotenv"
import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import authConfig from "./auth.config"
import { User } from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  ...authConfig,
  callbacks: {
    async session({ session, token }) {
      const user = token.user as User;
      if (user) {
        session.user.id = user.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: 'znRe4f/JTgU5RPxHnQW37XfxZwIeAwPamxVIn6X/8EA=',
})