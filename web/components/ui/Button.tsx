import styled, { css } from 'styled-components';

export const Button = styled.button`;
  position: relative;
  box-sizing: border-box;
  padding: .5rem 1rem;
  min-width: 14rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .9rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  border: 1px solid #4a4a4a;
  outline: none;
  background: #4a4a4a;
  color: #fff;

  ${props => props.outline && css`
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, .1);
    background-color: #fff;
    color: #000;
  `}

  ${props => props.rounded && css`
    border-radius: 50px;
  `}

  :hover {
    background-color: #fff;
    border-color: #000;
    color: #000;
  }
`;
