import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationHistoryState, ReceivedNotification } from '../types';

const MAX_NOTIFICATIONS = 50;

export const useNotificationHistoryStore = create<NotificationHistoryState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) =>
        set((state) => {
          const newNotification: ReceivedNotification = {
            ...notification,
            id: Date.now().toString(),
            receivedAt: new Date().toISOString(),
            read: false,
          };
          return {
            notifications: [newNotification, ...state.notifications].slice(
              0,
              MAX_NOTIFICATIONS
            ),
          };
        }),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notifications: [] }),

      getUnreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: 'notification-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
