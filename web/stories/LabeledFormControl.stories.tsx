import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LabeledFormControl } from '../components/ui/LabeledFormControl';

export default {
  title: 'Surface/LabeledFormControl',
  component: LabeledFormControl,
} as ComponentMeta<typeof LabeledFormControl>;

export const Primary = () => <LabeledFormControl> Thing</LabeledFormControl>;
