import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FaGg } from 'react-icons/fa';

import { ActiveTaskPill } from '@components/tasks/ActiveTaskPill';

export default {
  title: 'Surface/ActiveTaskPill',
  component: ActiveTaskPill,
} as ComponentMeta<typeof ActiveTaskPill>;

export const Active = () => (
  <ActiveTaskPill
    value={0}
    icon={<FaGg />}
    state='active' />
);

export const Skipped = () => (
  <ActiveTaskPill
    value={1}
    icon={<FaGg />}
    state='skipped' />
);

export const Done = () => (
  <ActiveTaskPill
    value={2}
    icon={<FaGg />}
    state='done' />
);

export const Inactive = () => (
  <ActiveTaskPill
    value={3}
    icon={<FaGg />}
    state='inactive' />
);
