import type { FunctionComponent } from 'react';
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

export { getTaskComponent } 
export default TaskMap;
