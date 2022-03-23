import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { Slider } from 'rsuite';

import { sendContribution } from '@common/FetchUtils';
import { SkipButton } from '@components/tasks/SkipButton';
import { Button } from '@components/ui/Button';
import type { Contribution } from '@features/contributions';
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
  const [rating, setRating] = useState(0);

  const afterSubmit = () => {
    setRating(0);
    onDone();
  };
  const handleSubmit = () => {
    const contribution = {
      id: task.id,
      taskMeta: taskMeta,
      rating: rating,
    } as Contribution;
    sendContribution(contribution, console.error, afterSubmit);
  };

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
        <Slider
          defaultValue={0}
          value={rating}
          min={-4}
          max={4}
          step={1}
          graduated
          progress
          renderMark={mark => { return mark; }}
          onChange={setRating} />
      </div>
      <div>
        <Button
          rounded
          onClick={handleSubmit}>
          Submit
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
