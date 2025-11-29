import { memo, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRelatedArticles } from '../hooks/useRelatedArticles';
import { RelatedArticleCard } from './RelatedArticleCard';
import type { Article } from '../types';

interface RelatedArticlesProps {
  categoryIds: string[];
  currentArticleId: string;
}

export const RelatedArticles = memo(function RelatedArticles({
  categoryIds,
  currentArticleId,
}: RelatedArticlesProps) {
  const { articles, loading } = useRelatedArticles(categoryIds, currentArticleId);

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <RelatedArticleCard article={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Article) => item.id, []);

  if (loading || articles.length === 0) return null;

  return (
    <View className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
      <Text className="text-lg font-semibold mb-4 px-4 text-gray-900 dark:text-white">
        Related Articles
      </Text>
      <FlatList
        horizontal
        data={articles}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
});
