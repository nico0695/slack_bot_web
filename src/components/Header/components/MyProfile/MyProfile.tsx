'use client';
import React from 'react';

import Dialog from '@components/Dialog/Dialog';

import styles from './myProfile.module.scss';

import { useToggle } from '@hooks/useToggle/useToggle';
import { useAuthStore } from '@store/useAuthStore';

import LabeledInput from '@components/LabeledInputs/LabeledInput';

const MyProfile = ({ username }: { username: string }) => {
  const [isOpen, , showDialog, hideDialog] = useToggle();

  const { data } = useAuthStore();

  return (
    <>
      <div className={styles.profileButton} onClick={showDialog}>
        {username}
      </div>

      <Dialog title="Mi perfil" isOpen={isOpen} hideModal={hideDialog}>
        {data && (
          <div className={styles.profileContainer}>
            <LabeledInput
              label="Nombre"
              type="text"
              name="name"
              value={data?.name}
              disabled
              light
            />

            <LabeledInput
              label="Apellido"
              type="text"
              name="lastName"
              value={data?.lastName}
              disabled
              light
            />

            <LabeledInput
              label="Username"
              type="text"
              name="username"
              value={data?.username}
              disabled
              light
            />

            <LabeledInput
              label="Email"
              type="email"
              name="email"
              value={data?.email}
              disabled
              light
            />

            <LabeledInput
              label="Teléfono"
              type="text"
              name="phone"
              value={data?.phone}
              disabled
              light
            />

            <LabeledInput
              label="Perfil"
              type="text"
              name="profile"
              value={data?.profile}
              disabled
              light
            />
          </div>
        )}
      </Dialog>
    </>
  );
};

export default MyProfile;
