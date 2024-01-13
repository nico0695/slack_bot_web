import React from 'react';

import styles from './images.module.scss';

const Loading = () => {
  return (
    <section className="">
      <div className={styles.imageContainer}>
        <div className={styles.skeletonCard}></div>
        <div className={styles.skeletonCard}></div>
        <div className={styles.skeletonCard}></div>
        <div className={styles.skeletonCard}></div>
        <div className={styles.skeletonCard}></div>
        <div className={styles.skeletonCard}></div>
      </div>
    </section>
  );
};

export default Loading;
