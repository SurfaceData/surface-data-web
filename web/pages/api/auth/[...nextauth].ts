import NextAuth from 'next-auth';
import type { User } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Prisma, PrismaClient } from "@prisma/client";

import { allLanguages, cldrLanguages } from '@common/DisplayLanguages';
import { getTaskCategoryMap, getTaskModeMap } from '@common/TaskUtils';
import type { LanguageTasks, TaskMeta, TaskCategory, TaskMode } from '@features/tasks';

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
      session.user.languages = await fetchLanguages(user);
      return session;
    },
  },
});

const fetchLanguages = async (user: User) => {
  const userLanguagesResult = await prisma.userLanguages.findUnique({
    where: {
      id: user.id,
    }
  });
  if (!userLanguagesResult) {
    return [];
  }
  const userLanguages = userLanguagesResult.language as Prisma.JsonArray;
  const userLanguageTasks = await prisma.userLanguageTasks.findMany({
    where: {
      id: user.id,
      primaryLang: { in: userLanguages },
    }
  });
  const langToTasks = userLanguageTasks.reduce( (result, item) => {
    const taskMetaResult = item?.taskMeta as Prisma.JsonArray || [];

    const taskMetaList = taskMetaResult.map( ({category,  mode, secondary}) => {
      return {
        taskCategory: taskCategoryMap.get(category),
        taskMode: taskModeMap.get(mode),
        secondaryLang: secondary,
      } as TaskMeta
    });
    result.set(item.primaryLang, taskMetaList);
    return result;
  }, new Map<string, TaskMeta[]>());
  const r = userLanguages.map( (lang) => {
    return {
      language: lang,
      languageDisplay: languageMap.get(lang),
      tasks: langToTasks.get(lang),
    } as LanguageTasks;
  });
  return r;
}
