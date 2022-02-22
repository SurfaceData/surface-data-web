import styled from 'styled-components';
import { FiX } from "react-icons/fi";

import { Chip } from '@components/ui/Chip';

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
      <button onClick={removeTask}><FiX /></button>
      {task}
    </Chip>
  );
}

export default InputTaskChip;

