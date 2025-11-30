import { View, Text, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFollowedTopics } from '../hooks/useFollowedTopics';
import { useThemeStore } from '@/src/features/theme';
import { haptics } from '@/src/shared/utils/haptics';

export function TopicsList() {
  const { followedTopics, unfollowTopic, count } = useFollowedTopics();
  const systemTheme = useColorScheme();
  const { theme, isSystemTheme } = useThemeStore();
  const effectiveTheme = isSystemTheme ? systemTheme : theme;
  const isDark = effectiveTheme === 'dark';

  const handleUnfollow = (id: string) => {
    haptics.light();
    unfollowTopic(id);
  };

  if (count === 0) {
    return (
      <View className="px-4 py-3">
        <Text className="text-gray-500 text-sm text-center">
          No topics followed yet. Tap the heart on any category to follow it.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {followedTopics.map((topic, index) => (
        <View
          key={topic.id}
          className={`flex-row items-center justify-between px-4 py-3 ${
            index < followedTopics.length - 1
              ? 'border-b border-gray-200 dark:border-neutral-800'
              : ''
          }`}>
          <Text className="text-base text-gray-900 dark:text-white">
            {topic.name}
          </Text>
          <Pressable onPress={() => handleUnfollow(topic.id)} hitSlop={8}>
            <Ionicons
              name="heart"
              size={20}
              color="#007AFF"
            />
          </Pressable>
        </View>
      ))}
    </View>
  );
}
