import React from 'react';

import styles from './textButton.module.scss';

interface ITextButton {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';

  style?: React.CSSProperties;
}

const TextButton = (props: ITextButton) => {
  const { label, onClick, type, disabled, style } = props;

  return (
    <button
      type={type ?? 'button'}
      className={styles.textButton}
      onClick={onClick}
      disabled={disabled}
      style={style ?? {}}
    >
      {label}
    </button>
  );
};

export default TextButton;
