import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = '', ...props }: SelectProps) {
  return <select {...props} className={`control control-select ${className}`.trim()} />;
}
