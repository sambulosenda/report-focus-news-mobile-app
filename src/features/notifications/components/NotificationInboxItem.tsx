import React from 'react';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { formatDistanceToNow } from 'date-fns';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ReceivedNotification } from '../types';

interface Props {
  notification: ReceivedNotification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export function NotificationInboxItem({
  notification,
  onMarkAsRead,
  onRemove,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onMarkAsRead(notification.id);

    if (notification.articleId) {
      router.push(`/article/${notification.articleId}`);
    }
  };

  const getTypeIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (notification.type) {
      case 'breaking':
        return 'flash';
      case 'topic':
        return 'bookmark';
      default:
        return 'newspaper';
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-row p-4 border-b border-gray-200 dark:border-neutral-800 ${
        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}>
      {notification.imageUrl ? (
        <Image
          source={{ uri: notification.imageUrl }}
          style={{ width: 60, height: 60, borderRadius: 8 }}
          contentFit="cover"
        />
      ) : (
        <View className="w-[60px] h-[60px] rounded-lg bg-gray-200 dark:bg-neutral-700 items-center justify-center">
          <Ionicons
            name={getTypeIcon()}
            size={24}
            color={isDark ? '#888' : '#666'}
          />
        </View>
      )}

      <View className="flex-1 ml-3">
        <View className="flex-row items-center mb-1">
          {notification.type === 'breaking' && (
            <View className="bg-red-500 px-2 py-0.5 rounded mr-2">
              <Text className="text-white text-xs font-bold">BREAKING</Text>
            </View>
          )}
          {!notification.read && (
            <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
          )}
        </View>

        <Text
          className="text-base font-semibold text-gray-900 dark:text-white"
          numberOfLines={2}>
          {notification.title}
        </Text>

        {notification.body ? (
          <Text
            className="text-sm text-gray-500 dark:text-gray-400 mt-1"
            numberOfLines={1}>
            {notification.body}
          </Text>
        ) : null}

        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {formatDistanceToNow(new Date(notification.receivedAt), {
            addSuffix: true,
          })}
        </Text>
      </View>
    </Pressable>
  );
}
