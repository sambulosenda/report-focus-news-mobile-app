import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useArticles,
  useFeaturedArticle,
  HeroCard,
  ArticleCard,
  TrendingSection,
  type Article,
} from '@/src/features/articles';
import { CategoryChips, useCategories, useCategoryArticles } from '@/src/features/categories';
import { LoadingSpinner, ErrorView } from '@/src/shared/components';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { article: featuredArticle } = useFeaturedArticle();
  const { categories } = useCategories();

  // Use different hooks based on category selection
  const allArticles = useArticles(15);
  const categoryArticles = useCategoryArticles(selectedCategory);

  // Choose which data source to use
  const {
    articles,
    loading,
    error,
    loadMore,
    refetch,
    hasMore,
  } = selectedCategory === null ? allArticles : categoryArticles;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory !== null || !featuredArticle) return articles;
    return articles.filter(a => a.id !== featuredArticle.id);
  }, [articles, featuredArticle, selectedCategory]);

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <ArticleCard article={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Article) => item.id, []);

  const ListHeader = useCallback(
    () => (
      <View>
        {selectedCategory === null && (
          <>
            <View className="px-4 pt-2 pb-4">
              <Text className="text-3xl font-bold text-gray-900 dark:text-white">Report Focus</Text>
              <Text className="text-base mt-1 text-gray-600 dark:text-gray-400">
                Stay informed with the latest news
              </Text>
            </View>
            {featuredArticle && <HeroCard article={featuredArticle} />}
            <TrendingSection excludeIds={featuredArticle ? [featuredArticle.id] : []} />
          </>
        )}
        <Text className="text-lg font-semibold px-4 py-3 text-gray-900 dark:text-white">
          {selectedCategory === null ? 'Latest Articles' : 'Articles'}
        </Text>
      </View>
    ),
    [featuredArticle, selectedCategory],
  );

  const ListFooter = useCallback(
    () => (loading && articles.length > 0 ? <LoadingSpinner size="small" /> : null),
    [loading, articles.length],
  );

  const ListEmpty = useCallback(
    () =>
      !loading ? (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-500 dark:text-gray-400">No articles found</Text>
        </View>
      ) : null,
    [loading],
  );

  if (loading && articles.length === 0 && selectedCategory === null) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black">
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error && articles.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black">
        <ErrorView message={error.message} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top']}>
      {/* Sticky Category Bar */}
      <CategoryChips
        categories={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <FlatList
        data={filteredArticles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
