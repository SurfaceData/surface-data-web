import type { FunctionComponent } from 'react';

import { SkipButton } from '@components/tasks/SkipButton';
import type { TaskComponentProps, TaskMeta } from '@features/tasks';

export const CreateQualityTag: FunctionComponent<TaskComponentProps> = ({
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
        Select the appropriate quality tags for the following content
      </div>
      <div>
        {task.secondaryText}
      </div>
      <div>
        <div>Option 1</div>
        <div>Option 2</div>
      </div>
      <div>
        <SkipButton
          itemId={task.id}
          taskMeta={taskMeta}
          onClick={onDone}
          />
      </div>
    </div>
  );
};
