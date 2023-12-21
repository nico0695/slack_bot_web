'use client';
import React, { useEffect, useState } from 'react';

import styles from './channelList.module.scss';
import { useConversationsStore } from '../../../../store/useConversationsStore';

const ChannelList = () => {
  const [newChannelIsOpen, setNewChannelIsOpen] = useState(false);

  const {
    channels,
    channelSelected,
    fetchChannels,
    setChannelSelected,
    addChannel,
  } = useConversationsStore();

  useEffect(() => {
    const interval = setInterval(() => {
      fetchChannels();
    }, 10000);

    fetchChannels();

    return () => clearInterval(interval);
  }, []);

  const handleChannelClick = (channel: string) => {
    setChannelSelected(channel);
  };

  const handleCreateChannel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (e.currentTarget.channelName.value) {
      const newChannel = e.currentTarget.channelName.value
        .replace(/\./g, '')
        .trim();

      addChannel(newChannel);
      setNewChannelIsOpen(false);

      // reset
      e.currentTarget.channelName.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <h5 className={styles.listTitle}>Canales</h5>
      <ul className={styles.channelList}>
        {channels.map((channel) => {
          return (
            <li
              className={`${styles.channelItem} ${
                channelSelected === channel ? styles.active : ''
              }`}
              onClick={() => handleChannelClick(channel)}
              key={channel}
            >
              {channel}
            </li>
          );
        })}
      </ul>

      <button
        className={styles.newButton}
        onClick={() => setNewChannelIsOpen(true)}
      >
        Nuevo
      </button>

      <dialog open={newChannelIsOpen}>
        <p>Ingrese el nombre del canal</p>
        <form onSubmit={handleCreateChannel}>
          <input
            name="channelName"
            type="text"
            placeholder="Canal..."
            autoFocus
            onKeyDown={(e) => {
              if (e.keyCode === 32) {
                e.preventDefault();
              }
            }}
          />
          <button type="submit">OK</button>
        </form>
      </dialog>
    </div>
  );
};

export default ChannelList;
