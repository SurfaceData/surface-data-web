import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import MainLayout from '@components/MainLayout';
import { getTaskComponent } from '@components/tasks/TaskMap';
import type { Task } from '@features/tasks';

const CreatePage: NextPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [taskCategory, setTaskCategory] = useState('');
  const [taskMode, setTaskMode] = useState('');
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [tasks, setTasks] = useState([] as Task[]);
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

    setTaskCategory(category);
    setTaskMode(mode);
    setPrimary(primaryLang);
    setSecondary(secondaryLang);

    const url = `/api/get_tasks?primary=${primaryLang}&secondary=${secondaryLang}&category=${category}&mode=${mode}`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, [status, router]);

  if (isLoading) {
    return (
      <MainLayout>
        <div>
          Loading
        </div>
      </MainLayout>
    );
  }
  if (tasks.length === 0) {
    return (
      <MainLayout>
        <div>
          We have run out of tasks for this Task Type
        </div>
      </MainLayout>
    );
  }

  const TaskComponent = getTaskComponent(taskMode, taskCategory);
  return (
    <MainLayout>
      {
        tasks.map( (task) => (
          <TaskComponent
            key={task.id}
            task={task}
            primary={primary}
            secondary={secondary}
          />
        ))
      }
    </MainLayout>
  );
}

export default CreatePage;
