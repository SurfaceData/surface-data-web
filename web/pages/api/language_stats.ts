import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

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
  const { languages, languageMap, requestedTasks } = await extractLanguagesAndTasks(
    req);

  // Get all task stats for the requested languages.
  const taskStats = await prisma.taskMilestones.findMany({
        where: {
          primaryLang: { in: languages },
          milestoneType: "weekly",
        }
      });
  
  // Given the results above, convert everything into a list of LanguageStats.
  // 
  // We do this in a multi-step process:
  //   1) Compress the array into a Map from languages to an array of
  //   TaskStats.
  //   2) Convert the Map's entries to LanguageStats and return that as an
  //   Array.  During the conversion, add in the language info.
  const languageStats = Array.from(
    taskStats.reduce( (results, stats) => {
      const taskStats = results.has(stats.primaryLang) ?
        results.get(stats.primaryLang) : [];

      // Only add the TaskStats if the user requested the task for the
      // language.  taskSet will be undefined if the user made a request with a
      // body but has no tasks registered.  Otherwise there will be a Set.  An
      // empty set means we intentionally are okay returning all tasks.
      const taskSet = requestedTasks.get(stats.primaryLang);
      const shouldAdd = taskSet && (taskSet.size === 0 || taskSet.has(JSON.stringify({
        category: stats.taskCategoryId,
        mode: stats.taskModeId,
        lang: stats.secondaryLang,
      })));
      if (shouldAdd) {
        taskStats.push({
          taskCategory: taskCategoryMap.get(stats.taskCategoryId),
          taskMode: taskModeMap.get(stats.taskModeId),
          secondaryLang: languageMap.get(stats.secondaryLang),
          nextMilestone: stats.milestone,
          progress: stats.progress,
          milestoneType: stats.milestoneType
        } as TaskStats);
        results.set(stats.primaryLang, taskStats);
      }
      return results;
    },
    new Map
    ).entries())
    .map( ([key, value]) => {
      // Map to a LanguageStat object.
      return {
        language: languageMap.get(key),
        taskStats: value,
      } as LanguageStats;
    });

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
