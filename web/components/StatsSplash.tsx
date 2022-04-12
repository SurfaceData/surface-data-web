import Image from 'next/image';
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

const ExplainerRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  gap: 20px;
`;

const ExplainerDetail = styled.div`
  width: 60%;
  margin: auto;
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
        Some of our languages
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

      <Title>
        How we create
      </Title>

      <ExplainerContainer>
        We generate new high quality data by following a simple
        multi-step process.

        <ExplainerRow>
          <Image
            height={200}
            width={200}
            alt='Creating quality labels or translations'
            src='/svg/undraw_create_re_57a3.svg' />
          <ExplainerDetail>
            First, we create new translations or quality labels for the
            sentences we already have.  When translating, we are helping
            to create new data for languages we each care about.  When
            creating quality labels, we are helping figure out which
            sentences in our language are good and which may not actually
            be in our language.
          </ExplainerDetail>
        </ExplainerRow>

        <ExplainerRow>
          <ExplainerDetail>
            Next, for every translation or every quality tag, someone
            else in the collective double checks that the submission
            looks good and generally makes sense.  When evaluating, you
            can either mark something as <b>correct</b> or
            <b>incorrect</b> or rate something on a sliding quality scale.
          </ExplainerDetail>
          <Image
            height={200}
            width={200}
            alt='Rating quality labels or translations'
            src='/svg/undraw_reviews_lp8w.svg' />
        </ExplainerRow>

        <ExplainerRow>
          <Image
            height={200}
            width={200}
            alt='Cross referencing ratings to find the best results'
            src='/svg/undraw_detailed_examination_re_ieui.svg' />
          <ExplainerDetail>
            Finally, after we have several submissions and reviews, we
            use a little bit of machine learning to figure out which
            translations and which labels meet our quality bar.  We take
            into account how often reviewers agree with each other and
            when content might be a little unusual or more difficult than
            expected.  Overall, based on multiple research papers, our
            approach helps produce extremely high quality data.
          </ExplainerDetail>
        </ExplainerRow>

        <ExplainerRow>
          <ExplainerDetail>
            The end result is a corpus of new language data that we 
            created together.  Overtime we will be adding even better
            support for collecrive data governance.  Soon, collective
            members will be able to help decide what data we should
            create in the first place and then ultimately help decide
            what we do with the data we have created.
          </ExplainerDetail>
          <Image
            height={200}
            width={200}
            alt='Creating together to make the best data'
            src='/svg/undraw_flowers_vx06.svg' />
        </ExplainerRow>

      </ExplainerContainer>
    </Container>
  );
};

export default StatsSplash;
