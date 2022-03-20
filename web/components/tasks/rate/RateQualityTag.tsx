import type { FunctionComponent } from 'react';

import { SkipButton } from '@components/tasks/SkipButton';
import type { TaskComponentProps } from '@features/tasks';

export const RateQualityTag: FunctionComponent<TaskComponentProps> = ({
  task,
  primary,
  secondary,
  onDone,
}) => {
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
        <SkipButton onClick={onDone}/>
      </div>
    </div>
  );
};
