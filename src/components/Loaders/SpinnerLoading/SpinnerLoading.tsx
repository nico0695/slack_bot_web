import React from 'react';
import { ImSpinner9 } from 'react-icons/im';

import styles from './spinnerLoading.module.scss';

const SpinnerLoading = () => {
  return (
    <div className={styles.loadingContainer}>
      <ImSpinner9 className={styles.spinner} />
    </div>
  );
};

export default SpinnerLoading;
