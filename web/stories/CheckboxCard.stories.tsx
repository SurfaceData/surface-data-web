import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CheckboxCard } from '@components/ui/CheckboxCard';

export default {
  title: 'Surface/CheckboxCard',
  component: CheckboxCard,
} as ComponentMeta<typeof CheckboxCard>;

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.checked);
};

export const Default = () => (
  <CheckboxCard
      title="Tagging"
      description="Tag things for quality"
      onChange={handleChange} />
);

export const CheckedInitial = () => (
  <CheckboxCard
      title="Translation"
      description="Translate Content"
      checked={true}
      onChange={handleChange} />
);
