import { sendContribution } from '@common/FetchUtils';
import { Button } from '@components/ui/Button';
import type { Contribution } from '@features/contributions';
import type { TaskMeta } from '@features/tasks';

interface SkipButtonProps {
  itemId?: string,
  taskMeta: TaskMeta,
  onClick: () => void,
};

export const SkipButton = ({
  itemId,
  taskMeta,
  onClick,
}: SkipButtonProps) => {
  const contribution = {
    id: itemId,
    taskMeta: taskMeta,
    isSkip: true,
  } as Contribution;
  return (
    <Button
      outline
      rounded
      onClick={() => sendContribution(contribution, console.error, onClick)}
    >
      Skip
    </Button>
  );
};
