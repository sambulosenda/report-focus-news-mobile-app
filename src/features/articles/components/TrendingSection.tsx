import { memo } from 'react';
import { View, Text } from 'react-native';
import { useTrendingArticles } from '../hooks/useTrendingArticles';
import { TrendingGridCard } from './TrendingGridCard';

interface TrendingSectionProps {
  excludeIds?: string[];
}

export const TrendingSection = memo(function TrendingSection({
  excludeIds = [],
}: TrendingSectionProps) {
  const { articles, loading } = useTrendingArticles(excludeIds, 6);

  if (loading || articles.length === 0) return null;

  return (
    <View className="mx-4 mb-6">
      <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        Trending
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {articles.map(article => (
          <TrendingGridCard key={article.id} article={article} />
        ))}
      </View>
    </View>
  );
});
