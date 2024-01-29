import React from 'react';

import styles from './labeledInput.module.scss';

interface ILabeledInputsProps {
  label?: string;

  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;

  type?: string;
  name: string;
}

const LabeledInput = (props: ILabeledInputsProps) => {
  const { label, type, name, value, onChange } = props;

  return (
    <div className={styles.labeldInput}>
      {label && <label htmlFor={name}>{label}</label>}

      <input
        type={type ?? 'text'}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        autoFocus
      />

      {props?.error && <small>{props?.error}</small>}
    </div>
  );
};

export default LabeledInput;
