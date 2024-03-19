'use client';
import React, { useEffect, useState } from 'react';

import { socket } from '@utils/api/socket';

import styles from './conversations.module.scss';

import ConversationFlow from './components/ConversationFlow/ConversationFlow';
import ChannelList from './components/ChannelList/ChannelList';

import { useConversationsStore } from '../../../store/useConversationsStore';
import { useAuthStore } from '../../../store/useAuthStore';
import UserLogin from './components/UserLogin/UserLogin';

enum ConversatoionStates {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

const Conversations = () => {
  const { username } = useAuthStore();

  const [conversationState, setConversationState] = useState(
    username ? ConversatoionStates.CONNECTING : ConversatoionStates.DISCONNECTED
  );

  const channelSelected = useConversationsStore(
    (state) => state.channelSelected
  );

  useEffect(() => {
    if (username) {
      if (socket.connected) {
        setConversationState(ConversatoionStates.CONNECTED);
      } else {
        socket.on('connect', () => {
          setConversationState(ConversatoionStates.CONNECTED);
          console.log('socket id: ', socket.id);
        });

        socket.on('connect_error', () => {
          setConversationState(ConversatoionStates.ERROR);
        });

        socket.on('disconnect', () => console.log('socket disconnected'));
      }
    }

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, [username]);

  const joinRoom = (channel: string) => {
    socket?.emit('join_room', { username, channel });
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

      {conversationState === ConversatoionStates.DISCONNECTED && <UserLogin />}

      {conversationState === ConversatoionStates.ERROR && (
        <h4>Hubo un error al conectar</h4>
      )}

      {conversationState === ConversatoionStates.CONNECTING && (
        <h4>Conectando...</h4>
      )}

      {conversationState === ConversatoionStates.CONNECTED && username && (
        <div className={styles.container}>
          <ChannelList />

          {channelSelected && (
            <ConversationFlow username={username} channel={channelSelected} />
          )}
        </div>
      )}
    </div>
  );
};

export default Conversations;
