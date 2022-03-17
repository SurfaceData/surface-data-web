import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  title: string,
  description: string,
  checked: boolean,
  className?: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
};

const Container = styled.div`
  border: 1px solid rgba(0, 0, 0, .1);
  border-radius: 6px;
  padding: 8px;
`;

const TitleBar = styled.div`
  color: #629ff4;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  padding-bottom: 2px;
`;

const Description = styled.div`
  margin-top: 8px;
`;

export const CheckboxCard = ({
  title,
  description,
  checked,
  className,
  onChange
}: Props) => {
  const [isChecked, setChecked] = useState(checked);
  return (
    <Container className={className}>
      <TitleBar>
        <span>{title}</span>
        <input
            type="checkbox"
            checked={isChecked}
            onChange={ (e) => {
              setChecked(e.target.checked);
              if (onChange) {
                onChange(e);
              }
            }}>
        </input>
      </TitleBar>
      <Description>
        {description}
      </Description>
    </Container>
  );
};

