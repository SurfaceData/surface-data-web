import { GetServerSideProps } from 'next';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import Loader from 'rsuite/Loader';
import Message from 'rsuite/Message';
import styled from 'styled-components';

import LanguageStatsSection from '@components/LanguageStatsSection';
import type { LanguageStats } from '@features/LanguageStats';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 48px 24px;
`;

interface AuthenticatedHomeProps {
  session?: Session,
}

const AuthenticatedHome = ({session}: AuthenticatedHomeProps) => {
  const [languageStats, setLanguageStats] = useState([] as LanguageStats[]);
  const [isLoading, setLoading] = useState(false);

  useEffect( () => {
    setLoading(true);
    fetch('/api/language_stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session?.user?.languages || [])
    })
      .then((res) => res.json())
      .then((data) => {
        setLanguageStats(data);
        setLoading(false);
      });
  }, [session]);

  if (isLoading) {
    return (
      <Container>
        <Loader size="lg" content="Loading" />
      </Container>
    )
  }
  if (languageStats.length == 0) {
    return (
      <Container>
        <Message showIcon type="info">
          You haven't registered for any languages or task types.  Go to your {' '}
          <Link href="/profile" passHref>
            <a>profile</a>
          </Link>
          {' '} and setup at least one language and one task type.
        </Message>
      </Container>
    )
  }

  return (
    <Container>
      {
        languageStats.map( (langStat) => (
          <LanguageStatsSection key={langStat.language.isoCode} stats={langStat} />
        ))
      }
    </Container>
  );
}

export default AuthenticatedHome;

