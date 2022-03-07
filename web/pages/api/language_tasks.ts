import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

import { allLanguages } from '@common/DisplayLanguages';
import type { LanguageStats, TaskStats } from '@features/LanguageStats';

const prisma = new PrismaClient();

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
      id: stats.taskId,
      secondaryLang: languageMap.get(stats.secondaryLang),
      nextMilestone: stats.milestone,
      progress: stats.progress,
      milestoneType: stats.milestoneType
    } as TaskStats;
  });
  res.status(200).json(result);
}
