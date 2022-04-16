import NextAuth from 'next-auth';
import type { User } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Prisma, PrismaClient } from "@prisma/client";

import { allLanguages, cldrLanguages } from '@common/DisplayLanguages';
import { getTaskCategoryMap, getTaskModeMap } from '@common/TaskUtils';
import { fetchUserLanguages } from '@common/UserUtils';
import type { LanguageTasks, TaskMeta, TaskMetaJson, TaskCategory, TaskMode } from '@features/tasks';

const prisma = new PrismaClient();

const taskModeMap = await getTaskModeMap(prisma);
const taskCategoryMap = await getTaskCategoryMap(prisma);

const languageMap = allLanguages.reduce( (result, language) => {
  result.set(language.isoCode, language);
  return result;
}, new Map());

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_AUTH_ID,
      clientSecret: process.env.GITHUB_AUTH_SECRET,
    }),
  ],
  theme: {
    colorScheme: 'auto',
    logo: '/surface.svg',
  },
  pages: {
    newUser: '/profile',
  },
  callbacks: {
    async session({ session, user, token }) {
      session.userId = user.id;
      session.user.languages = await fetchUserLanguages(
        prisma, user.id, languageMap, taskModeMap, taskCategoryMap);
      return session;
    },
  },
});
