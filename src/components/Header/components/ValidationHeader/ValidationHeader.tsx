'use client';

import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { useAuthStore } from '../../../../store/useAuthStore';
import useNotificationsAlert from '@hooks/useNotificationsAlerts/useNotificationsAlerts';

const ValidationHeader = () => {
  const { validateSupabaseAuth } = useAuthStore();

  useNotificationsAlert();

  useEffect(() => {
    validateSupabaseAuth();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default ValidationHeader;
