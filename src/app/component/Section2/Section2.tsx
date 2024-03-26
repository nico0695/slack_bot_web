'use client';
import React, { useEffect, useState } from 'react';

import useInView from '@hooks/useInView/useInView';

import fatherStyles from '../../home.module.scss';
import chatStyles from '@styles/chat.module.scss';
import styles from './section2.module.scss';

import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import { FaArrowDown } from 'react-icons/fa';

const conversationExample = [
  'Hola! ¿En qué puedo ayudarte?',
  'Cual es la capital de Burkina Faso?',
  'La capital de Burkina Faso es Uagadugú. También se escribe como Ouagadougou.',
];

const Section2 = () => {
  const [message, setMessage] = useState('');

  const { ref: sectionRef, isVisible } = useInView();

  let interval: NodeJS.Timeout;

  const handleSendMessage = () => {
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const handleIntervalMessage = () => {
    interval = setInterval(() => {
      setMessage((prevMessage) => {
        const nextChar = conversationExample[1].charAt(
          prevMessage?.length ?? 0
        );
        const newMessage = (prevMessage ?? '') + nextChar;

        if (newMessage.length === conversationExample[1].length) {
          clearInterval(interval);
        }

        return newMessage;
      });
    }, 120);
  };

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        handleIntervalMessage();
        handleSendMessage();
      }, 3100);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isVisible]);

  return (
    <div ref={sectionRef} className={styles.section2}>
      <h2 className={`${isVisible ? 'animation' : ''}`}>Section 2</h2>

      <div
        className={`${styles.chatContainer} ${isVisible ? 'animation' : ''}`}
      >
        <div className={`${chatStyles.dialogContainer} `}>
          {isVisible && (
            <>
              <div
                className={`${chatStyles.bubble} ${chatStyles.bubbleLeft} ${styles.bubbleFirstAnimation}`}
              >
                <h6 className={chatStyles.bubbleUser}>{'Bot'}</h6>
                <p className={chatStyles.bubbleMessage}>
                  {conversationExample[0]}
                </p>
              </div>

              <div
                className={`${chatStyles.bubble} ${chatStyles.bubbleRight} ${styles.bubbleSecondAnimation}`}
              >
                <h6 className={chatStyles.bubbleUser}>{'Yoda'}</h6>
                <p className={chatStyles.bubbleMessage}>
                  {conversationExample[1]}
                </p>
              </div>

              <div
                className={`${chatStyles.bubble} ${chatStyles.bubbleLeft} ${styles.bubbleThirdAnimation}`}
              >
                <h6 className={chatStyles.bubbleUser}>{'Bot'}</h6>
                <p className={chatStyles.bubbleMessage}>
                  {conversationExample[2]}
                </p>
              </div>
            </>
          )}
        </div>
        <div className={chatStyles.formContainer}>
          <input
            type="text"
            value={message ?? ''}
            className={chatStyles.messageInput}
          />
          <PrimaryButton
            label=">"
            type="submit"
            className={styles.buttonAnimation}
          />
        </div>
      </div>
      {/* scroll button */}
      <a href="#separator" className={fatherStyles.navigateButton}>
        <FaArrowDown size={24} />
      </a>
    </div>
  );
};

export default Section2;
