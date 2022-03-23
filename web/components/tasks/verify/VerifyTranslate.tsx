import type { FunctionComponent } from 'react';

import { SkipButton } from '@components/tasks/SkipButton';
import { Button } from '@components/ui/Button';
import type { TaskComponentProps, TaskMeta } from '@features/tasks';

export const VerifyTranslate: FunctionComponent<TaskComponentProps> = ({
  task,
  category,
  mode,
  primary,
  secondary,
  onDone,
}) => {
  const taskMeta = {
    taskCategory: category,
    taskMode: mode,
    primaryLang: primary.isoCode,
    secondaryLang: secondary.isoCode,
  } as TaskMeta;
  return (
    <div>
      <div>
        Is the {primary.cldrName} translation correct for the {secondary.cldrName} prompt
      </div>
      <div>
        {task.primaryText}
      </div>
      <div>
        {task.secondaryText}
      </div>
      <div>
        <Button rounded>Correct</Button>
        <Button rounded outline>Incorrect</Button>
        <SkipButton
          itemId={task.id}
          taskMeta={taskMeta}
          onClick={onDone}
          />
      </div>
    </div>
  );
};
