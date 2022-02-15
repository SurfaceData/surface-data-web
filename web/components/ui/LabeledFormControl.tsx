import React from 'react';

export const LabeledFormControl = React.forwardRef(
  (
    {
      className = '',
      component: Component,
      label,
      required,
      isLabelVisuallyHidden,
      ...props
    }: any,
    ref
  ) => {
    const child = <Component {...{ref, required, ...props }} />;

    return (
      <label {...props}>
        {isLabelVisuallyHidden ? (
          <div>{label}</div>
        ) : (
          <span>
            <span aria-hidden="true">{required && '*'}</span>
            {label}
          </span>
        )}
        {Component == 'select' ? (
          <div>{child}</div>
        ) : (
          child
        )}
      </label>
    );
  }
);
