import Link from 'next/link';
import styles from './myAssistantLayout.module.scss';
import { FaRocketchat, FaTasks } from 'react-icons/fa';

export default function MyAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.myAssistantWrapper}>
      <div className={styles.assistantMenu}>
        <Link href={'/myAssistant'}>
          <FaRocketchat size={24} />
        </Link>
        <Link href={'/myAssistant/tasks'}>
          <FaTasks size={24} />
        </Link>
      </div>
      <div className={styles.assistantContainer}>{children}</div>
    </div>
  );
}
