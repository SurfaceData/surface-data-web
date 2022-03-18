import type { FunctionComponent } from 'react';
import { Button } from '@components/ui/Button';
import type { TaskComponentProps } from '@features/tasks';

export const VerifyTranslate: FunctionComponent<TaskComponentProps> = ({
  task,
  primary,
  secondary
}) => {
  return (
    <div>
      <div>
        Is the {primary} translation correct for the {secondary} prompt
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
      </div>
    </div>
  );
};
