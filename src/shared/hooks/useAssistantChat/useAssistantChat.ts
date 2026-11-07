import { useEffect, useRef, useState } from 'react';
import { supabase, useAuthStore } from '@store/useAuthStore';
import { createAssistantSocket } from '@utils/api/assistantSocket';
import {
  ConversationProviders,
  IUserConversation,
  RoleTypes,
} from '../../../app/(header)/conversations/components/ConversationFlow/interfaces/conversation.interfaces';

export interface AssistantMessage extends IUserConversation {
  receivedAt: Date;
}

const requestError = 'No se pudo confirmar el resultado. Revisá tus datos antes de repetir el pedido.';

export default function useAssistantChat() {
  const authenticated = useAuthStore((state) => Boolean(state.auth?.token));
  const [hydrated, setHydrated] = useState(false);
  const [identity, setIdentity] = useState<string | null>(null);
  const identityRef = useRef<string | null>(null);
  const socketRef = useRef<ReturnType<typeof createAssistantSocket> | null>(null);
  const generation = useRef(0);
  const request = useRef(0);
  const joined = useRef(false);
  const busyRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<AssistantMessage[]>([]);
  const [botStatus, setBotStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useAuthStore.persist.hasHydrated());
    return unsubscribe;
  }, []);

  useEffect(() => {
    let active = true;
    let authRevision = 0;
    const updateIdentity = (nextIdentity: string | null) => {
      if (!active || identityRef.current === nextIdentity) return;
      // Invalidate work immediately, before React runs the previous account's cleanup.
      generation.current += 1;
      identityRef.current = nextIdentity;
      joined.current = false;
      busyRef.current = false;
      const previousSocket = socketRef.current;
      socketRef.current = null;
      if (previousSocket?.connected) previousSocket.emit('leave_assistant_room');
      previousSocket?.disconnect();
      setIdentity(nextIdentity);
      setReady(false);
      setBusy(false);
      setMessage('');
      setConversation([]);
      setBotStatus(null);
      setError(null);
    };

    if (!hydrated || !authenticated) {
      updateIdentity(null);
      return () => { active = false; };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authRevision += 1;
      updateIdentity(session?.user.id ?? null);
    });
    const revision = authRevision;
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (active && revision === authRevision) {
        updateIdentity(sessionError ? null : data.session?.user.id ?? null);
      }
    }).catch(() => {
      if (active && revision === authRevision) updateIdentity(null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [hydrated, authenticated]);

  useEffect(() => {
    if (!identity) return;
    const socket = createAssistantSocket();
    socketRef.current = socket;
    let active = true;
    const isCurrent = () => active && identityRef.current === identity && socketRef.current === socket;
    const clearBusy = () => {
      busyRef.current = false;
      setBusy(false);
      setBotStatus(null);
    };
    const onDisconnect = () => {
      if (!isCurrent()) return;
      generation.current += 1;
      joined.current = false;
      setReady(false);
      clearBusy();
    };
    const onJoin = (response: { conversation: IUserConversation[] }) => {
      if (!isCurrent() || !socket.connected) return;
      joined.current = true;
      setReady(true);
      setError(null);
      setConversation((response.conversation ?? []).filter(Boolean).map((item) => ({
        ...item, receivedAt: new Date(),
      })));
    };
    const onProgress = (progress: string | { progress: string }) => {
      if (isCurrent() && joined.current) {
        setBotStatus(typeof progress === 'string' ? progress : progress.progress);
      }
    };
    const onMessage = (response: IUserConversation) => {
      if (!isCurrent() || !joined.current || !response) return;
      clearBusy();
      setConversation((previous) => [...previous, { ...response, receivedAt: new Date() }]);
    };
    const onError = () => {
      if (!isCurrent()) return;
      clearBusy();
      setError(requestError);
    };
    const join = async () => {
      const currentGeneration = ++generation.current;
      joined.current = false;
      setReady(false);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (!isCurrent() || currentGeneration !== generation.current || !socket.connected) return;
        if (sessionError || session?.user.id !== identity) {
          onError();
          return;
        }
        socket.emit('join_assistant_room', { accessToken: session.access_token });
      } catch {
        if (isCurrent() && currentGeneration === generation.current) onError();
      }
    };

    socket.on('join_assistant_response', onJoin);
    socket.on('receive_assistant_progress', onProgress);
    socket.on('receive_assistant_message', onMessage);
    socket.on('assistant_error', onError);
    socket.on('connect', join);
    socket.on('disconnect', onDisconnect);
    socket.connect();

    return () => {
      active = false;
      generation.current += 1;
      joined.current = false;
      socket.off('join_assistant_response', onJoin);
      socket.off('receive_assistant_progress', onProgress);
      socket.off('receive_assistant_message', onMessage);
      socket.off('assistant_error', onError);
      socket.off('connect', join);
      socket.off('disconnect', onDisconnect);
      if (socket.connected) socket.emit('leave_assistant_room');
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [identity]);

  const send = async (iaEnabled: boolean) => {
    const content = message.trim();
    const account = identityRef.current;
    const socket = socketRef.current;
    if (!content || !account || !joined.current || !socket?.connected || busyRef.current) return;
    const currentGeneration = generation.current;
    const currentRequest = ++request.current;
    const isCurrent = () => identityRef.current === account && generation.current === currentGeneration
      && request.current === currentRequest && socketRef.current === socket;
    busyRef.current = true;
    setBusy(true);
    setError(null);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!isCurrent()) return;
      if (sessionError || session?.user.id !== account || !socket.connected || !joined.current) {
        throw new Error('Session unavailable');
      }
      socket.emit('send_assistant_message', {
        accessToken: session.access_token,
        message: content,
        iaEnabled,
      }, (result: { ok: boolean; skipped?: boolean }) => {
        if (!isCurrent()) return;
        busyRef.current = false;
        setBusy(false);
        setBotStatus(null);
        if (!result?.ok) setError(requestError);
      });
      setConversation((previous) => [...previous, {
        role: RoleTypes.user,
        content,
        provider: ConversationProviders.WEB,
        receivedAt: new Date(),
      }]);
      setMessage('');
    } catch {
      if (!isCurrent()) return;
      busyRef.current = false;
      setBusy(false);
      setBotStatus(null);
      setError(requestError);
    }
  };

  return { message, setMessage, conversation, botStatus, busy, ready, error, send };
}
