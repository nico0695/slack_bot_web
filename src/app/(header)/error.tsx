'use client';

import styles from '../error.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorTitle}>Algo salio mal</h2>
      <p className={styles.errorMessage}>{error.message}</p>
      <button className={styles.retryButton} onClick={() => reset()}>
        Reintentar
      </button>
    </div>
  );
}
