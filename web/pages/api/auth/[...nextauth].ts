import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

import { allLanguages, cldrLanguages } from '@common/DisplayLanguages';
import { Language, LanguageDisplay  } from '@features/language';
import type { Task } from '@features/tasks';
import { TaskType, TaskLabels, stringToTaskType } from '@features/tasks';

const prisma = new PrismaClient();

const languageMap = allLanguages.reduce( (result, language) => {
  result.set(language.isoCode, language);
  return result;
}, new Map());

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
      session.userId = user.id;
      session.user.languages = await fetchLanguages(user);
      return session;
    },
  },
});

const fetchLanguages = async (user) => {
  const userLanguages = await prisma.userLanguages.findUnique({
    where: {
      id: user.id,
    }
  });
  if (!userLanguages) {
    return [];
  }
  const userLanguageTasks = await prisma.userLanguageTasks.findMany({
    where: {
      id: user.id,
      language: { in: userLanguages.language },
    }
  });
  const langToTasks = userLanguageTasks.reduce( (res, item) => {
    return {
      ...res,
      [item.language]: item.annotType.map( (annotType, i) => {
        const taskType = stringToTaskType(annotType);
        const targetLang = item.targetLang[i];
        return {
          id: taskType,
          label: TaskLabels[taskType],
          targetLang: targetLang,
        } as Task
      }),
    };
  }, {});
  const r = userLanguages.language.map( (lang) => {
    return {
      language: lang,
      languageDisplay: languageMap.get(lang),
      tasks: langToTasks[lang],
    } as Language;
  });
  return r;
}
