import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

import { allLanguages } from '@common/DisplayLanguages';
import type { TaskCategory, TaskMode } from '@features/tasks';
import type { LanguageStats, TaskStats } from '@features/LanguageStats';

const prisma = new PrismaClient();

const taskModes: TaskMode[] = await prisma.taskMode.findMany();
const taskModeMap = taskModes.reduce( (result, mode) => {
  result.set(mode.id, mode);
  return result;
}, new Map());

const taskCategories: TaskCategory[] = await prisma.taskCategory.findMany();
const taskCategoryMap = taskCategories.reduce( (result, category) => {
  result.set(category.id, category);
  return result;
}, new Map());

const languageMap = allLanguages.reduce( (result, language) => {
  result.set(language.isoCode, language);
  return result;
}, new Map());

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Array<LanguageStats>>
) => {
  const language = req.query.language;
  const taskStats = await prisma.taskMilestones.findMany({
        where: {
          primaryLang: language,
          milestoneType: "weekly",
        }
      });
  const result = taskStats.map( (stats) => {
    return {
      taskCategory: taskCategoryMap.get(stats.taskCategoryId),
      taskMode: taskModeMap.get(stats.taskModeId),
      secondaryLang: languageMap.get(stats.secondaryLang),
      nextMilestone: stats.milestone,
      progress: stats.progress,
      milestoneType: stats.milestoneType
    } as TaskStats;
  });
  res.status(200).json(result);
}
