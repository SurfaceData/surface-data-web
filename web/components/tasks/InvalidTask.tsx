import type { TaskComponentProps } from '@features/tasks';

export const InvalidTask = (props: TaskComponentProps) => {
  return (
    <div>
      This Task Type does not exist
    </div>
  )
};
