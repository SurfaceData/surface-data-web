import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LabeledTextArea } from '@components/ui/LabeledTextArea';

export default {
  title: 'Surface/LabeledTextArea',
  component: LabeledTextArea,
} as ComponentMeta<typeof LabeledTextArea>;

export const Primary = () => <LabeledTextArea> Thing</LabeledTextArea>;

