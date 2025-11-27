import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useArticles } from '@/src/hooks/useArticles';
import { useFeaturedArticle } from '@/src/hooks/useFeaturedArticle';
import { HeroCard } from '@/src/components/HeroCard';
import { ArticleCard } from '@/src/components/ArticleCard';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { ErrorView } from '@/src/components/ErrorView';
import { Article } from '@/src/types/article';

export default function HomeScreen() {
  const { article: featuredArticle } = useFeaturedArticle();
  const { articles, loading, error, loadMore, refetch, hasMore } = useArticles(15);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredArticles = useMemo(() => {
    if (!featuredArticle) return articles;
    return articles.filter(a => a.id !== featuredArticle.id);
  }, [articles, featuredArticle]);

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <ArticleCard article={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Article) => item.id, []);

  const ListHeader = useCallback(
    () => (
      <View>
        <View className="px-4 pt-2 pb-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">Report Focus</Text>
          <Text className="text-base mt-1 text-gray-600 dark:text-gray-400">
            Stay informed with the latest news
          </Text>
        </View>
        {featuredArticle && <HeroCard article={featuredArticle} />}
        <Text className="text-lg font-semibold px-4 py-3 text-gray-900 dark:text-white">
          Latest Articles
        </Text>
      </View>
    ),
    [featuredArticle],
  );

  const ListFooter = useCallback(
    () => (loading && articles.length > 0 ? <LoadingSpinner size="small" /> : null),
    [loading, articles.length],
  );

  if (loading && articles.length === 0) {
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
      <FlatList
        data={filteredArticles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
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
