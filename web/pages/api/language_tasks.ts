import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

import { allLanguages } from '@common/DisplayLanguages';
import { getTaskCategoryMap, getTaskModeMap } from '@common/TaskUtils';
import type { TaskCategory, TaskMode } from '@features/tasks';
import type { LanguageStats, TaskStats } from '@features/LanguageStats';

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

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Array<TaskStats>>
) => {
  const language = req.query.language as string;
  const taskStats = await prisma.taskMilestones.findMany({
        where: {
          primaryLang: language,
          milestoneType: "weekly",
        }
      });
  const result = taskStats.map( (stats) => {
    return {
      secondaryLang: languageMap.get(stats.secondaryLang),
      taskCategory: taskCategoryMap.get(stats.taskCategoryId),
      taskMode: taskModeMap.get(stats.taskModeId),
      nextMilestone: stats.milestone,
      progress: stats.progress,
      milestoneType: stats.milestoneType
    } as TaskStats;
  });
  res.status(200).json(result);
}

export default handler;
