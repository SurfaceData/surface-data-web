import { useState } from 'react';
import styled from 'styled-components';

import InputTaskChip from '@components/InputTaskChip';
import { Chip } from '@components/ui/Chip';
import { LabeledSelect } from '@components/ui/LabeledSelect';
import { Language } from '@features/language';

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

    const task = parseInt(e.target.value, 10);
    if (task === 0) {
      return;
    }

    const newLanguages = allLanguages.slice();
    const langTasks = newLanguages[languageIndex].tasks;
    const taskIndex = langTasks.findIndex( t=> {
      return t === task;
    });
    if (taskIndex == -1) {
      newLanguages[languageIndex].tasks = langTasks.concat(task);
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
    <LabeledSelect
        label="Task"
        value={inputValue}
        onChange={handleSelection}>
      <option value="0" />
      <option value="1">Content Labeling</option>
      <option value="2">Translation</option>
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
