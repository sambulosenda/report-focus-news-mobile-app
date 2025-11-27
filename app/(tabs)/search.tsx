import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSearchArticles } from '../../src/hooks/useSearchArticles';
import { SearchBar } from '../../src/components/SearchBar';
import { ArticleCardCompact } from '../../src/components/ArticleCardCompact';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { Article } from '../../src/types/article';

export default function SearchScreen() {
  const { query, setQuery, results, loading, clear, hasSearched } = useSearchArticles();

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <ArticleCardCompact article={item} />,
    []
  );

  const keyExtractor = useCallback((item: Article) => item.id, []);

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
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <View className="px-4 pt-2 pb-4">
        <Text className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Search
        </Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} onClear={clear} />

      {loading && hasSearched ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={EmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
