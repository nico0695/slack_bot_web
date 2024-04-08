import apiConfig from '@config/apiConfig';
import { io } from 'socket.io-client';

export const socket = io(apiConfig.SOCKET_URL, {
  path: apiConfig.SOCKET_PATH,
  transports: ['websocket', 'polling'],
});
