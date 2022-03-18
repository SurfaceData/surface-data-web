import type { FunctionComponent } from 'react';
import type { TaskComponentProps } from '@features/tasks';

export const CreateQualityTag: FunctionComponent<TaskComponentProps> = ({
  task,
  primary,
  secondary
}) => {
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
    </div>
  );
};
