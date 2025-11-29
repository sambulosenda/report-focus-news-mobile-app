import React from 'react';
import { View, Text, FlatList, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookmarks, BookmarkedArticleCard } from '@/src/features/bookmarks';

export default function BookmarksScreen() {
  const { bookmarks, count } = useBookmarks();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <View className="px-4 pt-2 pb-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          Saved
        </Text>
        {count > 0 && (
          <Text className="text-sm text-gray-500 mt-1">
            {count} article{count !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {count === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons
            name="bookmark-outline"
            size={64}
            color={isDark ? '#666' : '#ccc'}
          />
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4 text-center">
            No saved articles
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Tap the bookmark icon on any article to save it for later
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <BookmarkedArticleCard article={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
