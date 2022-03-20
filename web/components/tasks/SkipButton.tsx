import { Button } from '@components/ui/Button';

interface SkipButtonProps {
  itemId?: string,
  onClick: () => void,
};

export const SkipButton = ({itemId, onClick}: SkipButtonProps) => {
  return (
    <Button
      outline
      rounded
      onClick={onClick}
    >
      Skip
    </Button>
  );
};
