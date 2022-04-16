import type { User } from 'next-auth';
import type { Prisma, PrismaClient } from "@prisma/client";

import type { LanguageDisplay } from '@features/language';
import type { LanguageTasks, TaskMeta, TaskMetaJson, TaskCategory, TaskMode } from '@features/tasks';

export async function fetchUserLanguages(
  prisma: PrismaClient,
  userId: string,
  languageMap: Map<string, LanguageDisplay>,
  taskModeMap: Map<number, TaskMode>,
  taskCategoryMap: Map<number, TaskCategory>
) {
  const userLanguagesResult = await prisma.userLanguages.findUnique({
    where: {
      id: userId,
    }
  });
  if (!userLanguagesResult) {
    return [];
  }
  const userLanguages = userLanguagesResult.language as string[];
  const userLanguageTasks = await prisma.userLanguageTasks.findMany({
    where: {
      id: userId,
      primaryLang: { in: userLanguages },
    }
  });
  const langToTasks = userLanguageTasks.reduce( (result, item) => {
    const taskMetaResult = item?.taskMeta as Prisma.JsonArray || [];

    const taskMetaList = taskMetaResult.map( (res: unknown) => {
      const {category,  mode, secondary} = res as TaskMetaJson;
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
      tasks: langToTasks.get(lang) || [],
    } as LanguageTasks;
  });
  return r;
}
