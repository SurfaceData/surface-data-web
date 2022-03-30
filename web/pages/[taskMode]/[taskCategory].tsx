import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { RiTranslate } from 'react-icons/ri';
import styled from 'styled-components';

import { loadTranslation } from '@common/i18n';
import MainLayout from '@components/MainLayout';
import { ActiveTaskPill } from '@components/tasks/ActiveTaskPill';
import { getTaskComponent, getTaskIcon } from '@components/tasks/TaskMap';
import type { LanguageDisplay } from '@features/language';
import type { Task, TaskCategory, TaskMode, TaskState } from '@features/tasks';

const IndexContainer = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 20px;
  margin: 16px;
`;

const TaskContainer = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  margin: 32px;
`;

const CreatePage: NextPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [taskCategory, setTaskCategory] = useState<TaskCategory | null>(null);
  const [taskMode, setTaskMode] = useState<TaskMode | null>(null);
  const [primary, setPrimary] = useState<LanguageDisplay | null>(null);
  const [secondary, setSecondary] = useState<LanguageDisplay | null>(null);
  const [tasks, setTasks] = useState([] as Task[]);
  const [taskState, setTaskState] = useState([] as TaskState[]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: session, status } = useSession({ required: true });

  const router = useRouter();

  useEffect( () => {
    if (status === "loading") {
      return;
    }
    if (!router.isReady) {
      return;
    }

    const mode = (router.query?.taskMode || 'unknown') as string;
    const category = (router.query?.taskCategory || 'unknown') as string;
    const primaryLang = (router.query?.primary|| 'unk') as string;
    const secondaryLang = (router.query?.secondary|| 'unk') as string;

    const languages = session.user.languages.map( ({languageDisplay}) =>
      languageDisplay);
    setPrimary(languages.find(
      lang => lang.isoCode === primaryLang));
    setSecondary(languages.find(
      lang => lang.isoCode === secondaryLang));

    const url = `/api/get_tasks?primary=${primaryLang}&secondary=${secondaryLang}&category=${category}&mode=${mode}`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTaskCategory(data.taskMeta.taskCategory as TaskCategory);
        setTaskMode(data.taskMeta.taskMode as TaskMode);
        const tasks = data.tasks;
        const taskState = tasks.map( () => 'inactive') as TaskState[];
        taskState[0] = 'active';
        setTasks(tasks);
        setTaskState(taskState);
        setCurrentIndex(0);
        setLoading(false);
      });
  }, [status, session, router]);

  const advanceTask = () => {
    taskState[currentIndex] = 'done';
    if (tasks.length === currentIndex + 1) {
      setCurrentIndex(-1);
      return;
    }
    taskState[currentIndex+1] = 'active';
    setTaskState(taskState);
    setCurrentIndex(currentIndex + 1);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div>
          Loading
        </div>
      </MainLayout>
    );
  }
  if (tasks.length === 0 ||
      !taskCategory ||
      !taskMode ||
      !primary ||
      !secondary) {
    return (
      <MainLayout>
        <div>
          We have run out of tasks for this Task Type
        </div>
      </MainLayout>
    );
  }

  let Component;
  if (currentIndex === -1) {
    Component = (<div>Done!</div>);
  } else {
    const TaskComponent = getTaskComponent(
      taskMode?.shortName || '', taskCategory?.shortName || '');
    Component = (
      <TaskComponent
        task={tasks[currentIndex]}
        category={taskCategory}
        mode={taskMode}
        primary={primary}
        secondary={secondary}
        onDone={advanceTask}
      />
    );
  }
  const TaskIcon = getTaskIcon(taskCategory?.shortName || '');

  return (
    <MainLayout>
      <IndexContainer>
        {
          tasks.map( (task, i) => (
            <ActiveTaskPill
              key={i}
              value={i+1}
              icon={<TaskIcon />}
              state={taskState[i]}
            />
          ))
        }
      </IndexContainer>
      <TaskContainer>
        {Component}
      </TaskContainer>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const translation = await loadTranslation(
    ctx.locale!,
    process.env.NODE_ENV === 'production'
  );
  return {
    props: {
      translation
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default CreatePage;
