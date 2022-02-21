import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

import { Language } from '@features/language';

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
    newUser: "/profile",
  },
  callbacks: {
    async session({ session, user, token }) {
      const userLanguages = await prisma.userLanguages.findUnique({
        where: {
          id: user.id,
        }
      });
      const userLanguageTasks = await prisma.userLanguageTasks.findMany({
        where: {
          id: user.id,
          language: { in: userLanguages.language },
        }
      });
      const langToTasks = userLanguageTasks.reduce( (res, item) => {
        return {
          ...res,
          [item.language]: item.annotType,
        };
      }, {});
      const languages = userLanguages.language.map( (lang) => {
        return {
          language: lang,
          tasks: langToTasks[lang],
        } as Language;
      });
      session.userId = user.id;
      session.user.languages = languages;
      return session;
    },
  },
});
