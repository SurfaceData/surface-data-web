import type { ReactElement } from 'react';
import styled from 'styled-components';

import ContributeCTA from '@components/ContributeCTA';
import { ProgressBar } from '@components/ui/ProgressBar';
import type { LanguageDisplay } from '@features/language';
import type { TaskStats } from '@features/LanguageStats';

interface LanguageTaskStatsSectionProps {
  language: LanguageDisplay,
  stats: TaskStats,
  cta: ReactElement,
}

const Container = styled.div`
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.09), 0 1px 4px rgba(0, 0, 0, .09);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 13px;
  border-radius: 2px;
  font-size: 16px;
  color: #000;
  background-color: #fff;
  width: 350px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1.0rem 1.5rem;
`;

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 60%;
`;

const TaskLabel = styled.div`
  font-size: 1.2rem;
`;

const TaskDescription = styled.div`
  font-size: .8rem;
  font-weight: 200;
`;

const MilestoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0 12px 12px;
  width: 40%;
`;

const MilestoneSummary = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MilestoneLabel = styled.div`
  color: #959595;
  font-size: .9rem;
  font-weight: 300;
  font-style: italic;
`;

const MilestoneStats = styled.div`
  font-size: .6rem;
  text-align: right;
  font-weight: 400;
  font-style: bold;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const LanguageTaskStatsSection = ({
  language,
  stats,
  cta,
}: LanguageTaskStatsSectionProps) => {
  const getTaskTitle = (task: TaskStats) => {
    if (language.isoCode ===
        task.secondaryLang.isoCode) {
      return `${task.taskMode.fullName} | ${task.taskCategory.fullName}`;
    }
    return `${task.taskMode.fullName} | ${task.taskCategory.fullName} | from ${task.secondaryLang.cldrName}`;
  };
  return (
    <Container>
      <ContentContainer>
        <TaskContainer>
          <TaskLabel>
            {getTaskTitle(stats)}
          </TaskLabel>
          <TaskDescription>
            {stats.taskCategory.description}
          </TaskDescription>
        </TaskContainer>

        <MilestoneContainer>
          <MilestoneSummary>
            <MilestoneLabel>Total</MilestoneLabel>
            <MilestoneStats>{stats.progress} / {stats.nextMilestone}</MilestoneStats>
          </MilestoneSummary>
          <ProgressBar
            progress={100.0 * stats.progress / stats.nextMilestone} />
        </MilestoneContainer>
      </ContentContainer>

      <ActionContainer>
        {cta}
      </ActionContainer>
    </Container>
  );
}

export default LanguageTaskStatsSection;
