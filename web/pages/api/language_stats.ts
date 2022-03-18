import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

import { getTaskCategoryMap, getTaskModeMap } from '@common/TaskUtils';
import type { LanguageStats, TaskStats } from '@features/LanguageStats';
import type { LanguageTasks, TaskCategory, TaskMode } from '@features/tasks';

const prisma = new PrismaClient();

let taskModeMap: Map<number, TaskMode>;
let taskCategoryMap: Map<number, TaskCategory>
(async() => {
  taskModeMap = await getTaskModeMap(prisma);
  taskCategoryMap = await getTaskCategoryMap(prisma);
})();

/**
 * Returns an array of LanguageStats given a requested list of languages and
 * tasks for those languages.
 *
 * This requires calls to multiple database tables:
 *   - LanguageDetails
 *   - LanguageFunFacts
 *   - TaskMilestones
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Array<LanguageStats>>
) => {
  // Get the languages and factor that into a set of langauge strings and a
  // mapping from languages to task IDs.
  const languagesAndTasks = req.body as LanguageTasks[];
  const languages = languagesAndTasks.map(({languageDisplay}) => languageDisplay.isoCode);
  const languageMap = languagesAndTasks.reduce( (results, entry) => {
    results.set(
      entry.languageDisplay.isoCode,
      entry.languageDisplay);
    return results;
  }, new Map);

  const requestedTasks = languagesAndTasks.reduce( (results, entry) => {
    results.set(
      entry.languageDisplay.isoCode,
      new Set(entry.tasks.map( ({taskCategory, taskMode, secondaryLang}) =>
        JSON.stringify({category: taskCategory.id, mode: taskMode.id, lang: secondaryLang}))));
    return results;
  }, new Map);

  // Fetch language details for each language and form it into a Map.
  let languageDetailsList = await prisma.languageDetails.findMany({
        where: {
          language: { in: languages },
        }
      });
  const languageDetails = languageDetailsList.reduce( (result, entry) => {
        result.set(entry.language, entry.description);
        return result;
   }, new Map);

   // Fetch language fun facts for each language and form it into a Map.
   let languageFunFactsList = await prisma.languageFunFacts.findMany({
        where: {
          language: { in: languages },
        }
      });
  const languageFunFacts = languageFunFactsList.reduce( (result, entry) => {
        if (result.has(entry.language)) {
          result.get(entry.language).push(entry.fact);
        } else {
          result.set(entry.language, [entry.fact]);
        }
        return result;
      }, new Map);

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
      // language.
      const taskSet = requestedTasks.get(stats.primaryLang);
      const shouldAdd = taskSet.has(JSON.stringify({
        category: stats.taskCategoryId,
        mode: stats.taskModeId,
        lang: stats.secondaryLang,
      }));
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
      const description = languageDetails.get(key) || 'Needs Updating';
      const funFacts = languageFunFacts.get(key);
      // Map to a LanguageStat object.
      return {
        language: languageMap.get(key),
        taskStats: value,
        info: {
          description: description,
          funFact: funFacts ? funFacts[0] : 'Needs Updating',
        }
      } as LanguageStats;
    });

  // Done~
  res.status(200).json(languageStats);
}

export default handler;
