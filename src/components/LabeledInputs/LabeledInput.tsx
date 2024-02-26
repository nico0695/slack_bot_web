import React from 'react';

import styles from './labeledInput.module.scss';

interface ILabeledInputsProps {
  label?: string;

  value?: string | number;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;

  disabled?: boolean;

  type?: string;
  name: string;

  light?: boolean;
  inline?: boolean;
}

const LabeledInput = (props: ILabeledInputsProps) => {
  const {
    label,
    type,
    name,
    value,
    checked,
    onChange,
    disabled,
    light,
    inline,
  } = props;

  return (
    <div className={`${styles.labeldInput} ${inline ? 'inline' : ''}`}>
      {label && <label htmlFor={name}>{label}</label>}

      <input
        type={type ?? 'text'}
        id={name}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange ?? (() => null)}
        autoFocus
        disabled={disabled}
        className={`${light ? 'light' : ''}`}
      />

      {props?.error && <small>{props?.error}</small>}
    </div>
  );
};

export default LabeledInput;
