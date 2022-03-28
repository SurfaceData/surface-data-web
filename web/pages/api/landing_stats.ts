import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

import type { LandingStats } from '@features/stats';

const prisma = new PrismaClient();

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<LandingStats>
) => {
  const languages = await prisma.taskMilestones.findMany({
    distinct: ['primaryLang'],
    select: {
      primaryLang: true,
    },
  });
  const languagePairs = await prisma.taskMilestones.findMany({
    distinct: ['primaryLang', 'secondaryLang'],
    select: {
      primaryLang: true,
      secondaryLang: true,
    },
  });
  const { _sum: milestoneSum } = await prisma.taskMilestones.aggregate({
    _sum: {
      milestone: true,
    },
  });
  res.status(200).json({
    taskCount: milestoneSum.milestone,
    languageCount: languages.length,
    languagePairCount: languagePairs.length,
  } as LandingStats);
};

export default handler;
