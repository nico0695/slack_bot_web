'use client';
import React, { Suspense, useEffect, useState } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaRocketchat } from 'react-icons/fa';

import styles from './myAssistant.module.scss';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import { socket } from '@utils/api/socket';
import { useAuthStore } from '@store/useAuthStore';
import {
  ConversationProviders,
  IUserConversation,
  RoleTypes,
} from '../conversations/components/ConversationFlow/interfaces/conversation.interfaces';
import Loading from './loading';
import useScrollChat from '@hooks/useScrollChat/useScrollChat';

const MyAssistant = () => {
  const [message, setMessage] = useState('');

  const [conversation, setConversation] = useState<IUserConversation[]>([]);

  const [iaEnabled, setIaEnabled] = useState(false);

  const [botStatus, setBotStatus] = useState<string | null>(null);

  const [conversationRef] = useScrollChat(conversation);

  const { username, data: userData } = useAuthStore();

  const joinChat = () => {
    socket?.emit('join_assistant_room', {
      username,
      channel: userData?.id ?? username,
    });
  };

  useEffect(() => {
    joinChat();

    socket.on(
      'join_assistant_response',
      (response: { conversation: IUserConversation[] }) => {
        if (response.conversation) {
          setConversation(
            response.conversation.filter((conv) => conv !== null)
          );
        }
      }
    );

    socket.on('receive_assistant_progress', ({ progress }: { progress: string }) => {
      setBotStatus(progress);
    });

    socket.on('receive_assistant_message', (data: IUserConversation) => {
      if (data) {
        setBotStatus(null);
        setConversation((prevConversation) => [...prevConversation, data]);
      }
    });

    return () => {
      socket.off('join_assistant_room');
      socket.off('join_assistant_response');
      socket.off('receive_assistant_progress');
      socket.off('receive_assistant_message');

      socket.emit('leave_assistant_room', {
        channel: userData?.id ?? username,
      });
    };
  }, []);

  const handleSend = () => {
    if (message.trim() !== '' && !botStatus) {
      socket.emit('send_assistant_message', {
        userId: userData?.id,
        message: message.trim(),
        iaEnabled,
      });

      setConversation((prevConversation) => [
        ...prevConversation,
        {
          userId: userData?.id,
          role: RoleTypes.user,
          content: message.trim(),
          provider: ConversationProviders.WEB,
        },
      ]);

      setMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <Suspense fallback={<Loading />} />

      <h4>Copilot</h4>

      <div className={styles.header}>
        <div className={styles.checkContainer}>
          <label htmlFor="iaEnabled">Activar ia</label>
          <input
            name="iaEnabled"
            type="checkbox"
            checked={iaEnabled}
            onChange={() => setIaEnabled((prev) => !prev)}
          />
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.dialogContainer} ref={conversationRef}>
          {conversation.length === 0 && !botStatus && (
            <div className={styles.emptyChat}>
              <FaRocketchat size={40} className={styles.emptyChatIcon} />
              <h5>¡Hola, {username}!</h5>
              <p>Soy tu asistente. Podés pedirme cosas como:</p>
              <ul>
                <li>💡 &quot;Avisame mañana a las 9 sobre la reunión&quot;</li>
                <li>📝 &quot;Agregar una nota sobre el proyecto X&quot;</li>
                <li>✅ &quot;Crear tarea: revisar el deploy&quot;</li>
                <li>🌐 &quot;Traducir al inglés: ...&quot;</li>
                <li>📄 &quot;Resumir este texto: ...&quot;</li>
              </ul>
              <small>Activá IA para respuestas inteligentes.</small>
            </div>
          )}

          {conversation.map((data: IUserConversation, i: number) => (
            <div
              key={i}
              className={`${styles.bubble} ${
                data?.role === RoleTypes.user
                  ? styles.bubbleRight
                  : styles.bubbleLeft
              }`}
            >
              <h6 className={styles.bubbleUser}>
                {data.role !== RoleTypes.user ? 'Bot' : username}

                {data.provider === 'slack' && <small>(Slack)</small>}
              </h6>

              {data.role !== RoleTypes.user && (
                <ReactMarkdown
                  className="markdownStyle"
                  remarkPlugins={[remarkGfm]}
                >
                  {data.content?.replace(/\n/g, '  \n')}
                </ReactMarkdown>
              )}

              {data.role === RoleTypes.user && (
                <p className={styles.bubbleMessage}>{data.content}</p>
              )}
            </div>
          ))}

          {botStatus && (
            <div className={`${styles.bubble} ${styles.bubbleLeft} ${styles.typingBubble}`}>
              <h6 className={styles.bubbleUser}>Bot</h6>
              <div className={styles.typingIndicator}>
                <span /><span /><span />
              </div>
              <p className={styles.typingStatus}>{botStatus}</p>
            </div>
          )}
        </div>

        <div>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.messageInput}
              placeholder="Escribí un mensaje... (Shift+Enter para nueva línea)"
              autoFocus
              rows={3}
              disabled={!!botStatus}
            />
            <PrimaryButton label=">" type="submit" disabled={!socket || !!botStatus} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyAssistant;
