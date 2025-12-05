import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useBookmarks, BookmarkedArticleCard } from '@/src/features/bookmarks';
import { useEffectiveTheme } from '@/src/features/theme';
import { Icon, NativeHeader } from '@/src/shared/components';

export default function BookmarksScreen() {
  const { bookmarks, count } = useBookmarks();
  const { isDark } = useEffectiveTheme();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const subtitle = count > 0 ? `${count} article${count !== 1 ? 's' : ''}` : undefined;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <NativeHeader scrollY={scrollY} title="Saved" subtitle={subtitle} />

      {count === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Icon
            name="bookmark"
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
        <Animated.FlatList
          data={bookmarks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <BookmarkedArticleCard article={item} />}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
