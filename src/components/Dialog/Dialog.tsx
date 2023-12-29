'use client';

import React, { SyntheticEvent } from 'react';

import { FaTimes } from 'react-icons/fa';

import styles from './dialog.module.scss';
import TextButton from '../Buttons/TextButton/TextButton';

interface IDialog {
  title?: string;
  isOpen: boolean;
  hideModal?: () => void;
  children: React.ReactNode;
}

const Dialog = (props: IDialog) => {
  const { title, isOpen, hideModal, children } = props;

  const handleOutsideClick = (e: SyntheticEvent<HTMLDivElement>) => {
    if (
      hideModal &&
      (e.target as Element).className === styles.dialogBackdrop
    ) {
      hideModal();
    }
  };

  return (
    <div
      className={isOpen ? styles.dialogBackdrop : ''}
      onClick={handleOutsideClick}
    >
      <dialog open={isOpen} className={styles.dialogContainer}>
        <div className={styles.dialogHeader}>
          <div>{title && <h4 className={styles.dialogTitle}>{title}</h4>}</div>

          {hideModal && (
            <TextButton onClick={hideModal}>
              <FaTimes size={16} />
            </TextButton>
          )}
        </div>
        <div className={styles.dialogBody}>{children}</div>
      </dialog>
    </div>
  );
};

export default Dialog;
