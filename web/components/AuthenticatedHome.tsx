import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import LanguageStatsSection from '@components/LanguageStatsSection';
import type { LanguageStats } from '@features/LanguageStats';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 48px 24px;
`;

const AuthenticatedHome = ({session}) => {
  const [languageStats, setLanguageStats] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect( () => {
    setLoading(true);
    fetch('/api/language_stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session.user.languages)
    })
      .then((res) => res.json())
      .then((data) => {
        setLanguageStats(data);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      {
        languageStats.map( (langStat) => (
          <LanguageStatsSection key={langStat.language} stats={langStat} />
        ))
      }
    </Container>
  );
}

export default AuthenticatedHome;

