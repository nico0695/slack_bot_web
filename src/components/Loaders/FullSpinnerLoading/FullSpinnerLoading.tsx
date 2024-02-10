import React from 'react';

import { CgSpinnerTwoAlt } from 'react-icons/cg';

import styles from './fullSpinnerLoading.module.scss';

const FullSpinnerLoading = () => {
  return (
    <div className={styles.loadingContainer}>
      <CgSpinnerTwoAlt className={styles.spinner} />
    </div>
  );
};

export default FullSpinnerLoading;
