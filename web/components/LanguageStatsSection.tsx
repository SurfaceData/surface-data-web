import styled from 'styled-components';

import ContributeCTA from '@components/ContributeCTA';
import LanguageTaskStatsSection from '@components/LanguageTaskStatsSection';
import type { LanguageStats } from '@features/LanguageStats';

interface LanguageStatsSectionProps {
  stats: LanguageStats,
}

const Container = styled.div`
  border: 1.6px solid #e6e4e1;
  padding: 13px;
  border-radius: 2px;
  font-size: 16px;
  color: #000;
  background-color: #fff;
  position: relative;
  margin-bottom: 30px;
`;

const Label = styled.span`
  margin-inline-start: 9px;
  padding: 0 5px;
  position: absolute;
  font-size: 1.5rem;
  top: -12px;
  background: #fff;
  color: #959595;
  z-index: 1;
`;

const TaskStatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 12px 0;
`;

const LanguageStatsSection = ({
  stats,
}: LanguageStatsSectionProps) => {
  return (
    <Container>
      <Label>
        {stats.language.cldrSupported ? stats.language.cldrName : stats.language.isoName}
      </Label>
      <TaskStatsContainer>
        {
          stats.taskStats.map( (taskStat, i) => (
            <LanguageTaskStatsSection
              key={i}
              language={stats.language}
              stats={taskStat}
              cta={<ContributeCTA language={stats.language} stats={taskStat} />}
            />
          ))
        }
      </TaskStatsContainer>
      <div>
        <div>{stats.info.description}</div>
        <div>{stats.info.funFact}</div>
      </div>
    </Container>
  );
}

export default LanguageStatsSection;
