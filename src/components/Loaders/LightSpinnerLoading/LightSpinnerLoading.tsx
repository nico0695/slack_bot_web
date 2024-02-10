import React from 'react';

import { CgSpinnerTwoAlt } from 'react-icons/cg';

import styles from './lightSpinnerLoading.module.scss';

const LightSpinnerLoading = () => {
  return (
    <div className={styles.loadingContainer}>
      <CgSpinnerTwoAlt
        className={styles.spinner}
        color="white"
        fontSize="2em"
      />
    </div>
  );
};

export default LightSpinnerLoading;
