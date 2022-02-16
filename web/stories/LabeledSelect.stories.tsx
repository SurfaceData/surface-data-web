import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LabeledSelect } from '@components/ui/LabeledSelect';

export default {
  title: 'Surface/LabeledSelect',
  component: LabeledSelect,
} as ComponentMeta<typeof LabeledSelect>;

export const Primary = () => (
  <LabeledSelect label="Language">
    <option key="en" value="en">English</option>
    <option key="fr" value="fr">French</option>
  </LabeledSelect>
);
