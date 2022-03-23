import type { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { FaBan, FaCheckDouble, FaCogs } from 'react-icons/fa';

import type { TaskState } from '@features/tasks';

interface ActiveTaskPillProps {
  value: number,
  icon: ReactElement,
  state: TaskState;
}

const Container = styled.div<{
  active: boolean,
}>`
  box-sizing: unset;
  display: flex;
  flex-direction: column;
  height: 70px;
  width: 30px;
  padding: 12px 8px;
  justify-content: space-between;
  align-items: center;
  border-radius: 25px;

  background: #e7e5e2;
  ${props => props.active && css`
    background: #fff;
    border: 2px solid #e7e5e2;
  `}
`;

const Value = styled.div<{
  active: boolean,
}>`
  align-items: center;
  justify-content: center;
  display: flex;
  width: 32px;
  height: 32px;
  border-radius: 50%;

  background-color: #fff;
  ${props => props.active && css`
    background-color: #959595;
    color: #fff;
  `}
`;

const Icon = styled.div<{
  state: TaskState;
}>`
  color: #b1b4e5;
  ${props => props.state === 'active' && css`
    color: #000;
  `}
  ${props => props.state === 'done' && css`
    color: #59ccb7;
  `}
  ${props => props.state === 'skipped' && css`
    color: #f89096;
  `}
`;

export const ActiveTaskPill = ({
  value,
  icon,
  state,
}: ActiveTaskPillProps) => {
  let realIcon;
  if (state === 'skipped') {
    realIcon = (<FaBan />);
  } else if (state === 'done') {
    realIcon = (<FaCheckDouble />);
  } else {
    realIcon = icon;
  }
  const isActive = state === 'active';
  return (
    <Container active={isActive}>
      <Value active={isActive}>{value}</Value>
      <Icon state={state}>
        {realIcon}
      </Icon>
    </Container>
  );
};
