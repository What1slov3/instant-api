export const SOCKET_EVENTS = {
  USER_MESSAGES: {
    SEND: 'userMessage/received',
    DELETE: 'userMessage/deleted',
  },
  CHANNELS: {
    KICK_USER: 'channels/kickUser',
    JOIN: 'channels/join',
  },
  CHATS: {
    JOIN: 'chats/join',
  },
  CONNECT: 'user/connect',
};
