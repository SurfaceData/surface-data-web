import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import LanguageStatsSection from '@components/LanguageStatsSection';
import { Chip } from '@components/ui/Chip';
import type { LanguageStats } from '@features/LanguageStats';

const SAMPLE_STATS_EN = require('./sample-langstats-en.json') as LanguageStats;

export default {
  title: 'Surface/LanguageStatsSection',
  component: LanguageStatsSection,
} as ComponentMeta<typeof LanguageStatsSection>;

export const EnglishSection = () => (
  <LanguageStatsSection
    stats={SAMPLE_STATS_EN}
  />
);
