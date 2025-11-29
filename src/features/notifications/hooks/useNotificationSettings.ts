import { useCallback } from 'react';
import { useNotificationSettingsStore } from '../stores/notificationSettingsStore';
import { useFollowedTopics } from '@/src/features/topics';

export function useNotificationSettings() {
  const settings = useNotificationSettingsStore((state) => state.settings);
  const setMasterEnabled = useNotificationSettingsStore(
    (state) => state.setMasterEnabled
  );
  const setBreakingNewsEnabled = useNotificationSettingsStore(
    (state) => state.setBreakingNewsEnabled
  );
  const setTopicNotification = useNotificationSettingsStore(
    (state) => state.setTopicNotification
  );

  const { followedTopics } = useFollowedTopics();

  const toggleMaster = useCallback(
    (enabled: boolean) => {
      setMasterEnabled(enabled);
    },
    [setMasterEnabled]
  );

  const toggleBreakingNews = useCallback(
    (enabled: boolean) => {
      setBreakingNewsEnabled(enabled);
    },
    [setBreakingNewsEnabled]
  );

  const toggleTopicNotification = useCallback(
    (topicId: string, enabled: boolean) => {
      setTopicNotification(topicId, enabled);
    },
    [setTopicNotification]
  );

  const isTopicNotificationEnabled = useCallback(
    (topicId: string): boolean => {
      return settings.topicNotifications[topicId] ?? true;
    },
    [settings.topicNotifications]
  );

  return {
    settings,
    followedTopics,
    toggleMaster,
    toggleBreakingNews,
    toggleTopicNotification,
    isTopicNotificationEnabled,
  };
}
