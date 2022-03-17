import NextAuth from 'next-auth';
import type { User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

import { allLanguages, cldrLanguages } from '@common/DisplayLanguages';
import { getTaskCategoryMap, getTaskModeMap } from '@common/TaskUtils';
import type { LanguageTasks, TaskMeta, TaskCategory, TaskMode } from '@features/tasks';

const prisma = new PrismaClient();

let taskModeMap: Map<number, TaskMode>;
let taskCategoryMap: Map<number, TaskCategory>
(async() => {
  taskModeMap = await getTaskModeMap(prisma);
  taskCategoryMap = await getTaskCategoryMap(prisma);
})();

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

const fetchLanguages = async (user: User) => {
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
      primaryLang: { in: userLanguages.language },
    }
  });
  const langToTasks = userLanguageTasks.reduce( (result, item) => {
    const taskMetaList = item.taskCategories.map( (categoryId, i) => {
      const category = taskCategoryMap.get(categoryId);
      const mode = taskModeMap.get(item.taskModes[i]);
      const secondaryLang = item.secondaryLang[i];
      return {
        taskCategory: category,
        taskMode: mode,
        secondaryLang: secondaryLang,
      } as TaskMeta
    });
    result.set(item.primaryLang, taskMetaList);
    return result;
  }, new Map<string, TaskMeta[]>());
  const r = userLanguages.language.map( (lang) => {
    return {
      language: lang,
      languageDisplay: languageMap.get(lang),
      tasks: langToTasks.get(lang),
    } as LanguageTasks;
  });
  return r;
}
