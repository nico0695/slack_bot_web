import apiConfig from '@config/apiConfig';
import { io } from 'socket.io-client';

export const socket = io(apiConfig.BASE_URL);
