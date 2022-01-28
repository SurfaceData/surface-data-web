import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_AUTH_ID,
      clientSecret: process.env.GITHUB_AUTH_SECRET,
    }),
  ],
  pages: {
    newUser: "/new_user",
  },
  callbacks: {
    async session({ session, user, token }) {
      let { id, ...sessionUser } = user;
      session.user = sessionUser;
      return session;
    },
  },
});
