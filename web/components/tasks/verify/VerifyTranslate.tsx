import type { FunctionComponent } from 'react';

import { sendContribution } from '@common/FetchUtils';
import { SkipButton } from '@components/tasks/SkipButton';
import { Button } from '@components/ui/Button';
import type { Contribution } from '@features/contributions';
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
  const handleSubmit = (rating: number) => {
    const contribution = {
      id: task.id,
      taskMeta: taskMeta,
      rating: rating,
    } as Contribution;
    sendContribution(contribution, console.error, onDone);
  }

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
        <Button
          rounded
          onClick={() => handleSubmit(1)}
          >
          Correct
        </Button>

        <Button
          rounded
          outline
          onClick={() => handleSubmit(-1)}
          >
          Incorrect
        </Button>

        <SkipButton
          itemId={task.id}
          taskMeta={taskMeta}
          onClick={onDone}
          />
      </div>
    </div>
  );
};
