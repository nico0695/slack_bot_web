'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';

import styles from './myAssistant.module.scss';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import { socket } from '@utils/api/socket';
import { useAuthStore } from '@store/useAuthStore';
import {
  ConversationProviders,
  IUserConversation,
  RoleTypes,
} from '../conversations/components/ConversationFlow/interfaces/conversation.interfaces';
import Loading from './loading';

const MyAssistant = () => {
  const [message, setMessage] = useState('');

  const [conversation, setConversation] = useState<IUserConversation[]>([]);

  const conversationRef = useRef<HTMLDivElement>(null);

  const { username, data: userData } = useAuthStore();

  const joinChat = () => {
    socket?.emit('join_assistant_room', {
      username,
      channel: userData?.id ?? username,
    });
  };

  useEffect(() => {
    joinChat();

    socket.on(
      'join_assistant_response',
      (response: { conversation: IUserConversation[] }) => {
        if (response.conversation) {
          setConversation(
            response.conversation.filter((conv) => conv !== null)
          );
        }
      }
    );

    socket.on('receive_assistant_message', (data: IUserConversation) => {
      if (data) {
        setConversation((prevConversation) => [...prevConversation, data]);
      }
    });

    return () => {
      socket.off('join_assistant_room');
      socket.off('join_assistant_response');
      socket.off('receive_assistant_message');

      socket.emit('leave_assistant_room', {
        channel: userData?.id ?? username,
      });
    };
  }, []);

  // Scroll to the end of the conversation
  useEffect(() => {
    conversationRef?.current?.scrollTo({
      top: conversationRef?.current?.scrollHeight,
      behavior: 'smooth',
    });
  }, [conversationRef, conversation]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message !== '') {
      socket.emit('send_assistant_message', {
        userId: userData?.id,
        message: message,
        iaEnabled: false,
      });

      setConversation((prevConversation) => [
        ...prevConversation,
        {
          userId: userData?.id,
          role: RoleTypes.user,
          content: message,
          provider: ConversationProviders.WEB,
        },
      ]);

      setMessage('');
    }
  };

  return (
    <div>
      <Suspense fallback={<Loading />} />

      <h4>My Assistant</h4>

      <div className={styles.container}>
        <div className={styles.dialogContainer} ref={conversationRef}>
          {conversation.map((data: IUserConversation, i: number) => (
            <div
              key={i}
              className={`${styles.bubble} ${
                data?.role === RoleTypes.user
                  ? styles.bubbleRight
                  : styles.bubbleLeft
              }`}
            >
              <h6 className={styles.bubbleUser}>
                {data.role !== RoleTypes.user ? 'Bot' : username}

                {data.provider === 'slack' && <small>(Slack)</small>}
              </h6>
              <p className={styles.bubbleMessage}>{data.content}</p>
            </div>
          ))}
        </div>

        <div>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.messageInput}
              autoFocus
            />
            <PrimaryButton label=">" type="submit" disabled={!socket} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyAssistant;
