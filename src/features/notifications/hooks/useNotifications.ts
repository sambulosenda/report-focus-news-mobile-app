import { useEffect, useRef, useCallback, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import * as Device from 'expo-device';
import {
  requestPermissions,
  getExpoPushToken,
  setupAndroidChannels,
  setBadgeCount,
} from '../services/notificationService';
import {
  registerDeviceToken,
  updateTokenPreferences,
} from '../services/tokenService';
import { useNotificationSettingsStore } from '../stores/notificationSettingsStore';
import { useNotificationHistoryStore } from '../stores/notificationHistoryStore';
import { useFollowedTopics } from '@/src/features/topics';

export function useNotifications() {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null
  );
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const settings = useNotificationSettingsStore((state) => state.settings);
  const addNotification = useNotificationHistoryStore(
    (state) => state.addNotification
  );
  const notifications = useNotificationHistoryStore(
    (state) => state.notifications
  );
  const { followedIds } = useFollowedTopics();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const initialize = useCallback(async () => {
    if (!Device.isDevice) return;

    await setupAndroidChannels();

    const granted = await requestPermissions();
    setPermissionGranted(granted);

    if (!granted) return;

    const token = await getExpoPushToken();
    if (token) {
      setPushToken(token);

      await registerDeviceToken({
        token,
        platform: Platform.OS as 'ios' | 'android',
        deviceId: Device.deviceName || 'unknown',
        followedTopicIds: followedIds,
        breakingNewsEnabled: settings.breakingNewsEnabled,
      });
    }
  }, [followedIds, settings.breakingNewsEnabled]);

  // Handle incoming notifications (foreground)
  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const { title, body, data } = notification.request.content;

        addNotification({
          title: title || 'New Article',
          body: body || '',
          articleId: data?.articleId as string | undefined,
          categoryId: data?.categoryId as string | undefined,
          type:
            (data?.type as 'breaking' | 'topic' | 'general') || 'general',
          imageUrl: data?.imageUrl as string | undefined,
        });
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
    };
  }, [addNotification]);

  // Handle notification response (tap)
  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data?.articleId) {
          router.push(`/article/${data.articleId}`);
        }
      });

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Update badge count
  useEffect(() => {
    setBadgeCount(unreadCount);
  }, [unreadCount]);

  // Sync preferences when settings or topics change
  useEffect(() => {
    if (pushToken && settings.masterEnabled) {
      const enabledTopicIds = settings.topicNotifications
        ? Object.entries(settings.topicNotifications)
            .filter(([_, enabled]) => enabled)
            .map(([id]) => parseInt(id, 10))
        : followedIds;

      updateTokenPreferences(
        pushToken,
        enabledTopicIds,
        settings.breakingNewsEnabled
      );
    }
  }, [pushToken, settings, followedIds]);

  return {
    initialize,
    pushToken,
    permissionGranted,
    requestPermissions,
    unreadCount,
  };
}
