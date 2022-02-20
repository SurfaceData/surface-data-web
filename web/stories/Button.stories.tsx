import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '@components/ui/Button';

export default {
  title: 'Surface/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Primary = () => <Button>Label</Button>;

export const Rounded = () => <Button rounded>Label</Button>;

export const Outline = () => <Button outline>Label</Button>;
