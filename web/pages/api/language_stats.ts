import type { NextApiRequest, NextApiResponse } from 'next';

import type { LanguageStats } from '@features/LanguageStats';

const SAMPLE_STATS_EN = require('@common/sample-langstats-en.json') as LanguageStats;
const SAMPLE_STATS_TI = require('@common/sample-langstats-ti.json') as LanguageStats;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Array<LanguageStats>>
) => {
  const result = [
    SAMPLE_STATS_EN,
    SAMPLE_STATS_TI,
  ];
  res.status(200).json(result);
}
