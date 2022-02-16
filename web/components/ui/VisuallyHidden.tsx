import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

const HiddenDiv = styled.div`
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
`;

const VisuallyHidden = ( { children }: Props) => {
  return <HiddenDiv>{children}</HiddenDiv>;
};

export default VisuallyHidden;
