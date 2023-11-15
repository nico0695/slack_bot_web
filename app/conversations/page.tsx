import React from 'react';
import { motion } from 'framer-motion';

import styles from './conversations.module.scss';
import ConversationFlow from './components/ConversationFlow/ConversationFlow';

const Conversations = () => {
  return (
    // <ContConversations className="text-3xl font-bold underline">
    <div className={styles.container}>
      <h4 className={styles.title}>Conversationsss</h4>

      <ConversationFlow />
      
    </div>
    // </ContConversations>
  );
};

export default Conversations;
