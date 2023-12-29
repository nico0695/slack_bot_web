import React from 'react';

import styles from './textButton.module.scss';

interface IPrimaryButton {
  label?: string;
  onClick: () => void;
  children?: React.ReactNode;
}

const TextButton = (props: IPrimaryButton) => {
  const { label, onClick, children } = props;

  return (
    <button className={styles.textButton} onClick={onClick}>
      {label}
      {children}
    </button>
  );
};

export default TextButton;
