import React from 'react';
import Link from 'next/link';

import styles from './header.module.scss';

import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { links } from './constants/navLink.constants';
import MyProfile from './components/MyProfile/MyProfile';
import AdminRoutes from './components/AdminRoutes/AdminRoutes';

const Header = async () => {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const userLogged = await supabase.auth.getUser();
  const username = userLogged?.data.user?.email?.split('@')[0] ?? '';

  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navigation}>
          {links
            .filter(({ authenticated }) => !authenticated || username)
            .map(({ label, route }) => (
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

        {/* Mobile provitional menu */}
        <ul className={styles.navigationMobile}>
          <Link href={'/'}>
            <li>{'Home'}</li>
          </Link>

          <Link href={'/myAssistant'}>
            <li>{'Asistente'}</li>
          </Link>
        </ul>

        {username && <MyProfile username={username} />}
      </nav>
    </header>
  );
};

export default Header;
