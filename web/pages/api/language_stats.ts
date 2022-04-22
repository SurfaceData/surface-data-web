import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

import { getLanguageStats } from '@common/LanguageStatsUtils';
import { allLanguages, cldrLanguages } from '@common/DisplayLanguages';
import { getTaskCategoryMap, getTaskModeMap } from '@common/TaskUtils';
import type { LanguageStats, TaskStats } from '@features/LanguageStats';
import type { LanguageTasks, TaskCategory, TaskMode } from '@features/tasks';

const prisma = new PrismaClient();

const allLangMap = allLanguages.reduce( (result, language) => {
  result.set(language.isoCode, language);
  return result;
}, new Map());

const taskModeMap = await getTaskModeMap(prisma);
const taskCategoryMap = await getTaskCategoryMap(prisma);

/**
 * Returns an array of LanguageStats given a requested list of languages and
 * tasks for those languages.
 *
 * This requires calls to multiple database tables:
 *   - TaskMilestones
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Array<LanguageStats>>
) => {
  console.log('language stats');
  const { languages, languageMap, requestedTasks } = await extractLanguagesAndTasks(
    req);
  const languageStats = await getLanguageStats(
    prisma, languages, languageMap, requestedTasks, taskModeMap, taskCategoryMap);

    // Done~
  res.status(200).json(languageStats);
}

async function extractLanguagesAndTasks(req: NextApiRequest) {
  if (!req.body) {
    const randomLanguages = await prisma.taskMilestones.findMany({
      select: {
        primaryLang: true
      },
      orderBy: {
        milestone: 'desc',
      },
      distinct: ['primaryLang'],
      take: 5,
    });
    const languages = randomLanguages.map(({primaryLang}) => primaryLang);
    const languageMap = allLangMap;
    const requestedTasks = languages.reduce( (results, isoCode) => {
      results.set(isoCode, new Set());
      return results;
    }, new Map());
    return {
      languages,
      languageMap,
      requestedTasks,
    };
  }

  // Get the languages and factor that into a set of language strings and a
  // mapping from languages to task IDs.
  const languagesAndTasks = req.body as LanguageTasks[] || [];
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
