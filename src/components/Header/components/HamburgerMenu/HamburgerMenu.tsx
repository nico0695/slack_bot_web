'use client';
import React from 'react';
import Link from 'next/link';

import { useToggle } from '@hooks/useToggle/useToggle';
import { useAuthStore } from '@store/useAuthStore';
import useStoreHydration from '@hooks/useStoreHydration/useStoreHydration';
import { adminLinks } from '@components/Header/constants/navLink.constants';
import { Profiles } from '@constants/users.constants';
import MyProfile from '@components/Header/components/MyProfile/MyProfile';

import styles from './hamburgerMenu.module.scss';

interface IHamburgerMenu {
  links: { label: string; route: string }[];
  username: string;
}

const HamburgerMenu = ({ links, username }: IHamburgerMenu) => {
  const [isOpen, toggleMenu, , closeMenu] = useToggle();
  const userData = useStoreHydration(useAuthStore, (state) => state.data);
  const isAdmin = userData?.profile === Profiles.ADMIN;

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.logoSlot} />
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Menú">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {isOpen && (
        <ul className={styles.menu}>
          {links.map(({ label, route }) => (
            <Link href={route} key={route} onClick={closeMenu}>
              <li>{label}</li>
            </Link>
          ))}

          {isAdmin &&
            adminLinks.map(({ label, route }) => (
              <Link href={route} key={route} onClick={closeMenu}>
                <li>{label}</li>
              </Link>
            ))}

          {!username && (
            <Link href="/login" onClick={closeMenu}>
              <li>Login</li>
            </Link>
          )}

          {username && (
            <li className={styles.profileItem}>
              <MyProfile username={username} />
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default HamburgerMenu;
