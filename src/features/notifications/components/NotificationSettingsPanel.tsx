import React, { useState } from 'react';
import { View, Text, Switch, useColorScheme, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationSettings } from '../hooks/useNotificationSettings';

export function NotificationSettingsPanel() {
  const {
    settings,
    followedTopics,
    toggleMaster,
    toggleBreakingNews,
    toggleTopicNotification,
    isTopicNotificationEnabled,
  } = useNotificationSettings();

  const [topicsExpanded, setTopicsExpanded] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="mx-4 mt-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-900">
      {/* Master Toggle */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-center">
          <Ionicons
            name="notifications-outline"
            size={22}
            color={isDark ? '#fff' : '#000'}
            style={{ marginRight: 12 }}
          />
          <Text className="text-base text-gray-900 dark:text-white">
            Push Notifications
          </Text>
        </View>
        <Switch
          value={settings.masterEnabled}
          onValueChange={toggleMaster}
          trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
        />
      </View>

      {/* Breaking News Toggle */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
        <View className="flex-row items-center pl-9">
          <Text
            className={`text-base ${
              settings.masterEnabled
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-400 dark:text-gray-600'
            }`}>
            Breaking News
          </Text>
        </View>
        <Switch
          value={settings.breakingNewsEnabled && settings.masterEnabled}
          onValueChange={toggleBreakingNews}
          disabled={!settings.masterEnabled}
          trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
        />
      </View>

      {/* Topic Notifications */}
      {followedTopics.length > 0 && (
        <>
          <Pressable
            onPress={() => setTopicsExpanded(!topicsExpanded)}
            className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
            <View className="flex-row items-center pl-9">
              <Text
                className={`text-base ${
                  settings.masterEnabled
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-600'
                }`}>
                Topic Notifications
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-accent px-2 py-0.5 rounded-full mr-2">
                <Text className="text-white text-xs font-semibold">
                  {followedTopics.length}
                </Text>
              </View>
              <Ionicons
                name={topicsExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={isDark ? '#666' : '#999'}
              />
            </View>
          </Pressable>

          {topicsExpanded &&
            followedTopics.map((topic, index) => (
              <View
                key={topic.id}
                className={`flex-row items-center justify-between px-4 py-3 ${
                  index < followedTopics.length - 1
                    ? 'border-b border-gray-200 dark:border-neutral-800'
                    : ''
                }`}>
                <Text
                  className={`text-base pl-9 ${
                    settings.masterEnabled
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}>
                  {topic.name}
                </Text>
                <Switch
                  value={
                    isTopicNotificationEnabled(topic.id) &&
                    settings.masterEnabled
                  }
                  onValueChange={(enabled) =>
                    toggleTopicNotification(topic.id, enabled)
                  }
                  disabled={!settings.masterEnabled}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                />
              </View>
            ))}
        </>
      )}
    </View>
  );
}
