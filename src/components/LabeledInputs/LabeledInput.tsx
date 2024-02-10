import React from 'react';

import styles from './labeledInput.module.scss';

interface ILabeledInputsProps {
  label?: string;

  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;

  disabled?: boolean;

  type?: string;
  name: string;

  light?: boolean;
}

const LabeledInput = (props: ILabeledInputsProps) => {
  const { label, type, name, value, onChange, disabled, light } = props;

  return (
    <div className={styles.labeldInput}>
      {label && <label htmlFor={name}>{label}</label>}

      <input
        type={type ?? 'text'}
        id={name}
        name={name}
        value={value}
        onChange={onChange ?? (() => null)}
        autoFocus
        disabled={disabled}
        className={light ? 'light' : ''}
      />

      {props?.error && <small>{props?.error}</small>}
    </div>
  );
};

export default LabeledInput;
