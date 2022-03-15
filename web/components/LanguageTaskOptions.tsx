import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { CheckboxCard } from '@components/ui/CheckboxCard';
import { LanguageTasks } from '@features/tasks';
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
  allLanguages: LanguageTasks[],
  setUserLanguages: (locale: LanguageTasks[]) => void;
}

const LanguageTaskOptions = ({
  locale,
  languageIndex,
  allLanguages,
  setUserLanguages,
}: LanguageTaskOptionsProps) => {
  const [languageTasks, setLanguageTasks] = useState([]);
  useEffect( () => {
    if (!locale.languageDisplay) {
      return;
    }

    fetch(`/api/language_tasks?language=${locale.languageDisplay.isoCode}`)
      .then((res) => res.json())
      .then((data) => setLanguageTasks(data));
  }, []);

  const handleChange = (e, task) => {
    const newLanguages = allLanguages.slice();
    const langTasks = newLanguages[languageIndex].tasks;

    const isChecked = e.target.checked;
    if (isChecked) {
      newLanguages[languageIndex].tasks = langTasks.concat({
        taskCategory: task.taskCategory,
        taskMode: task.taskMode,
        secondaryLang: task.secondaryLang.isoCode,
      });
    } else {
      const taskIndex = langTasks.findIndex(t=>
        t.taskCategory.id === task.taskCategory.id &&
        t.taskMode.id === task.taskMode.id &&
        t.secondaryLang === task.secondaryLang.isoCode
      );
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
  const isTaskSelected = (task) => {
    const tasks = allLanguages[languageIndex].tasks;
    return -1 !== tasks.findIndex(t =>
      t.taskCategory.id === task.taskCategory.id &&
      t.taskMode.id === task.taskMode.id &&
      t.secondaryLang === task.secondaryLang.isoCode
    );
  }
  const getTaskTitle = (task) => {
    if (locale.languageDisplay.isoCode ===
        task.secondaryLang.isoCode) {
      return `${task.taskMode.fullName} | ${task.taskCategory.fullName}`;
    }
    return `${task.taskMode.fullName} | ${task.taskCategory.fullName} | from ${task.secondaryLang.cldrName}`;
  };

  return (
    <GridContainer>
      {
        languageTasks.map( (task, index) => (
          <SizedCheckboxCard
            key={index}
            title={getTaskTitle(task)}
            checked={isTaskSelected(task)}
            description={task.taskCategory.description}
            onChange={ (e) => handleChange(e, task) }
          />
        ))
      }
    </GridContainer>
  );
}

export default LanguageTaskOptions;
