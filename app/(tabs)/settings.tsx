import React from 'react';
import { View, Text, Switch, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/src/stores/themeStore';

export default function SettingsScreen() {
  const { theme, isSystemTheme, toggleTheme, setSystemTheme } = useThemeStore();
  const systemTheme = useColorScheme();
  const activeTheme = isSystemTheme ? systemTheme : theme;
  const isDark = activeTheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <View className="px-4 pt-2 pb-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">Settings</Text>
      </View>

      <View className="mx-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-900">
        {/* System Theme Toggle */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
          <View className="flex-row items-center">
            <Ionicons
              name="phone-portrait-outline"
              size={22}
              color={isDark ? '#fff' : '#000'}
              style={{ marginRight: 12 }}
            />
            <Text className="text-base text-gray-900 dark:text-white">Use System Theme</Text>
          </View>
          <Switch
            value={isSystemTheme}
            onValueChange={setSystemTheme}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
          />
        </View>

        {/* Dark Mode Toggle */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons
              name={isDark ? 'moon' : 'moon-outline'}
              size={22}
              color={isDark ? '#fff' : '#000'}
              style={{ marginRight: 12 }}
            />
            <Text className="text-base text-gray-900 dark:text-white">Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            disabled={isSystemTheme}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
          />
        </View>
      </View>

      {/* App Info */}
      <View className="mx-4 mt-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-900">
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={isDark ? '#fff' : '#000'}
              style={{ marginRight: 12 }}
            />
            <Text className="text-base text-gray-900 dark:text-white">Version</Text>
          </View>
          <Text className="text-base text-gray-500">1.0.0</Text>
        </View>
      </View>

      <Text className="text-center mt-6 text-sm text-gray-500">Report Focus News</Text>
    </SafeAreaView>
  );
}
