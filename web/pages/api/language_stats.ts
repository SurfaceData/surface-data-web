import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

import type { LanguageStats, TaskStats } from '@features/LanguageStats';
import type { Language } from '@features/language';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Array<LanguageStats>>
) => {
  const languagesAndTasks = req.body as Language[];
  const languages = languagesAndTasks.map(({language}) => language);
  const requestedTasks = languagesAndTasks.reduce( (results, entry) => {
    results.set(entry.language, new Set(entry.tasks.map( ({id}) => id)));
    return results;
  }, new Map);

  const taskStats = await prisma.taskMilestones.findMany({
        where: {
          language: { in: languages },
          milestoneType: "weekly",
        }
      });
  const languageStats = Array.from(
    taskStats.reduce( (results, stats) => {
      const taskStats = results.has(stats.language) ?
        results.get(stats.language) : [];

      const taskSet = requestedTasks.get(stats.language);
      if (taskSet.has(stats.taskId)) {
        taskStats.push({
          id: stats.taskId,
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
      return {
        language: key,
        taskStats: value,
        info: {
          description: 'blah',
          funFact: 'gar',
        }
      } as LanguageStats;
    });

  res.status(200).json(languageStats);
}
