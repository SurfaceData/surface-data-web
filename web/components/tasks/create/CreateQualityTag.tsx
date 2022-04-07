import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { TagPicker } from 'rsuite';
import styled from 'styled-components';

import { sendContribution } from '@common/FetchUtils';
import { SkipButton } from '@components/tasks/SkipButton';
import { ActionContainer } from '@components/ui/ActionContainer';
import { Button } from '@components/ui/Button';
import { TaskContainer } from '@components/ui/TaskContainer';
import { TaskContentContainer } from '@components/ui/TaskContentContainer';
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
    <TaskContainer>
      <div>
        Select the appropriate quality tags for the following content
      </div>
      <TaskContentContainer>
        {task.secondaryText}
      </TaskContentContainer>
      <div>
        <TagPicker
          value={labels}
          data={ratingOptions}
          style={{width: 300 }}
          onChange={setLabels}
        />
      </div>
      <ActionContainer>
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
      </ActionContainer>
    </TaskContainer>
  );
};
