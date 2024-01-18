import React from 'react';
import Link from 'next/link';

import styles from './header.module.scss';

import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import ValidationHeader from './components/ValidationHeader/ValidationHeader';

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

const Header = async () => {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const userLogged = await supabase.auth.getUser();
  const username = userLogged?.data.user?.email?.split('@')[0] ?? '';

  return (
    <header className={styles.header}>
      <ValidationHeader />
      <nav>
        <ul className={styles.navigation}>
          {links.map(({ label, route }) => (
            <li className={styles.navItems} key={route}>
              <Link href={route}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {username && <div className={styles.navItems}>{username}</div>}
    </header>
  );
};

export default Header;
