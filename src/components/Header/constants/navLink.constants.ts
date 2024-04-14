export const links = [
  {
    label: 'Home',
    route: '/',
    authenticated: false,
  },
  {
    label: 'Conversaciones',
    route: '/conversations',
    authenticated: false,
  },
  {
    label: 'Asistente',
    route: '/myAssistant',
    authenticated: true,
  },
];

export const adminLinks = [
  // {
  //   label: 'Constants',
  //   route: '/globalConstants',
  // },
  {
    label: 'Imagenes',
    route: '/images/1',
    authenticated: true,
  },
  {
    label: 'Generar Audio',
    route: '/textToSpeech',
    authenticated: true,
  },
  {
    label: 'Users',
    route: '/admin/users',
    authenticated: true,
  },
];
