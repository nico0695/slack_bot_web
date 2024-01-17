'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

import apiConfig from '../../../config/apiConfig';

import styles from './conversationFlow.module.scss';
import {
  IUserConversation,
  RoleTypes,
} from './interfaces/conversation.interfaces';
import { useConversationsStore } from '../../../../store/useConversationsStore';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton/PrimaryButton';

interface IConversationFlow {
  socket: Socket;

  username: string;
  channel: string;
}

const ConversationFlow = (props: IConversationFlow) => {
  const { socket, username, channel } = props;

  // State to store the current message
  const [message, setMessage] = useState('');

  const [iaEnabled, setIaEnabled] = useState(false);

  const [conversation, setConversation] = useState<IUserConversation[]>([]);

  const { fetchChannels, setChannelSelected } = useConversationsStore();

  const conversationRef = useRef<HTMLDivElement>(null);

  // Create a socket connection
  useEffect(() => {
    socket.on(
      'join_response',
      (response: { conversation: IUserConversation[] }) => {
        if (response.conversation) {
          setConversation(
            response.conversation.filter((conv) => conv !== null)
          );
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
        iaEnabled,
      });
      setConversation((prevConversation) => [
        ...prevConversation,
        {
          userSlackId: username,
          role: RoleTypes.user,
          content: message,
        },
      ]);

      setMessage('');
    }
  };

  const handleCloseChannel = async () => {
    try {
      await fetch(`${apiConfig.BASE_URL}/conversations/close-channel/`, {
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

  console.log('data= ', conversation);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>{`usuario: ${username}`}</div>
        <div
          className={styles.checkContainer}
          onClick={() => setIaEnabled((prev) => !prev)}
        >
          <label htmlFor="iaEnabled">Activar ia</label>
          <input name="iaEnabled" type="checkbox" checked={iaEnabled} />
        </div>
        <button className={styles.headerButton} onClick={handleCloseChannel}>
          Cerrar canal
        </button>
      </div>

      <div className={styles.dialogContainer} ref={conversationRef}>
        {conversation.map((data: IUserConversation, i: number) => (
          <div
            key={i}
            className={`${styles.bubble} ${
              data?.role === RoleTypes.user && data.userSlackId === username
                ? styles.bubbleRight
                : styles.bubbleLeft
            }`}
          >
            <h6 className={styles.bubbleUser}>
              {data.role === RoleTypes.assistant ? 'Bot' : data.userSlackId}
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
          />
          <PrimaryButton label=">" type="submit" disabled={!socket} />
        </form>
      </div>
    </div>
  );
};

export default ConversationFlow;
