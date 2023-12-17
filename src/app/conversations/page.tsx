'use client';
import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import styles from './conversations.module.scss';

import ConversationFlow from './components/ConversationFlow/ConversationFlow';
import ChannelList from './components/ChannelList/ChannelList';

import { useConversationsStore } from '../../store/useConversationsStore';

enum ConversatoionStates {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED',
}

const username = 'user0';

const Conversations = () => {
  const [conversationState, setConversationState] = useState(
    ConversatoionStates.DISCONNECTED
  );

  const [socketInstance, setSocketInstance] = useState<Socket>();

  const channelSelected = useConversationsStore(
    (state) => state.channelSelected
  );

  useEffect(() => {
    const socket = io('http://localhost:4000');

    setSocketInstance(socket);

    socket.on('connect', () => {
      setConversationState(ConversatoionStates.CONNECTED);
      console.log('socket id: ', socket.id);
    });

    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 5000);
    });

    socket.on('disconnect', () => console.log('socket disconnected'));

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = (channel: string) => {
    socketInstance?.emit('join_room', { username, channel });
  };

  useEffect(() => {
    if (
      channelSelected &&
      conversationState === ConversatoionStates.CONNECTED
    ) {
      joinRoom(channelSelected);
    }
  }, [channelSelected, conversationState]);

  return (
    <div>
      <h4 className={styles.title}>Conversaciones</h4>

      {conversationState === ConversatoionStates.DISCONNECTED && (
        <h4>Conectando...</h4>
      )}

      {conversationState === ConversatoionStates.CONNECTED && (
        <div className={styles.container}>
          <ChannelList />

          {channelSelected && socketInstance && (
            <ConversationFlow
              socket={socketInstance}
              username={username}
              channel={channelSelected}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Conversations;
