import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import MainLayout from '@components/MainLayout';

const VerifyTranslate: NextPage = () => {
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

    const { primary, secondary } = router.query;
    const url = `/api/get_tasks?primary=${primary}&secondary=${secondary}&category=Translate&mode=Verify`;

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
            <div>
              {task.secondaryText} ->
              {task.primaryText}
            </div>
          </div>
        ))
      }
    </MainLayout>
  );
}

export default VerifyTranslate;
