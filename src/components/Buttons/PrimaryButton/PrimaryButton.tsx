import React from 'react';

import styles from './primaryButton.module.scss';

interface IPrimaryButton {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';

  style?: React.CSSProperties;
}

const PrimaryButton = (props: IPrimaryButton) => {
  const { label, onClick, type, disabled } = props;

  return (
    <button
      type={type ?? 'button'}
      className={styles.primaryButton}
      onClick={onClick}
      disabled={disabled}
      style={props?.style ?? {}}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
