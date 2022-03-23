import type { ChangeEvent, FunctionComponent } from 'react';
import { useState } from 'react';

import { sendContribution } from '@common/FetchUtils';
import { Button } from '@components/ui/Button';
import { LabeledInput } from '@components/ui/LabeledInput';
import { SkipButton } from '@components/tasks/SkipButton';
import type { Contribution } from '@features/contributions';
import type { TaskComponentProps, TaskMeta } from '@features/tasks';

export const CreateTranslate: FunctionComponent<TaskComponentProps> = ({
  task,
  category,
  mode,
  primary,
  secondary,
  onDone,
}) => {
  const [text, setText] = useState('');

  const taskMeta = {
    taskCategory: category,
    taskMode: mode,
    primaryLang: primary.isoCode,
    secondaryLang: secondary.isoCode,
  } as TaskMeta;
  const handleSubmit = () => {
    const contribution = {
      id: task.id,
      taskMeta: taskMeta,
      text: text,
    } as Contribution;
    sendContribution(contribution, console.error, onDone);
  }

  return (
    <div>
      <div>
        Translate the following to {primary.cldrName} from {secondary.cldrName}
      </div>
      <div>
        {task.secondaryText}
      </div>
      <div>
        <LabeledInput
          label="Translate"
          autoComplete="off"
          spellCheck="false"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        />
      </div>
      <div>
        <Button
          rounded 
          onClick={handleSubmit}
        >
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
