import React from 'react';

import styles from './labeledInput.module.scss';

interface IOptionsSelect {
  value: string | number;
  label: string;
}

interface ILabeledInputsProps {
  label?: string;

  value?: string | number;
  checked?: boolean;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  error?: string | null;

  disabled?: boolean;

  type?: string;
  name: string;

  id?: string;

  light?: boolean;
  inline?: boolean;

  autoFocus?: boolean;

  // Select
  options?: IOptionsSelect[];
}

const LabeledInput = (props: ILabeledInputsProps) => {
  const {
    label,
    type,
    name,
    id,
    value,
    checked,
    onChange,
    disabled,
    light,
    inline,
    autoFocus,
    options,
  } = props;

  return (
    <div className={`${styles.labeldInput} ${inline ? 'inline' : ''}`}>
      {label && <label htmlFor={name}>{label}</label>}

      {(!type || !['textarea', 'select'].includes(type)) && (
        <input
          type={type ?? 'text'}
          id={id ?? name}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange ?? (() => null)}
          autoFocus={autoFocus}
          disabled={disabled}
          className={`${light ? 'light' : ''}`}
        />
      )}

      {type === 'textarea' && (
        <textarea
          id={id ?? name}
          name={name}
          value={value}
          onChange={onChange ?? (() => null)}
          disabled={disabled}
          className={`${light ? 'light' : ''}`}
          rows={5}
        />
      )}

      {type === 'select' && (
        <select
          id={id ?? name}
          name={name}
          value={value}
          onChange={onChange ?? (() => null)}
          disabled={disabled}
          className={`${light ? 'light' : ''}`}
        >
          {options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {props?.error && <small>{props?.error}</small>}
    </div>
  );
};

export default LabeledInput;
