import React from 'react';
import { renderToStaticMarkup as rtsm } from 'react-dom/server';
import { FiChevronDown } from 'react-icons/fi';
import styled, { css } from 'styled-components';

import VisuallyHidden from '@components/ui/VisuallyHidden';

const LabelContainer = styled.label`
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-bottom: 1.5rem;

  & input,
  & select,
  & textarea {
    box-sizing: border-box;
    border: 1.6px solid #e6e4e1;
    border-radius: 2px;
    padding: 13px;
    font-size: 16px;
    color: #000;
    background-color: #fff;
  }
`;

const Label = styled.span`
  margin-inline-start: 9px;
  padding: 0 5px;
  position: absolute;
  top: -8px;
  background: #fff;
  font-size: 12px;
  color: #959595;
  z-index: 1;
`;

const downIcon = css`
  ${rtsm(<FiChevronDown size={20} color="black" />).replace(/"/g, "'")}
`;

const Wrapper = styled.div`
  position: relative;
  & select {
    cursor: pointer;
    padding-inline-end: 33px;
    width: 100%;
    appearance: none;
  }

  &::after {
    content: url("data:image/svg+xml; utf8, ${downIcon}");
    position: absolute;
    inset-inline-end: 15px;
    width: 13px;
    height: 100%;
    pointer-events: none;
    right: 20px;
    top: 15px;
  }
`;

export const LabeledFormControl = React.forwardRef(
  (
    {
      className = '',
      component: Component,
      label,
      required,
      isLabelVisuallyHidden,
      ...props
    }: any, ref 
  ) => {
    const child = <Component {...{ref, required, ...props }} />;

    return (
      <LabelContainer
        {...props}>
        {isLabelVisuallyHidden ? (
          <VisuallyHidden>{label}</VisuallyHidden>
        ) : (
          <Label>
            <span aria-hidden="true">{required && '*'}</span>
            {label}
          </Label>
        )}
        {Component == 'select' ? (
          <Wrapper>{child}</Wrapper>
        ) : (
          child
        )}
      </LabelContainer>
    );
  }
);
LabeledFormControl.displayName = 'LabeledFormControl';
