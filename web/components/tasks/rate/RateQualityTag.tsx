import type { FunctionComponent } from 'react';

import { SkipButton } from '@components/tasks/SkipButton';
import type { TaskComponentProps, TaskMeta } from '@features/tasks';

export const RateQualityTag: FunctionComponent<TaskComponentProps> = ({
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
        How well does the quality tag apply to the content?
      </div>
      <div>
        {task.primaryText}
      </div>
      <div>
        {task.secondaryText}
      </div>
      <div>
        <div>slider goes here</div>
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
