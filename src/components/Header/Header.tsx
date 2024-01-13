'use client';

import React from 'react';
import Link from 'next/link';

import 'react-toastify/dist/ReactToastify.css';

import styles from './header.module.scss';
import { ToastContainer } from 'react-toastify';
import { useAuthStore } from '../../store/useAuthStore';

const links = [
  {
    label: 'Home',
    route: '/',
  },
  // {
  //   label: 'Constants',
  //   route: '/globalConstants',
  // },
  {
    label: 'Conversaciones',
    route: '/conversations',
  },
  {
    label: 'Imagenes',
    route: '/images/1',
  },
  {
    label: 'Generar Audio',
    route: '/textToSpeech',
  },
];

const Header = () => {
  const { username } = useAuthStore();

  return (
    <header className={styles.header}>
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

      <nav>
        <ul className={styles.navigation}>
          {links.map(({ label, route }) => (
            <li className={styles.navItems} key={route}>
              <Link href={route}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.navItems}>{username}</div>
    </header>
  );
};

export default Header;
