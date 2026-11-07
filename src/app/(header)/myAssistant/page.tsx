'use client';
import React, { Suspense, useState } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaRocketchat, FaCopy } from 'react-icons/fa';

import styles from './myAssistant.module.scss';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import { useAuthStore } from '@store/useAuthStore';
import { RoleTypes } from '../conversations/components/ConversationFlow/interfaces/conversation.interfaces';
import useAssistantChat, { AssistantMessage } from '@hooks/useAssistantChat/useAssistantChat';
import Loading from './loading';

import useScrollChat from '@hooks/useScrollChat/useScrollChat';

const MyAssistant = () => {
  const { message, setMessage, conversation, botStatus, busy, ready, error, send } = useAssistantChat();
  const [iaEnabled, setIaEnabled] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [conversationRef] = useScrollChat(conversation);
  const username = useAuthStore((state) => state.username);

  const handleSend = () => { void send(iaEnabled); };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(() => {});
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

          {conversation.map((data: AssistantMessage, i: number) => (
            <div
              key={i}
              className={`${styles.bubble} ${
                data?.role === RoleTypes.user
                  ? styles.bubbleRight
                  : styles.bubbleLeft
              }`}
            >
              <div className={styles.bubbleHeader}>
                <h6 className={styles.bubbleUser}>
                  {data.role !== RoleTypes.user ? 'Bot' : username}

                  {data.provider === 'slack' && <small>(Slack)</small>}
                </h6>
                <span className={styles.bubbleTimestamp}>
                  {data.receivedAt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

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

              {data.role !== RoleTypes.user && (
                <button
                  className={`${styles.copyButton}${copiedIndex === i ? ` ${styles.copyButtonActive}` : ''}`}
                  onClick={() => handleCopy(data.content, i)}
                  title="Copiar mensaje"
                >
                  {copiedIndex === i ? '¡Copiado!' : <FaCopy size={12} />}
                </button>
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
          {error && <p role="alert">{error}</p>}
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.messageInput}
              placeholder="Escribí un mensaje... (Shift+Enter para nueva línea)"
              autoFocus
              rows={3}
              disabled={!ready || busy}
            />
            <PrimaryButton label=">" type="submit" disabled={!ready || busy || !message.trim()} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyAssistant;
