import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useSearchArticles, ArticleCardCompact, type Article } from '@/src/features/articles';
import { SearchBar, SearchResultSkeleton, NativeHeader } from '@/src/shared/components';

export default function SearchScreen() {
  const { query, setQuery, results, loading, clear, hasSearched } = useSearchArticles();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <ArticleCardCompact article={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Article) => item.id, []);

  const ListHeader = useCallback(() => (
    <View style={{ paddingTop: 8 }}>
      <SearchBar value={query} onChangeText={setQuery} onClear={clear} />
    </View>
  ), [query, setQuery, clear]);

  const EmptyComponent = useCallback(() => {
    if (!hasSearched) {
      return (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-lg font-medium text-center mb-2 text-gray-600 dark:text-gray-400">
            Search for articles
          </Text>
          <Text className="text-sm text-center text-gray-500 dark:text-gray-500">
            Enter at least 2 characters to search
          </Text>
        </View>
      );
    }

    if (results.length === 0 && !loading) {
      return (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-lg font-medium text-center mb-2 text-gray-600 dark:text-gray-400">
            No results found
          </Text>
          <Text className="text-sm text-center text-gray-500 dark:text-gray-500">
            Try a different search term
          </Text>
        </View>
      );
    }

    return null;
  }, [hasSearched, results.length, loading]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <NativeHeader scrollY={scrollY} title="Search" />

      {loading && hasSearched ? (
        <View>
          <SearchBar value={query} onChangeText={setQuery} onClear={clear} />
          {[1, 2, 3, 4, 5].map(i => (
            <SearchResultSkeleton key={i} />
          ))}
        </View>
      ) : (
        <Animated.FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyComponent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
