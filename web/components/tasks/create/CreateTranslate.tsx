import type { FunctionComponent } from 'react';
import { LabeledInput } from '@components/ui/LabeledInput';
import type { TaskComponentProps } from '@features/tasks';

export const CreateTranslate: FunctionComponent<TaskComponentProps> = ({
  task,
  primary,
  secondary
}) => {
  return (
    <div>
      <div>
        Translate the following from {primary} to {secondary}
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
    </div>
  );
};
