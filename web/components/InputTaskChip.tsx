import styled from 'styled-components';
import { FiX } from "react-icons/fi";

import { Chip } from '@components/ui/Chip';
import { IconButton } from '@components/ui/IconButton';

interface InputTaskChipProps {
  task: number,
  removeTask: () => void;
}

const InputTaskChip = ({
  task,
  removeTask,
}: InputTaskChipProps) => {
  return (
    <Chip>
      <IconButton onClick={removeTask}><FiX /></IconButton>
      {task.label}
    </Chip>
  );
}

export default InputTaskChip;

