import { useEffect, useState } from 'react';
import { Carousel } from 'rsuite';
import styled from 'styled-components';

import LanguageTaskStatsSection from '@components/LanguageTaskStatsSection';
import type { LanguageStats } from '@features/LanguageStats';
import type { LandingStats } from '@features/stats';

const Container = styled.div`
  padding: 24px 12ps;
`;

const Title = styled.div`
  font-size: 24px;
  margin: 16px 0px;
  text-align: left;
`;

const Subtitle = styled.div`
  font-size: 20px;
  margin: 16px 0px;
  text-align: left;
  color: var(--rs-gray-50);
`;

const ExplainerContainer = styled.div`
  font-size: 16px;
  text-align: left;
`;

const StatsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
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

const StatsCarousel = styled(Carousel)`
  height: 300px;
`;

const StatsSplash = () => {
  const [languageStats, setLanguageStats] = useState([] as LanguageStats[]);
  const [landingStats, setLandingStats] = useState({
    languageCount: 0,
    languagePairCount: 0,
    taskCount: 0,
  } as LandingStats);

  useEffect( () => {
    fetch('/api/language_stats')
      .then((res) => res.json())
      .then((data) => {
        setLanguageStats(data);
      });
    fetch('/api/landing_stats')
      .then((res) => res.json())
      .then((data) => {
        setLandingStats(data);
      });
  }, []);

  return (
    <Container>
      <StatsRow>
        <TotalStat>
          <TotalStatTitle>{landingStats.languageCount}</TotalStatTitle>
          <TotalStatSubtext>Languages</TotalStatSubtext>
        </TotalStat>

        <TotalStat>
          <TotalStatTitle>{landingStats.languagePairCount}</TotalStatTitle>
          <TotalStatSubtext>Language Pairs</TotalStatSubtext>
        </TotalStat>

        <TotalStat>
          <TotalStatTitle>{landingStats.taskCount}</TotalStatTitle>
          <TotalStatSubtext>Tasks</TotalStatSubtext>
        </TotalStat>

      </StatsRow>

      <Title>
        How we work.
      </Title>

      <ExplainerContainer>
        We're generating new high quality data by following a simple two
        step process.
        <ol>
          <li>Proposing new translations or quality tags for sentences</li>
          <li>Rating or Verifying those proposals</li>
        </ol>
        With these two steps and a small amount of data analysis, we can
        catch small and large annotation mistakes and publish high
        quality data.
      </ExplainerContainer>

      <Title>
        The languages we're working on.
      </Title>

      <StatsCarousel autoplay>
      {
        languageStats.map( ({language, taskStats}, i) => (
          <StatsColumn key={i}>
            <Subtitle>
              {language.cldrName}
            </Subtitle>

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
          </StatsColumn>
        ))
      }
      </StatsCarousel>
    </Container>
  );
};

export default StatsSplash;
