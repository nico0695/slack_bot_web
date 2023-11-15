'use client'
import React from 'react';

import styles from './conversationFlow.module.scss';

const ConversationFlow = () => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('values= ', e);
  };

  return (
    <div className={styles.container}>
      <div className={styles.dialogContainer}>
        <div className={`${styles.bubbleLeft} ${styles.bubble}`}>
          <p>Hola</p>
        </div>

        <div className={`${styles.bubbleRight} ${styles.bubble}`}>
          <p>Holaaa</p>
        </div>
      </div>

      <div>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <textarea
            name="message"
            rows={3}
            className={styles.messageInput}
          ></textarea>
          <button className={styles.messageButton} type="submit">
            {'>'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationFlow;
