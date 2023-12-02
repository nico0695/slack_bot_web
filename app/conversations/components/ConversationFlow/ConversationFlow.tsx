'use client';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import styles from './conversationFlow.module.scss';
import {
  IUserConversation,
  RoleTypes,
} from './interfaces/conversation.interfaces';

interface IConversationFlow {
  initialConversation?: IUserConversation[];
  socket?: any;

  username: string;
  room: string;
}

const ConversationFlow = (props: IConversationFlow) => {
  const { initialConversation, socket, username, room } = props;

  // State to store the current message
  const [message, setMessage] = useState('');

  const [conversation, setConversation] = useState<any[]>(
    initialConversation ?? []
  );

  // Create a socket connection

  useEffect(() => {
    if (socket) {
      console.log('--- useEffect ---')
      socket.on('receive_message', (data: any) => {
        console.log('receive_message= ', data);

        setConversation((prevConversation) => [...prevConversation, data]);
      });
    }
  }, [socket]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (message !== '') {
      socket.emit('send_message', {
        username,
        room,
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

  return (
    <div className={styles.container}>
      <div className={styles.dialogContainer}>
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
