import { useEffect, useState } from 'react';
import styled from 'styled-components';

import LanguageTaskStatsSection from '@components/LanguageTaskStatsSection';
import type { LanguageStats } from '@features/LanguageStats';

const Container = styled.div`
  padding: 24px 12ps;
`;

const Title = styled.div`
  font-size: 24px;
  margin: 16px 0px;
  text-align: left;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const TotalStat = styled.div`
  padding: 0px 24px;
  text-align: left;
`;

const TotalStatTitle = styled.div`
  font-size: 20px;
`;

const TotalStatSubtext = styled.div`
  font-size: 14px;
`;

const StatsSplash = () => {
  const [languageStats, setLanguageStats] = useState([] as LanguageStats[]);
  const [isLoading, setLoading] = useState(false);

  useEffect( () => {
    setLoading(true);
    fetch('/api/language_stats')
      .then((res) => res.json())
      .then((data) => {
        setLanguageStats(data);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <StatsRow>
        <TotalStat>
          <TotalStatTitle>X+ Thousand</TotalStatTitle>
          <TotalStatSubtext>Contributors</TotalStatSubtext>
        </TotalStat>

        <TotalStat>
          <TotalStatTitle>X+ Thousand</TotalStatTitle>
          <TotalStatSubtext>Languages</TotalStatSubtext>
        </TotalStat>

        <TotalStat>
          <TotalStatTitle>X+ Million</TotalStatTitle>
          <TotalStatSubtext>Sentences</TotalStatSubtext>
        </TotalStat>

        <TotalStat>
          <TotalStatTitle>X+ Million</TotalStatTitle>
          <TotalStatSubtext>Translations</TotalStatSubtext>
        </TotalStat>

      </StatsRow>

      {
        languageStats.map( ({language, taskStats}, i) => (
          <div key={i}>
            <Title>
              {language.cldrName}
            </Title>

            <StatsRow>
              {
                taskStats.map( (taskStat, j) => (
                  <LanguageTaskStatsSection
                    key={`${i}-${j}`}
                    language={language}
                    cta={<></>}
                    stats={taskStat}
                  />
                ))
              }
            </StatsRow>
          </div>
        ))
      }
    </Container>
  );
};

export default StatsSplash;
