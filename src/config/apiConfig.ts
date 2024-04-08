const config = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:4000',

  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000',
  SOCKET_PATH: process.env.NEXT_PUBLIC_SOCKET_PATH ?? '/socket.io',
};

export default config;
