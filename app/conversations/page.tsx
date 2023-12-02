'use client';
import React, { useEffect, useState } from 'react';

import styles from './conversations.module.scss';
import ConversationFlow from './components/ConversationFlow/ConversationFlow';
import { io } from 'socket.io-client';
import { IUserConversation } from './components/ConversationFlow/interfaces/conversation.interfaces';

enum ConversatoionStates {
  DEFAULT = 'DEFAULT',
  WAITING = 'WAITING',
  IN_CHANNEL = 'IN_CHANNEL',
}

const username = 'user0';
const room = 'room_03';

const Conversations = () => {
  const [conversationState, setConversationState] = useState(
    ConversatoionStates.DEFAULT
  );

  const [socketInstance, setSocketInstance] = useState<any>();

  const [initialConversation, setInitialConversation] = useState<
    IUserConversation[]
  >([]);

  const joinRoom = () => {
    socketInstance?.emit('join_room', { username, room });
  };

  useEffect(() => {
    const socket = io('http://localhost:4000');

    setSocketInstance(socket);

    socket.on('connect', () => {
      setConversationState(ConversatoionStates.WAITING);
      console.log('idd', socket.id);
    });

    socket.on('connect_error', () => {
      console.log('CONNECT ERROR');
      setTimeout(() => socket.connect(), 5000);
    });

    socket.on('disconnect', () => console.log('socket disconnected'));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketInstance) {
      socketInstance.on(
        'join_response',
        (response: { conversation: IUserConversation[] }) => {
          if (response.conversation) {
            setConversationState(ConversatoionStates.IN_CHANNEL);
            setInitialConversation(response.conversation);
          }
        }
      );
    }
  }, [socketInstance]);

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Conversationsss</h4>

      {conversationState === ConversatoionStates.DEFAULT && (
        <h4>Conectando...</h4>
      )}

      {conversationState === ConversatoionStates.WAITING && (
        <div>
          <button onClick={() => joinRoom()}>Join Channel</button>
        </div>
      )}

      {conversationState === ConversatoionStates.IN_CHANNEL &&
        socketInstance && (
          <div>
            <h5>{`Canal: ${room}`}</h5>

            <ConversationFlow
              initialConversation={initialConversation}
              socket={socketInstance}
              username={username}
              room={room}
            />
          </div>
        )}
    </div>
  );
};

export default Conversations;
