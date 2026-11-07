import apiConfig from '@config/apiConfig';
import { io } from 'socket.io-client';

// Each account owns its transport, so already-delivered packets from a previous
// account cannot be dispatched to a new account's assistant listeners.
export const createAssistantSocket = () => io(apiConfig.SOCKET_URL, {
  path: apiConfig.SOCKET_PATH,
  transports: ['websocket', 'polling'],
  forceNew: true,
  autoConnect: false,
});
