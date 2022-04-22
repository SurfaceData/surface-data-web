import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

import type { LandingStats } from '@features/stats';

const prisma = new PrismaClient();

const languagePairs = await prisma.taskMilestones.findMany({
  distinct: ['primaryLang', 'secondaryLang'],
  select: {
    primaryLang: true,
    secondaryLang: true,
  },
});

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<LandingStats>
) => {
  const languageSet = languagePairs.reduce( (result, pair) => {
    result.add(pair.primaryLang);
    result.add(pair.secondaryLang);
    return result;
  }, new Set());

  const { _sum: milestoneSum } = await prisma.taskMilestones.aggregate({
    _sum: {
      milestone: true,
    },
  });
  res.status(200).json({
    taskCount: milestoneSum.milestone,
    languageCount: languageSet.size,
    languagePairCount: languagePairs.length,
  } as LandingStats);
};

export default handler;
