import React from 'react';
import Link from 'next/link';

import styles from './header.module.scss';

import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

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
  {
    label: 'Users',
    route: '/admin/users',
  },
];

const Header = async () => {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const userLogged = await supabase.auth.getUser();
  const username = userLogged?.data.user?.email?.split('@')[0] ?? '';

  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navigation}>
          {links.map(({ label, route }) => (
            <Link href={route} key={route}>
              <li className={styles.navItems}>{label}</li>
            </Link>
          ))}
        </ul>
      </nav>

      {username && <div className={styles.navItems}>{username}</div>}
    </header>
  );
};

export default Header;
