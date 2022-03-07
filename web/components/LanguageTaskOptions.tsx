import { useEffect, useState } from 'react';
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
        id: task.id,
        label: TaskLabels[task.id],
        secondaryLang: task.secondaryLang.isoCode,
      });
    } else {
      const taskIndex = langTasks.findIndex(t=>
        t.id === task.id && t.secondaryLang === task.secondaryLang.isoCode
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
      t.id === task.id && t.secondaryLang === task.secondaryLang.isoCode
    );
  }

  return (
    <GridContainer>
      {
        languageTasks.map( (task, index) => (
          <SizedCheckboxCard
            key={index}
            title={task.id === 2
              ? TaskLabels[task.id] + ' from ' + task.secondaryLang.cldrName
              : TaskLabels[task.id]
            }
            checked={isTaskSelected(task)}
            description={TaskDescriptions[task.id]}
            onChange={ (e) => handleChange(e, task) }
          />
        ))
      }
    </GridContainer>
  );
}

export default LanguageTaskOptions;

