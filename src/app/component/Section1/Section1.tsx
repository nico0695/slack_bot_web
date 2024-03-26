'use client';
import React from 'react';

import useInView from '@hooks/useInView/useInView';

import chatStyles from '@styles/chat.module.scss';
import styles from './section1.module.scss';

const Section1 = () => {
  const { ref: sectionRef, isVisible } = useInView();

  return (
    <div ref={sectionRef} className={styles.section1}>
      <div className={`${styles.leftSide} ${isVisible ? 'animation' : ''}`}>
        <h2>Section 1</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </div>

      <div className={`${styles.rightSide} ${isVisible ? 'animation' : ''}`}>
        <div className={chatStyles.dialogContainer}>
          {isVisible && (
            <>
              <div
                className={`${chatStyles.bubble} ${chatStyles.bubbleLeft} ${styles.bubbleFirstAnimation}`}
              >
                <h6 className={chatStyles.bubbleUser}>{'Bot'}</h6>
                <p className={chatStyles.bubbleMessage}>
                  {'Hola! ¿En qué puedo ayudarte?'}
                </p>
              </div>

              <div
                className={`${chatStyles.bubble} ${chatStyles.bubbleRight} ${styles.bubbleSecondAnimation}`}
              >
                <h6 className={chatStyles.bubbleUser}>{'Yoda'}</h6>
                <p className={chatStyles.bubbleMessage}>
                  {'Hola, cómo estás?'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Section1;
