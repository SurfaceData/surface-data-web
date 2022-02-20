import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Chip } from '@components/ui/Chip';

export default {
  title: 'Surface/Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>;

export const Primary = () => <Chip>Label</Chip>;
