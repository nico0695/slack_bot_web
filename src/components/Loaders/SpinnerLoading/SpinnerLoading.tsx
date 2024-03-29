import React from 'react';

import { CgSpinnerTwoAlt } from 'react-icons/cg';

import styles from './spinnerLoading.module.scss';

const SpinnerLoading = () => {
  return (
    <div className={styles.loadingContainer}>
      <CgSpinnerTwoAlt className={styles.spinner} />
    </div>
  );
};

export default SpinnerLoading;
