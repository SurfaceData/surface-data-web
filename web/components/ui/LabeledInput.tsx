import React from 'react';

import { LabeledFormControl } from '@components/ui/LabeledFormControl';

export const LabeledInput = React.forwardRef(
  (
    { 
      type, 
      ...props
    }: any, ref
  ) => (
  <LabeledFormControl 
    component="input"
    ref={ref}
    type={type || 'text'}
    name={type}
    {...props}
  />
));
LabeledInput.displayName = 'LabeledInput';
