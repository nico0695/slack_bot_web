'use client';

import Link from 'next/link';
import styles from './myAssistantLayout.module.scss';
import {
  FaRegStickyNote,
  FaRegClock,
  FaRocketchat,
  FaTasks,
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function MyAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  return (
    <div className={styles.myAssistantWrapper}>
      <div className={styles.assistantMenu}>
        <span className={styles.menuItem} data-tooltip="Copilot">
          <Link
            href={'/myAssistant'}
            className={pathName === '/myAssistant' ? 'active' : ''}
          >
            <FaRocketchat size={24} />
          </Link>
        </span>

        <span className={styles.menuItem} data-tooltip="Alertas">
          <Link
            href={'/myAssistant/alerts'}
            className={pathName === '/myAssistant/alerts' ? 'active' : ''}
          >
            <FaRegClock size={24} />
          </Link>
        </span>

        <span className={styles.menuItem} data-tooltip="Notas">
          <Link
            href={'/myAssistant/notes'}
            className={pathName === '/myAssistant/notes' ? 'active' : ''}
          >
            <FaRegStickyNote size={24} />
          </Link>
        </span>

        <span className={styles.menuItem} data-tooltip="Tareas">
          <Link
            href={'/myAssistant/tasks'}
            className={pathName === '/myAssistant/tasks' ? 'active' : ''}
          >
            <FaTasks size={24} />
          </Link>
        </span>
      </div>
      <div className={styles.assistantContainer}>{children}</div>
    </div>
  );
}
