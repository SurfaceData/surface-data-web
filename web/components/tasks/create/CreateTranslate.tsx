import type { FunctionComponent } from 'react';

import { LabeledInput } from '@components/ui/LabeledInput';
import { SkipButton } from '@components/tasks/SkipButton';
import type { TaskComponentProps } from '@features/tasks';

export const CreateTranslate: FunctionComponent<TaskComponentProps> = ({
  task,
  primary,
  secondary,
  onDone,
}) => {
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
        />
      </div>
      <div>
        <SkipButton onClick={onDone}/>
      </div>
    </div>
  );
};
