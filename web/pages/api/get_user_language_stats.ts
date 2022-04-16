import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from "@prisma/client";

import { allLanguages, cldrLanguages } from '@common/DisplayLanguages';
import { getLanguageStats } from '@common/LanguageStatsUtils';
import { getTaskCategoryMap, getTaskModeMap } from '@common/TaskUtils';
import { fetchUserLanguages } from '@common/UserUtils';
import type { LanguageStats, TaskStats } from '@features/LanguageStats';
import type { LanguageTasks, TaskCategory, TaskMode } from '@features/tasks';

const prisma = new PrismaClient();

const allLangMap = allLanguages.reduce( (result, language) => {
  result.set(language.isoCode, language);
  return result;
}, new Map());

const taskModeMap = await getTaskModeMap(prisma);
const taskCategoryMap = await getTaskCategoryMap(prisma);

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Array<LanguageStats>>
) => {
  const session = await getSession({ req });
  if (!session || !session.userId) {
    res.status(500);
    return;
  }
  const { languages, languageMap, requestedTasks } = await extractLanguagesAndTasks(session.userId);
  const languageStats = await getLanguageStats(
    prisma, languages, languageMap, requestedTasks, taskModeMap, taskCategoryMap);

  // Done~
  res.status(200).json(languageStats);
}

async function extractLanguagesAndTasks(userId: string) {
  // Get the languages and factor that into a set of language strings and a
  // mapping from languages to task IDs.
  const languagesAndTasks = await fetchUserLanguages(
    prisma, userId, allLangMap, taskModeMap, taskCategoryMap);
  const languages = languagesAndTasks.map(({languageDisplay}) => languageDisplay?.isoCode || '');
  const languageMap = languagesAndTasks.reduce( (results, entry) => {
    results.set(
      entry?.languageDisplay?.isoCode,
      entry?.languageDisplay);
    return results;
  }, new Map);
  const requestedTasks = languagesAndTasks
    .filter( (entry) => entry.tasks.length > 0)
    .reduce( (results, entry) => {
      results.set(
        entry.languageDisplay?.isoCode,
        new Set(entry.tasks.map( ({taskCategory, taskMode, secondaryLang}) =>
          JSON.stringify({
            category: taskCategory.id, 
            mode: taskMode.id,
            lang: secondaryLang
          }))));
      return results;
    }, new Map);

  return {
    languages,
    languageMap,
    requestedTasks,
  };
}

export default handler;
