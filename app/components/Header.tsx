import React from 'react'
import Link from 'next/link'

import styles from './Header.module.css'

const links = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'Constants',
    route: '/globalConstants',
  },
  {
    label: 'Post',
    route: '/post',
  },
  {
    label: 'Conversations',
    route: '/conversations',
  },
]

const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navigation}>
          {links.map(({ label, route }) => (
            <li key={route}>
              <Link href={route}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
