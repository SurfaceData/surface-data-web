import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

import type { LanguageStats, TaskStats } from '@features/LanguageStats';
import type { Language } from '@features/language';

const prisma = new PrismaClient();

/**
 * Returns an array of LanguageStats given a requested list of languages and
 * tasks for those languages.
 *
 * This requires calls to multiple database tables:
 *   - LanguageDetails
 *   - LanguageFunFacts
 *   - TaskMilestones
 */
export default async (
  req: NextApiRequest,
  res: NextApiResponse<Array<LanguageStats>>
) => {
  // Get the languages and factor that into a set of langauge strings and a
  // mapping from languages to task IDs.
  const languagesAndTasks = req.body as Language[];
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
      new Set(entry.tasks.map( ({id, targetLang}) => JSON.stringify({id, targetLang}))));
    return results;
  }, new Map);

  // Fetch language details for each language and form it into a Map.
  let languageDetails = await prisma.languageDetails.findMany({
        where: {
          language: { in: languages },
        }
      });
  languageDetails = languageDetails.reduce( (result, entry) => {
        result.set(entry.language, entry.description);
        return result;
   }, new Map);

   // Fetch language fun facts for each language and form it into a Map.
   let languageFunFacts = await prisma.languageFunFacts.findMany({
        where: {
          language: { in: languages },
        }
      });
  languageFunFacts = languageFunFacts.reduce( (result, entry) => {
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
          language: { in: languages },
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
      const taskStats = results.has(stats.language) ?
        results.get(stats.language) : [];

      // Only add the TaskStats if the user requested the task for the
      // language.
      const taskSet = requestedTasks.get(stats.language);
      const shouldAdd = taskSet.has(JSON.stringify({
        id: stats.taskId,
        targetLang: stats.targetLang
      }));
      if (shouldAdd) {
        taskStats.push({
          id: stats.taskId,
          targetLang: languageMap.get(stats.targetLang),
          nextMilestone: stats.milestone,
          progress: stats.progress,
          milestoneType: stats.milestoneType
        } as TaskStats);
        results.set(stats.language, taskStats);
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
        info: {
          description: languageDetails.get(key),
          funFact: languageFunFacts.get(key)[0],
        }
      } as LanguageStats;
    });

  // Done~
  res.status(200).json(languageStats);
}
