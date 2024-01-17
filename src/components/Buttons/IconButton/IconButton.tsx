import React from 'react';

import styles from './iconButton.module.scss';

interface IIconButton {
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;

  type?: 'button' | 'submit' | 'reset';
}

const IconButton = (props: IIconButton) => {
  const { label, onClick, children } = props;

  return (
    <button className={styles.textButton} onClick={onClick}>
      {label}
      {children}
    </button>
  );
};

export default IconButton;
