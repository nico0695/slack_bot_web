import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

// Run the real hook with deterministic React effects and external service doubles.
// No DOM or additional test dependencies are needed for these lifecycle checks.
function setup({ hydrated = true } = {}) {
  const slots = [];
  const effects = [];
  let cursor = 0;
  let dirty = true;
  let result;
  let authListener;
  let hydrationListener;
  let session = { user: { id: 'account-a' }, access_token: 'token-a' };
  let getSession = async () => ({ data: { session }, error: null });
  const auth = { token: 'persisted-token' };
  const emitted = [];
  const sockets = [];
  function createAssistantSocket() {
    const listeners = new Map();
    const socket = {
      connected: false,
      listeners,
      on(event, listener) {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event).add(listener);
      },
      off(event, listener) { listeners.get(event)?.delete(listener); },
      emit(...args) { emitted.push(args); },
      fire(event, payload) {
        for (const listener of [...(listeners.get(event) ?? [])]) listener(payload);
      },
      connect() {
        assert.equal(listeners.get('join_assistant_response')?.size, 1);
        this.connected = true;
        this.fire('connect');
      },
      disconnect() {
        this.connected = false;
        this.fire('disconnect');
      },
    };
    sockets.push(socket);
    return socket;
  }
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], (next) => {
        const value = typeof next === 'function' ? next(slots[index]) : next;
        if (!Object.is(value, slots[index])) { slots[index] = value; dirty = true; }
      }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect(callback, dependencies) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || dependencies.some((value, i) => !Object.is(value, previous.dependencies[i]))) {
        effects.push(() => {
          previous?.cleanup?.();
          slots[index] = { dependencies, cleanup: callback() };
        });
      }
    },
  };
  const store = (selector) => selector({ auth });
  store.persist = {
    hasHydrated: () => hydrated,
    onFinishHydration: (listener) => {
      hydrationListener = listener;
      return () => { hydrationListener = undefined; };
    },
  };
  const supabase = { auth: {
    getSession: () => getSession(),
    onAuthStateChange(listener) {
      authListener = listener;
      return { data: { subscription: { unsubscribe() { authListener = undefined; } } } };
    },
  } };
  const compiledModule = { exports: {} };
  const source = ts.transpileModule(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)),
    '../src/shared/hooks/useAssistantChat/useAssistantChat.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, {
    exports: compiledModule.exports,
    require(name) {
      if (name === 'react') return react;
      if (name === '@store/useAuthStore') return { useAuthStore: store, supabase };
      if (name === '@utils/api/assistantSocket') return { createAssistantSocket };
      if (name.endsWith('conversation.interfaces')) {
        return { RoleTypes: { user: 'user' }, ConversationProviders: { WEB: 'web' } };
      }
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  function render() {
    while (dirty) {
      dirty = false;
      cursor = 0;
      result = compiledModule.exports.default();
      while (effects.length) effects.shift()();
    }
    return result;
  }
  async function settle() {
    for (let i = 0; i < 4; i++) { await Promise.resolve(); render(); }
    return result;
  }
  function fire(event, payload, socket = sockets.at(-1)) {
    socket.fire(event, payload);
    render();
  }
  function changeSession(next, event = 'SIGNED_IN') {
    session = next;
    authListener(event, session);
    render();
  }
  render();
  return {
    render, settle, fire, changeSession, emitted, sockets,
    get listeners() { return sockets.at(-1).listeners; },
    get socket() { return sockets.at(-1); },
    hydrate() { hydrated = true; hydrationListener(); render(); },
    setGetSession(callback) { getSession = callback; },
    unmount() { for (const slot of slots) slot?.cleanup?.(); },
  };
}

test('waits for hydration, joins with current credentials, and cleans up exact listeners', async () => {
  const app = setup({ hydrated: false });
  await app.settle();
  assert.equal(app.emitted.length, 0);
  app.hydrate();
  await app.settle();
  const join = app.emitted.find(([event]) => event === 'join_assistant_room');
  assert.equal(join[1].accessToken, 'token-a');
  assert.deepEqual(Object.keys(join[1]), ['accessToken']);
  assert.equal(app.listeners.get('join_assistant_response').size, 1);
  const otherListener = () => {};
  app.socket.on('receive_assistant_message', otherListener);
  app.unmount();
  assert.equal(app.listeners.get('receive_assistant_message').size, 1);
  assert.ok(app.listeners.get('receive_assistant_message').has(otherListener));
  assert.equal(app.emitted.at(-1)[0], 'leave_assistant_room');
  assert.equal(app.socket.connected, false);
});

test('refresh keeps history and sends a fresh token; progress and skipped ack clear busy', async () => {
  const app = setup();
  await app.settle();
  app.fire('join_assistant_response', { conversation: [{ content: 'history', role: 'user', provider: 'web' }] });
  app.changeSession({ user: { id: 'account-a' }, access_token: 'refreshed-token' }, 'TOKEN_REFRESHED');
  assert.equal(app.render().conversation[0].content, 'history');
  assert.equal(app.sockets.length, 1);
  app.render().setMessage('hello');
  const sending = app.render().send(true);
  assert.equal(app.render().busy, true);
  await sending;
  const send = app.emitted.find(([event]) => event === 'send_assistant_message');
  assert.equal(send[1].accessToken, 'refreshed-token');
  assert.equal(send[1].userId, undefined);
  app.fire('receive_assistant_progress', 'Working');
  assert.equal(app.render().botStatus, 'Working');
  app.fire('receive_assistant_progress', { progress: 'Finishing' });
  assert.equal(app.render().botStatus, 'Finishing');
  send[2]({ ok: true, skipped: true });
  assert.equal(app.render().busy, false);
  assert.equal(app.render().botStatus, null);
  app.unmount();
});

test('account changes cancel a pending send and discard old account callbacks', async () => {
  const app = setup();
  await app.settle();
  app.fire('join_assistant_response', { conversation: [] });
  let resolveSession;
  app.setGetSession(() => new Promise((resolve) => { resolveSession = resolve; }));
  const oldListener = [...app.listeners.get('receive_assistant_message')][0];
  app.render().setMessage('old private message');
  const sending = app.render().send(true);
  const finishOldSession = resolveSession;
  app.changeSession({ user: { id: 'account-b' }, access_token: 'token-b' });
  finishOldSession({ data: { session: { user: { id: 'account-a' }, access_token: 'old-token' } } });
  await sending;
  oldListener({ content: 'old private response' });
  assert.equal(app.render().conversation.length, 0);
  assert.equal(app.render().message, '');
  assert.equal(app.render().busy, false);
  assert.equal(app.emitted.filter(([event]) => event === 'send_assistant_message').length, 0);
  app.unmount();
});

test('disconnect clears busy and reconnect rejoins without retrying a mutation', async () => {
  const app = setup();
  await app.settle();
  app.fire('join_assistant_response', { conversation: [] });
  app.render().setMessage('hello');
  await app.render().send(true);
  app.socket.connected = false;
  app.fire('disconnect');
  assert.equal(app.render().busy, false);
  assert.equal(app.render().ready, false);
  app.socket.connected = true;
  app.fire('connect');
  await app.settle();
  assert.equal(app.emitted.filter(([event]) => event === 'join_assistant_room').length, 2);
  assert.equal(app.emitted.filter(([event]) => event === 'send_assistant_message').length, 1);
  assert.equal(app.listeners.get('receive_assistant_message').size, 1);
  app.fire('assistant_error', { message: 'private server details' });
  assert.equal(app.render().error,
    'No se pudo confirmar el resultado. Revisá tus datos antes de repetir el pedido.');
  app.unmount();
});

test('an earlier acknowledgement cannot unlock a newer request', async () => {
  const app = setup();
  await app.settle();
  app.fire('join_assistant_response', { conversation: [] });
  app.render().setMessage('first');
  await app.render().send(true);
  const firstAck = app.emitted.find(([event]) => event === 'send_assistant_message')[2];
  app.fire('receive_assistant_message', { content: 'first response', role: 'assistant', provider: 'web' });
  app.render().setMessage('second');
  await app.render().send(true);
  firstAck({ ok: true });
  assert.equal(app.render().busy, true);
  app.changeSession(null, 'SIGNED_OUT');
  assert.equal(app.render().conversation.length, 0);
  assert.equal(app.render().message, '');
  assert.equal(app.render().busy, false);
  assert.equal(app.listeners.get('receive_assistant_message').size, 0);
  assert.equal(app.socket.connected, false);
  app.unmount();
});

test('a late initial session lookup cannot replace a newer auth event', async () => {
  const app = setup({ hydrated: false });
  let finishInitialLookup;
  app.setGetSession(() => new Promise((resolve) => { finishInitialLookup = resolve; }));
  app.hydrate();
  const finishOldSession = finishInitialLookup;
  app.setGetSession(async () => ({ data: { session: { user: { id: 'account-b' }, access_token: 'token-b' } } }));
  app.changeSession({ user: { id: 'account-b' }, access_token: 'token-b' });
  finishOldSession({ data: { session: { user: { id: 'account-a' }, access_token: 'token-a' } } });
  await app.settle();
  const joins = app.emitted.filter(([event]) => event === 'join_assistant_room');
  assert.equal(joins.length, 1);
  assert.equal(joins[0][1].accessToken, 'token-b');
  app.unmount();
});

test('buffered packets on a previous account transport cannot reach the new account', async () => {
  const app = setup();
  await app.settle();
  const oldSocket = app.socket;
  app.fire('join_assistant_response', { conversation: [{ content: 'private old history' }] });
  app.changeSession({ user: { id: 'account-b' }, access_token: 'token-b' });
  await app.settle();
  assert.equal(app.sockets.length, 2);
  assert.notEqual(app.socket, oldSocket);
  assert.equal(oldSocket.connected, false);

  // Deliver actual events through the old transport after new callbacks exist.
  app.fire('join_assistant_response', { conversation: [{ content: 'buffered old history' }] }, oldSocket);
  app.fire('receive_assistant_message', { content: 'buffered old response' }, oldSocket);
  app.fire('receive_assistant_progress', 'buffered old progress', oldSocket);
  app.fire('assistant_error', {}, oldSocket);
  assert.equal(app.render().ready, false);
  assert.equal(app.render().conversation.length, 0);
  assert.equal(app.render().botStatus, null);
  assert.equal(app.render().error, null);

  app.fire('join_assistant_response', { conversation: [{ content: 'new history' }] });
  assert.equal(app.render().ready, true);
  assert.equal(app.render().conversation[0].content, 'new history');
  app.fire('join_assistant_response', { conversation: [{ content: 'late old history' }] }, oldSocket);
  assert.equal(app.render().conversation[0].content, 'new history');
  app.unmount();
});
