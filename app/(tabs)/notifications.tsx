import React from 'react';
import { View, Text, FlatList, useColorScheme, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  useNotificationHistory,
  NotificationInboxItem,
} from '@/src/features/notifications';

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationHistory();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <View className="px-4 pt-2 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Text className="text-sm text-gray-500 mt-1">
              {unreadCount} unread
            </Text>
          )}
        </View>
        {notifications.length > 0 && (
          <Pressable
            onPress={markAllAsRead}
            className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-800">
            <Text className="text-sm text-accent font-medium">Mark all read</Text>
          </Pressable>
        )}
      </View>

      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons
            name="notifications-outline"
            size={64}
            color={isDark ? '#666' : '#ccc'}
          />
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4 text-center">
            No notifications yet
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            You'll receive notifications for breaking news and topics you follow
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationInboxItem
              notification={item}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
