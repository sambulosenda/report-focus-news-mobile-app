import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationSettingsState, NotificationSettings } from '../types';

const defaultSettings: NotificationSettings = {
  masterEnabled: true,
  breakingNewsEnabled: true,
  topicNotifications: {},
  lastPermissionCheck: null,
};

export const useNotificationSettingsStore = create<NotificationSettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      setMasterEnabled: (enabled) =>
        set((state) => ({
          settings: { ...state.settings, masterEnabled: enabled },
        })),

      setBreakingNewsEnabled: (enabled) =>
        set((state) => ({
          settings: { ...state.settings, breakingNewsEnabled: enabled },
        })),

      setTopicNotification: (topicId, enabled) =>
        set((state) => ({
          settings: {
            ...state.settings,
            topicNotifications: {
              ...state.settings.topicNotifications,
              [topicId]: enabled,
            },
          },
        })),

      syncWithFollowedTopics: (topicIds) =>
        set((state) => {
          const newTopicNotifications: Record<string, boolean> = {};
          topicIds.forEach((id) => {
            newTopicNotifications[id] =
              state.settings.topicNotifications[id] ?? true;
          });
          return {
            settings: {
              ...state.settings,
              topicNotifications: newTopicNotifications,
            },
          };
        }),
    }),
    {
      name: 'notification-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
