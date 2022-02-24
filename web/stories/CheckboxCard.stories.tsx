import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CheckboxCard } from '@components/ui/CheckboxCard';

export default {
  title: 'Surface/CheckboxCard',
  component: CheckboxCard,
} as ComponentMeta<typeof CheckboxCard>;

export const Default = () => (
  <CheckboxCard
      title="Tagging"
      description="Tag things for quality"
      onChange={ (e) => { console.log(e.target.checked); }}>
    Label
  </CheckboxCard>
);

export const CheckedInitial = () => (
  <CheckboxCard
      title="Translation"
      description="Translate Content"
      checked="true"
      onChange={ (e) => { console.log(e.target.checked); }}>
    Label
  </CheckboxCard>
);
