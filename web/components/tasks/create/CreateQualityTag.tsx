import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { TagPicker } from 'rsuite';

import { sendContribution } from '@common/FetchUtils';
import { SkipButton } from '@components/tasks/SkipButton';
import { Button } from '@components/ui/Button';
import type { Contribution } from '@features/contributions';
import type { TaskComponentProps, TaskMeta } from '@features/tasks';

const ratingOptions = [
  {
    'label': 'Good', 
    'value': 'good',
  }, {
    'label': 'Not in my language',
    'value': 'not_in_language',
  }, {
    'label': 'Interesting',
    'value': 'interesting',
  }
];

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
  const [labels, setLabels] = useState<string[]>([]);

  const afterSubmit = () => {
    setLabels([]);
    onDone();
  }
  const handleSubmit = () => {
    const contribution = {
      id: task.id,
      taskMeta: taskMeta,
      labels: labels,
    } as Contribution;
    sendContribution(contribution, console.error, afterSubmit);
  };
  return (
    <div>
      <div>
        Select the appropriate quality tags for the following content
      </div>
      <div>
        {task.secondaryText}
      </div>
      <div>
        <TagPicker
          value={labels}
          data={ratingOptions}
          style={{width: 300 }}
          onChange={setLabels}
        />
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
