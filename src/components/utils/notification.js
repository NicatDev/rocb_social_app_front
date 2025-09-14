// utils/notification.js
let notification = null;

export const setNotificationApi = (api) => {
  notification = api;
};

export const notify = {
  success: ({ message, description }) =>
    notification?.success({ message, description }),

  error: ({ message, description }) =>
    notification?.error({ message, description }),

  info: ({ message, description }) =>
    notification?.info({ message, description }),

  warning: ({ message, description }) =>
    notification?.warning({ message, description }),
};
