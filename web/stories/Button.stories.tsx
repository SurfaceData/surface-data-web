import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '@components/ui/Button';
import { LightBlue } from '@styles/palettes';

export default {
  title: 'Surface/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Primary = () => <Button>Label</Button>;

export const Rounded = () => <Button rounded>Label</Button>;

export const Outline = () => <Button outline>Label</Button>;

export const BluePalette = () => <Button palette={LightBlue}>Label</Button>;

export const OutlineBluePalette = () => <Button outline palette={LightBlue}>Label</Button>;
