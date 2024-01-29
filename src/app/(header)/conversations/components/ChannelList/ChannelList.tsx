'use client';
import React, { useEffect, useState } from 'react';

import styles from './channelList.module.scss';
import { useConversationsStore } from '../../../../../store/useConversationsStore';
import PrimaryButton from '../../../../../components/Buttons/PrimaryButton/PrimaryButton';
import Dialog from '../../../../../components/Dialog/Dialog';

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

      <PrimaryButton
        label="Nuevo"
        onClick={() => setNewChannelIsOpen(true)}
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />

      <Dialog
        title="Nuevo canal"
        isOpen={newChannelIsOpen}
        hideModal={() => setNewChannelIsOpen(false)}
      >
        <div>
          <form onSubmit={handleCreateChannel}>
            <div className={styles.labeledValue}>
              <label htmlFor="phrase">Nobre del canal</label>
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
            </div>

            <div className={styles.buttonContainer}>
              <PrimaryButton label={'Guardar'} type="submit" />
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default ChannelList;
