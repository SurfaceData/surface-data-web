import styled from 'styled-components';

const Container = styled.div`
  background: #e7e5e2;
  margin-top: .3rem;
  height: .5rem;
  width: 100%;
`;

const Bar = styled.div<{
  progress: number,
}>`
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-weight: 700;
  background: #629ff4;
  width: ${props => props.progress + "%"};
`;

interface ProgressBarProps {
  progress: number,
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <Container>
      <Bar progress={progress} />
    </Container>
  );
};
