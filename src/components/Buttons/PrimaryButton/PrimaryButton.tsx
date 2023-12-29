import React from 'react';

import styles from './primaryButton.module.scss';

interface IPrimaryButton {
  label: string;
  onClick: () => void;
}

const PrimaryButton = (props: IPrimaryButton) => {
  const { label, onClick } = props;

  return (
    <button className={styles.primaryButton} onClick={onClick}>
      {label}
    </button>
  );
};

export default PrimaryButton;
