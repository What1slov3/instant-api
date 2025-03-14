export const EMITTER_EVENTS = {
  USER_MESSAGES: {
    SEND: 'userMessage/send',
    DELETE: 'userMessage/delete',
  },
  CHANNELS: {
    KICK_USER: 'channels/kickUser'
  },
  PERMISSIONS: {
    CREATE_DEFAULT: 'permission/createDefault'
  }
} as const;
