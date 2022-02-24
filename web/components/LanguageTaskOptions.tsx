import { useState } from 'react';
import styled from 'styled-components';

import { CheckboxCard } from '@components/ui/CheckboxCard';
import { Language } from '@features/language';
import { TaskType, Tasks, TaskDescriptions, TaskLabels, stringToTaskType } from '@features/tasks';

const GridContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const SizedCheckboxCard = styled(CheckboxCard)`
  height: 100px;
  width: 300px;
`;

interface LanguageTaskOptionsProps {
  locale: Language,
  languageIndex: number,
  allLanguages: Language[],
  setUserLanguages: (locale: Language[]) => void;
}

const LanguageTaskOptions = ({
  locale,
  languageIndex,
  allLanguages,
  setUserLanguages,
}: LanguageTaskOptionsProps) => {
  const handleChange = (e, taskType) => {

    const newLanguages = allLanguages.slice();
    const langTasks = newLanguages[languageIndex].tasks;

    const isChecked = e.target.checked;
    if (isChecked) {
      newLanguages[languageIndex].tasks = langTasks.concat({
        id: taskType,
        label: TaskLabels[taskType],
      });
    } else {
      const taskIndex = langTasks.findIndex(t=> t.id === taskType);
      langTasks.splice(taskIndex, 1);
      newLanguages[languageIndex].tasks = langTasks;
    }
    setUserLanguages(newLanguages);
  };

  const removeTask = (index) => {
    const newLanguages = allLanguages.slice();
    const langTasks = newLanguages[languageIndex].tasks;
    langTasks.splice(index, 1);
    setUserLanguages(newLanguages);
  };
  const isTaskSelected = (taskType) => {
    const tasks = allLanguages[languageIndex].tasks;
    return -1 !== tasks.findIndex(t => t.id === taskType);
  }

  return (
    <GridContainer>
    {
      Tasks.map( (taskType, index) => (
        <SizedCheckboxCard
          key={taskType}
          title={TaskLabels[taskType]}
          checked={isTaskSelected(taskType)}
          description={TaskDescriptions[taskType]}
          onChange={ (e) => handleChange(e, taskType) }
        />
      ))
    }
    </GridContainer>
  );
}

export default LanguageTaskOptions;

