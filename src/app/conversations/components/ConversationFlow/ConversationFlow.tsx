'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

import styles from './conversationFlow.module.scss';
import {
  IUserConversation,
  RoleTypes,
} from './interfaces/conversation.interfaces';
import { useConversationsStore } from '../../../../store/useConversationsStore';

interface IConversationFlow {
  socket: Socket;

  username: string;
  channel: string;
}

const ConversationFlow = (props: IConversationFlow) => {
  const { socket, username, channel } = props;

  // State to store the current message
  const [message, setMessage] = useState('');

  const [conversation, setConversation] = useState<IUserConversation[]>([]);

  const { fetchChannels, setChannelSelected } = useConversationsStore();

  const conversationRef = useRef<HTMLDivElement>(null);

  // Create a socket connection
  useEffect(() => {
    socket.on(
      'join_response',
      (response: { conversation: IUserConversation[] }) => {
        if (response.conversation) {
          setConversation(response.conversation);
        }
      }
    );

    socket.on('receive_message', (data: IUserConversation) => {
      setConversation((prevConversation) => [...prevConversation, data]);
    });
  }, [socket]);

  // Scroll to the bottom of the conversation
  useEffect(() => {
    conversationRef?.current?.scrollTo({
      top: conversationRef?.current?.scrollHeight,
      behavior: 'smooth',
    });
  }, [conversationRef, conversation]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message !== '') {
      socket.emit('send_message', {
        username,
        channel,
        message,
      });
      setConversation((prevConversation) => [
        ...prevConversation,
        {
          role: RoleTypes.user,
          content: message,
        },
      ]);

      setMessage('');
    }
  };

  const handleCloseChannel = async () => {
    try {
      await fetch('http://localhost:4000/conversations/close-channel/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId: channel,
        }),
      });

      setChannelSelected();
      fetchChannels();
    } catch (error) {
      console.log('error= ', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.headerButton} onClick={handleCloseChannel}>
          Cerrar canal
        </button>
      </div>

      <div className={styles.dialogContainer} ref={conversationRef}>
        {conversation.map((data: IUserConversation, i: number) => (
          <div
            key={i}
            className={`${
              data.role === RoleTypes.user
                ? styles.bubbleRight
                : styles.bubbleLeft
            } ${styles.bubble}`}
          >
            <p>{data.content}</p>
          </div>
        ))}
      </div>

      <div>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <textarea
            name="message"
            rows={3}
            className={styles.messageInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            className={styles.messageButton}
            type="submit"
            disabled={!socket}
          >
            {'>'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationFlow;
