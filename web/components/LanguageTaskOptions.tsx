import * as React from 'react';
import querystring from 'querystring';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { CheckboxCard } from '@components/ui/CheckboxCard';
import type { TaskStats } from '@features/LanguageStats';
import type { } from '@features/LanguageStats';
import type { LanguageTasks, TaskMeta } from '@features/tasks';

const GridContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const SizedCheckboxCard = styled(CheckboxCard)`
  height: 100px;
  width: 300px;
`;

interface LanguageTaskOptionsProps {
  locale: LanguageTasks,
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
  const [languageTasks, setLanguageTasks] = useState([] as TaskStats[]);
  useEffect( () => {
    if (!locale.languageDisplay) {
      return;
    }

    const allLanguageCodes = allLanguages
      .filter( (lang) => lang.languageDisplay)
      .map(({languageDisplay}) => languageDisplay?.isoCode || '');
    const params = querystring.stringify({
      language: locale.languageDisplay.isoCode,
      otherLangs: allLanguageCodes,
    });
    fetch(`/api/language_tasks?${params}`)
      .then((res) => res.json())
      .then((data) => setLanguageTasks(data));
  }, [locale, allLanguages]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    task: TaskStats) => {
    const newLanguages = allLanguages.slice();
    const langTasks = newLanguages[languageIndex].tasks;

    const isChecked = e.target.checked || false;
    if (isChecked) {
      newLanguages[languageIndex].tasks = langTasks.concat({
        taskCategory: task.taskCategory,
        taskMode: task.taskMode,
        secondaryLang: task.secondaryLang.isoCode,
      } as TaskMeta);
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

  const isTaskSelected = (task: TaskStats) => {
    const tasks = allLanguages[languageIndex]?.tasks || [];
    return -1 !== tasks.findIndex(t =>
      t.taskCategory.id === task.taskCategory.id &&
      t.taskMode.id === task.taskMode.id &&
      t.secondaryLang === task.secondaryLang.isoCode
    );
  }
  const getTaskTitle = (task: TaskStats) => {
    if (locale?.languageDisplay?.isoCode ===
        task?.secondaryLang?.isoCode) {
      return `${task.taskMode.fullName} | ${task.taskCategory.fullName}`;
    }
    return `${task.taskMode.fullName} | ${task.taskCategory.fullName} | from ${task.secondaryLang.cldrName}`;
  };

  if (locale.languageDisplay &&
      languageTasks.length === 0) {
    return (
      <GridContainer>
        <div>
          We are not yet ready to support your language.  Join
          <a href={process.env.DISCORD_URL}> our discord </a>
          to help make sure we are handling your language correctly.
        </div>
      </GridContainer>
    );
  }
  return (
    <GridContainer>
      {
        languageTasks.map( (task, index) => (
          <SizedCheckboxCard
            key={index}
            title={getTaskTitle(task)}
            checked={isTaskSelected(task)}
            description={task.taskCategory?.description || ''}
            onChange={(e) => handleChange(e, task)}
          />
        ))
      }
    </GridContainer>
  );
}

export default LanguageTaskOptions;
