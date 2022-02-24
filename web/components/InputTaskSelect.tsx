import { useState } from 'react';
import styled from 'styled-components';

import InputTaskChip from '@components/InputTaskChip';
import { CheckboxCard } from '@components/ui/CheckboxCard';
import { Chip } from '@components/ui/Chip';
import { LabeledSelect } from '@components/ui/LabeledSelect';
import { Language } from '@features/language';
import { TaskType, TaskDescriptions, TaskLabels, stringToTaskType } from '@features/tasks';

const Container = styled.div`
  margin: 48px 24px;
  text-align: center;
`;

interface InputTaskSelectProps {
  locale: Language,
  languageIndex: number,
  allLanguages: Language[],
  setUserLanguages: (locale: Language[]) => void;
}

const InputTaskSelect = ({
  locale,
  languageIndex,
  allLanguages,
  setUserLanguages,
}: InputTaskSelectProps) => {
  const [inputValue, setInputValue] = useState('');
  const handleSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const taskType = stringToTaskType(e.target.value);
    if (taskType === TaskType.UNKNOWN) {
      return;
    }

    const newLanguages = allLanguages.slice();
    const langTasks = newLanguages[languageIndex].tasks;
    const taskIndex = langTasks.findIndex( t=> {
      return t.id === taskType;
    });
    if (taskIndex == -1) {
      newLanguages[languageIndex].tasks = langTasks.concat({
        id: taskType,
        label: TaskLabels[taskType],
      });
    }
    setUserLanguages(newLanguages);
    setInputValue('');
  };

  const removeTask = (index) => {
    const newLanguages = allLanguages.slice();
    const langTasks = newLanguages[languageIndex].tasks;
    langTasks.splice(index, 1);
    setUserLanguages(newLanguages);
  };

  return (
    <>
    {
      Object.keys(TaskLabels).map( (taskType, index) => (
        <CheckboxCard
          key={taskType}
          title={TaskLabels[taskType]}
          checked={allLanguages[languageIndex].tasks.includes(taskType)}
          description={TaskDescriptions[taskType]}
        />
      ))
    }
    <LabeledSelect
        label="Task"
        value={inputValue}
        onChange={handleSelection}>
      {
        Object.keys(TaskLabels).map( (taskType, index) => (
          <option key={taskType} value={taskType}>{TaskLabels[taskType]}</option>
        ))
      }
    </LabeledSelect>

    {
      locale.tasks.map( (task, index) => (
        <InputTaskChip
          key={index}
          task={task}
          removeTask={ () => removeTask(index) }>
        </InputTaskChip>
      ))
    }
    </>
  );
}

export default InputTaskSelect;
