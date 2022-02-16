import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LabeledInput } from '../components/ui/LabeledInput';

export default {
  title: 'Surface/LabeledInput',
  component: LabeledInput,
} as ComponentMeta<typeof LabeledInput>;

export const Primary = () => <LabeledInput value="cat" label="name" />;
