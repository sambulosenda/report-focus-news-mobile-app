import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {
  useFeaturedArticle,
  HeroCard,
  ArticleCard,
  TrendingSection,
  type Article,
} from '@/src/features/articles';
import { CategoryChips, useCategories, useCategoryArticles } from '@/src/features/categories';
import { usePersonalizedFeed } from '@/src/features/topics';
import {
  LoadingSpinner,
  ErrorView,
  HeroCardSkeleton,
  ArticleCardSkeleton,
  NativeHeader,
} from '@/src/shared/components';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const { article: featuredArticle } = useFeaturedArticle();
  const { categories } = useCategories();

  // Use different hooks based on category selection
  const allArticles = usePersonalizedFeed(15);
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

  if (loading && articles.length === 0) {
    return (
      <View className="flex-1 bg-white dark:bg-black" style={{ paddingTop: insets.top }}>
        <View className="bg-white dark:bg-black px-4 h-[72px] justify-center">
          <Text className="text-[34px] font-bold text-gray-900 dark:text-white tracking-tight">
            Report Focus
          </Text>
        </View>
        <HeroCardSkeleton />
        <Text className="text-lg font-semibold px-4 py-3 text-gray-900 dark:text-white">
          Latest Articles
        </Text>
        {[1, 2, 3, 4].map(i => (
          <ArticleCardSkeleton key={i} />
        ))}
      </View>
    );
  }

  if (error && articles.length === 0) {
    return (
      <View className="flex-1 bg-white dark:bg-black" style={{ paddingTop: insets.top }}>
        <ErrorView message={error.message} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Native Header with blur + large title */}
      <NativeHeader
        scrollY={scrollY}
        title="Report Focus"
        showBorder={false}
      >
        {/* Category chips inside header */}
        <CategoryChips
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </NativeHeader>

      <Animated.FlatList
        data={filteredArticles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
