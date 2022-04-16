import type { PrismaClient } from "@prisma/client";

import type { LanguageDisplay } from '@features/language';
import type { TaskCategory, TaskMode } from '@features/tasks';
import type { LanguageStats, TaskStats } from '@features/LanguageStats';

export async function getLanguageStats(
  prisma: PrismaClient,
  languages: string[], 
  languageMap: Map<string, LanguageDisplay>,
  requestedTasks: Map<string, Set<string>>,
  taskModeMap: Map<number, TaskMode>,
  taskCategoryMap: Map<number, TaskCategory>
) {
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
  return languageStats;
}
