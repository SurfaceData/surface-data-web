import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import MainLayout from '@components/MainLayout';

const Contribute: NextPage = () => {
  const [isLoading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const { data: session, status } = useSession({ required: true });

  const router = useRouter();

  useEffect( () => {
    if (status === "loading") {
      return;
    }
    if (!router.isReady) {
      return;
    }

    const { sl, tl, annotType } = router.query;
    const url = `/api/available_tasks?sl=${sl}&tl=${tl}&annotType=${annotType}`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, [status, router]);


  return (
    <MainLayout>
      {
        tasks.map( (task) => (
          <div key={task.id}>
            {task.source.text}
          </div>
        ))
      }
    </MainLayout>
  );
}

export default Contribute;
