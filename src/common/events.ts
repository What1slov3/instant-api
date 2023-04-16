export const EVENTS = {
  USER_MESSAGES: {
    SEND: 'userMessage/send',
    DELETE: 'userMessage/delete'
  },
};

export const SOCKET_EMIT = {
  USER_MESSAGES: {
    SEND: 'userMessage/received',
    DELETE: 'userMessage/deleted'
  }
}