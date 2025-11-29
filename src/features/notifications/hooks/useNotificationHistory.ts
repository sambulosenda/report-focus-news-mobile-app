import { useMemo } from 'react';
import { useNotificationHistoryStore } from '../stores/notificationHistoryStore';

export function useNotificationHistory() {
  const notifications = useNotificationHistoryStore(
    (state) => state.notifications
  );
  const addNotification = useNotificationHistoryStore(
    (state) => state.addNotification
  );
  const markAsRead = useNotificationHistoryStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationHistoryStore(
    (state) => state.markAllAsRead
  );
  const removeNotification = useNotificationHistoryStore(
    (state) => state.removeNotification
  );
  const clearAll = useNotificationHistoryStore((state) => state.clearAll);
  const getUnreadCount = useNotificationHistoryStore(
    (state) => state.getUnreadCount
  );

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
  }, [notifications]);

  const unreadNotifications = useMemo(() => {
    return sortedNotifications.filter((n) => !n.read);
  }, [sortedNotifications]);

  return {
    notifications: sortedNotifications,
    unreadNotifications,
    unreadCount: getUnreadCount(),
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
}
