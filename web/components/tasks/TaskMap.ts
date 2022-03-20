import type { FunctionComponent } from 'react';
import type { IconType } from 'react-icons';
import { RiQuestionnaireFill, RiTranslate } from 'react-icons/ri';

import type { TaskComponentProps } from '@features/tasks';
import { InvalidTask } from '@components/tasks/InvalidTask';
import { CreateQualityTag } from '@components/tasks/create/CreateQualityTag';
import { CreateTranslate } from '@components/tasks/create/CreateTranslate';
import { RateQualityTag } from '@components/tasks/rate/RateQualityTag';
import { VerifyTranslate } from '@components/tasks/verify/VerifyTranslate';

interface CategoryMap {
  [key: string]: FunctionComponent<TaskComponentProps>,
}

interface ModeMap {
  [key: string]: CategoryMap,
}

interface CategoryIconMap {
  [key: string]: IconType,
}

const TaskMap = {
  'Create': {
    'QualityTag': CreateQualityTag,
    'Translate': CreateTranslate,
  } as CategoryMap,
  'Rate': {
    'QualityTag': RateQualityTag,
  } as CategoryMap,
  'Verify': {
    'Translate': VerifyTranslate,
  } as CategoryMap,
} as ModeMap;

const TaskIconMap = {
  'QualityTag': RiQuestionnaireFill,
  'Translate': RiTranslate,
} as CategoryIconMap;

function getTaskComponent(taskMode: string, taskCategory: string) {
  const categoryMap = TaskMap[taskMode];
  if (!categoryMap) {
    return InvalidTask;
  }
  const component = categoryMap[taskCategory];
  if (!component) {
    return InvalidTask;
  }
  return component;
}

function getTaskIcon(taskCategory: string) {
  return TaskIconMap[taskCategory];
}

export { getTaskComponent, getTaskIcon } 
export default TaskMap;
