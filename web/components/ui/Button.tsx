import styled, { css } from 'styled-components';

import type { Style } from '@features/styles';
import { Black } from '@styles/palettes';

export const Button = styled.button<{
  outline?: boolean,
  rounded?: boolean
  palette?: Style,
}>`;
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
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.palette ? props.palette.secondary: Black.secondary};
  outline: none;
  background: ${props => props.palette ? props.palette.primary : Black.primary};
  color: #fff;

  ${props => props.outline && css`
    border-radius: 4px;
    background-color: #fff;
    color: #000;
  `}

  ${props => props.rounded && css`
    border-radius: 50px;
  `}

  :hover {
    background-color: #fff;
    border-color: ${props => props.palette ? props.palette.primary : Black.primary};
    color: #000;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
`;
