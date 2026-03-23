import React from 'react';
import Link from 'next/link';

import styles from './header.module.scss';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { links } from './constants/navLink.constants';
import MyProfile from './components/MyProfile/MyProfile';
import AdminRoutes from './components/AdminRoutes/AdminRoutes';
import HamburgerMenu from './components/HamburgerMenu/HamburgerMenu';

const Header = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const userLogged = await supabase.auth.getUser();
  const username = userLogged?.data.user?.email?.split('@')[0] ?? '';

  const filteredLinks = links.filter(({ authenticated }) => !authenticated || username);

  return (
    <>
      <header className={styles.header}>
        <nav>
          <ul className={styles.navigation}>
            {filteredLinks.map(({ label, route }) => (
              <Link href={route} key={route}>
                <li>{label}</li>
              </Link>
            ))}

            <AdminRoutes />

            {!username && (
              <Link href={'/login'}>
                <li>{'Login'}</li>
              </Link>
            )}
          </ul>

          {username && <MyProfile username={username} />}
        </nav>
      </header>

      <HamburgerMenu links={filteredLinks} username={username} />
    </>
  );
};

export default Header;
