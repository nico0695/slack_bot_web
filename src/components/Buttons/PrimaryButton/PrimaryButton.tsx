import React from 'react';
import { CgSpinnerAlt } from 'react-icons/cg';

import styles from './primaryButton.module.scss';

interface IPrimaryButton {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;

  type?: 'button' | 'submit' | 'reset';

  style?: React.CSSProperties;

  className?: string;
}

const PrimaryButton = (props: IPrimaryButton) => {
  const { label, onClick, type, disabled, loading, style, className } = props;

  return (
    <button
      type={type ?? 'button'}
      className={`${styles.primaryButton} ${className ?? ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={style ?? {}}
    >
      {loading === true ? <CgSpinnerAlt className={styles.spinner} /> : label}
    </button>
  );
};

export default PrimaryButton;
